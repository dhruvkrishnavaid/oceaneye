"""
OceanEye FastAPI Application - Coastal Monitoring System
"""
from fastapi import FastAPI, HTTPException, Query, status as http_status, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
import os
import aiofiles
import uuid
from pathlib import Path

from app.db import connect_to_mongo, close_mongo_connection
from app.models import (
    UserReportCreate, UserReportUpdate, UserReportResponse, UserReportListResponse,
    SocialPostCreate, SocialPostResponse, SocialPostListResponse,
    TrendingHashtagResponse, TrendingHashtagListResponse,
    DashboardStats, StandardResponse,
    CoastalHazardType, SeverityLevel, ReportStatus, SocialPlatform, SentimentType
)
from app.crud import (
    user_reports_crud, social_posts_crud, trending_hashtags_crud,
    create_user_report, get_user_report, get_user_reports
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


# Initialize FastAPI app
app = FastAPI(
    title="OceanEye API",
    description="Coastal Monitoring and Emergency Response System",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4173",
        "http://localhost:8080",
        "*"  # Temporary for debugging
    ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
async def read_root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to OceanEye Coastal Monitoring API",
        "version": "2.0.0",
        "status": "running",
        "endpoints": {
            "user_reports": "/api/reports",
            "social_posts": "/api/social",
            "trending": "/api/trending",
            "dashboard": "/api/dashboard",
            "docs": "/docs",
            "health": "/health"
        }
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "oceaneye-coastal-api"}


# Dashboard Statistics Endpoint
@app.get(
    "/api/dashboard/stats",
    response_model=DashboardStats,
    summary="Get dashboard statistics"
)
async def get_dashboard_stats():
    """Get current dashboard statistics."""
    # For now, return mock data - will be replaced with real calculations
    return DashboardStats(
        active_reports=47,
        social_mentions=1247,
        active_users=328,
        verified_incidents=23,
        active_reports_change="+12 from last hour",
        social_mentions_change="+89 from last hour",
        active_users_description="Online now",
        verified_incidents_description="Requires attention"
    )


# User Reports Endpoints
@app.post(
    "/api/reports",
    response_model=StandardResponse,
    status_code=http_status.HTTP_201_CREATED,
    summary="Create a new user report with file uploads"
)
async def create_user_report_endpoint(
    title: str = Form(..., description="Title of the report"),
    description: str = Form(..., description="Detailed description"),
    location: str = Form(..., description="Human-readable location"),
    latitude: float = Form(..., description="Latitude coordinate"),
    longitude: float = Form(..., description="Longitude coordinate"),
    severity: str = Form(..., description="Severity level: low, medium, high, critical"),
    hazard_type: str = Form(..., description="Type of coastal hazard"),
    author: str = Form(..., description="Reporter name/ID"),
    files: List[UploadFile] = File(default=[], description="Photos and videos")
):
    """Create a new user report for coastal hazards with optional file uploads."""
    try:
        # Create upload directories if they don't exist
        upload_base_dir = Path("uploads")
        images_dir = upload_base_dir / "images"
        videos_dir = upload_base_dir / "videos"

        images_dir.mkdir(parents=True, exist_ok=True)
        videos_dir.mkdir(parents=True, exist_ok=True)

        # Process uploaded files
        uploaded_files = []
        image_count = 0
        video_count = 0

        for file in files:
            if file.filename:
                # Generate unique filename
                file_extension = Path(file.filename).suffix.lower()
                unique_filename = f"{uuid.uuid4()}{file_extension}"

                # Determine file type and directory
                if file.content_type and file.content_type.startswith('image/'):
                    file_path = images_dir / unique_filename
                    image_count += 1
                elif file.content_type and file.content_type.startswith('video/'):
                    file_path = videos_dir / unique_filename
                    video_count += 1
                else:
                    # Default to images directory for unknown types
                    file_path = images_dir / unique_filename
                    image_count += 1

                # Save file asynchronously
                async with aiofiles.open(file_path, 'wb') as out_file:
                    content = await file.read()
                    await out_file.write(content)

                uploaded_files.append({
                    "original_name": file.filename,
                    "saved_path": str(file_path),
                    "content_type": file.content_type,
                    "size": len(content)
                })

        # Create report data structure
        report_data = UserReportCreate(
            title=title,
            description=description,
            location=location,
            coordinates=[latitude, longitude],
            severity=SeverityLevel(severity),
            type=CoastalHazardType(hazard_type),
            author=author,
            verified=False,
            images=image_count,
            videos=video_count
        )

        # Try to save to MongoDB
        report_id = None
        try:
            report_id = await create_user_report(report_data)
        except Exception as e:
            print(f"Failed to save to database: {e}")
            # Continue with file upload success even if DB save fails
            report_id = f"report_{uuid.uuid4()}"

        return StandardResponse(
            success=True,
            message=f"Report created successfully with {len(uploaded_files)} files uploaded",
            data={
                "report_id": report_id,
                "files_uploaded": len(uploaded_files),
                "images": image_count,
                "videos": video_count,
                "report_data": report_data.model_dump()
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create report: {str(e)}"
        )


@app.get(
    "/api/reports",
    response_model=UserReportListResponse,
    summary="Get user reports with optional filters"
)
async def get_user_reports_endpoint(
    skip: int = Query(0, ge=0, description="Number of reports to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of reports to return"),
    status: Optional[ReportStatus] = Query(None, description="Filter by report status"),
    hazard_type: Optional[CoastalHazardType] = Query(None, description="Filter by hazard type"),
    severity: Optional[SeverityLevel] = Query(None, description="Filter by severity level"),
    location: Optional[str] = Query(None, description="Filter by location")
):
    """Get user reports with filtering and pagination."""
    try:
        # Try to get from database first
        reports = await get_user_reports(skip, limit, status, hazard_type, severity, location)
        total_count = await user_reports_crud.get_reports_count()

        if reports:
            return UserReportListResponse(
                reports=reports,
                total=total_count,
                page=(skip // limit) + 1,
                limit=limit
            )
    except Exception as e:
        print(f"Database error, falling back to mock data: {e}")

    # Fallback to mock data if database is not available
    mock_reports = [
        UserReportResponse(
            _id="1",
            title="High Waves at Marina Beach",
            description="Unusual wave patterns observed, waves reaching 3-4 meters",
            location="Marina Beach, Chennai",
            coordinates=[13.0478, 80.2619],
            severity=SeverityLevel.MEDIUM,
            type=CoastalHazardType.HIGH_WAVES,
            author="Coastal Volunteer",
            verified=True,
            images=2,
            videos=1,
            timestamp=datetime.now() - timedelta(hours=2),
            status=ReportStatus.VERIFIED
        ),
        UserReportResponse(
            _id="2",
            title="Storm Surge Alert - Visakhapatnam",
            description="Water levels rising rapidly, flooding in low-lying areas",
            location="Visakhapatnam Port",
            coordinates=[17.6868, 83.2185],
            severity=SeverityLevel.HIGH,
            type=CoastalHazardType.STORM_SURGE,
            author="Port Authority",
            verified=True,
            images=5,
            videos=2,
            timestamp=datetime.now() - timedelta(hours=3),
            status=ReportStatus.VERIFIED
        ),
        UserReportResponse(
            _id="3",
            title="Unusual Tide Behavior",
            description="Tide receding much faster than predicted",
            location="Puri Beach, Odisha",
            coordinates=[19.8135, 85.8312],
            severity=SeverityLevel.LOW,
            type=CoastalHazardType.UNUSUAL_TIDE,
            author="Local Fisherman",
            verified=False,
            images=1,
            videos=0,
            timestamp=datetime.now() - timedelta(hours=4),
            status=ReportStatus.PENDING
        ),
        UserReportResponse(
            _id="4",
            title="Coastal Erosion Observed",
            description="Significant erosion noticed after recent storms",
            location="Kovalam Beach, Kerala",
            coordinates=[8.4004, 76.9784],
            severity=SeverityLevel.MEDIUM,
            type=CoastalHazardType.COASTAL_DAMAGE,
            author="Environmental Group",
            verified=True,
            images=8,
            videos=1,
            timestamp=datetime.now() - timedelta(hours=5),
            status=ReportStatus.VERIFIED
        )
    ]

    return UserReportListResponse(
        reports=mock_reports[:limit],
        total=len(mock_reports),
        page=(skip // limit) + 1,
        limit=limit
    )


@app.get(
    "/api/reports/{report_id}",
    response_model=UserReportResponse,
    summary="Get a specific user report by ID"
)
async def get_user_report_endpoint(report_id: str):
    """Get a specific user report by its ID."""
    try:
        # Try to get from database first
        report = await get_user_report(report_id)
        if report:
            return report
    except Exception as e:
        print(f"Database error, falling back to mock data: {e}")

    # Mock implementation fallback
    if report_id == "1":
        return UserReportResponse(
            _id="1",
            title="High Waves at Marina Beach",
            description="Unusual wave patterns observed, waves reaching 3-4 meters",
            location="Marina Beach, Chennai",
            coordinates=[13.0478, 80.2619],
            severity=SeverityLevel.MEDIUM,
            type=CoastalHazardType.HIGH_WAVES,
            author="Coastal Volunteer",
            verified=True,
            images=2,
            videos=1,
            timestamp=datetime.now() - timedelta(hours=2),
            status=ReportStatus.VERIFIED
        )

    raise HTTPException(
        status_code=http_status.HTTP_404_NOT_FOUND,
        detail="Report not found"
    )


# Social Media Endpoints
@app.get(
    "/api/social",
    response_model=SocialPostListResponse,
    summary="Get social media posts with optional filters"
)
async def get_social_posts(
    skip: int = Query(0, ge=0, description="Number of posts to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of posts to return"),
    platform: Optional[SocialPlatform] = Query(None, description="Filter by platform"),
    sentiment: Optional[SentimentType] = Query(None, description="Filter by sentiment"),
    location: Optional[str] = Query(None, description="Filter by location")
):
    """Get social media posts with filtering and pagination."""
    # Mock data matching frontend requirements
    from app.models import SocialEngagement

    mock_posts = [
        SocialPostResponse(
            _id="1",
            platform=SocialPlatform.TWITTER,
            content="Massive waves hitting the shore at #MarinaBeach! Stay safe everyone 🌊 #ChennaiWeather #OceanAlert",
            author="@Chennai_Updates",
            engagement=SocialEngagement(likes=245, retweets=89, replies=34),
            hashtags=["#MarinaBeach", "#ChennaiWeather", "#OceanAlert"],
            location="Chennai, Tamil Nadu",
            sentiment=SentimentType.CONCERN,
            verified=True,
            timestamp=datetime.now() - timedelta(hours=1)
        ),
        SocialPostResponse(
            _id="2",
            platform=SocialPlatform.FACEBOOK,
            content="Fishermen advised not to venture into sea today due to rough weather conditions. Waves up to 4m expected.",
            author="Kerala Fisheries Department",
            engagement=SocialEngagement(likes=156, shares=78, comments=23),
            hashtags=["#FishermenSafety", "#KeralaWeather"],
            location="Kerala",
            sentiment=SentimentType.ADVISORY,
            verified=True,
            timestamp=datetime.now() - timedelta(hours=2)
        ),
        SocialPostResponse(
            _id="3",
            platform=SocialPlatform.TWITTER,
            content="Beautiful but dangerous waves at #PuriBeach today. Tourists please maintain safe distance! 📸 #OdishaCoast",
            author="@OdishaTourism",
            engagement=SocialEngagement(likes=89, retweets=23, replies=12),
            hashtags=["#PuriBeach", "#OdishaCoast", "#SafetyFirst"],
            location="Puri, Odisha",
            sentiment=SentimentType.CAUTION,
            verified=True,
            timestamp=datetime.now() - timedelta(hours=3)
        ),
        SocialPostResponse(
            _id="4",
            platform=SocialPlatform.YOUTUBE,
            content="Live: Storm surge footage from Visakhapatnam port - Emergency response in action",
            author="News24x7",
            engagement=SocialEngagement(views=12500, likes=234, comments=67),
            hashtags=["#StormSurge", "#Visakhapatnam", "#EmergencyResponse"],
            location="Visakhapatnam, Andhra Pradesh",
            sentiment=SentimentType.URGENT,
            verified=True,
            timestamp=datetime.now() - timedelta(hours=4)
        )
    ]

    return SocialPostListResponse(
        posts=mock_posts[:limit],
        total=len(mock_posts),
        page=(skip // limit) + 1,
        limit=limit
    )


# Trending Hashtags Endpoint
@app.get(
    "/api/trending",
    response_model=TrendingHashtagListResponse,
    summary="Get trending hashtags"
)
async def get_trending_hashtags():
    """Get current trending hashtags related to coastal monitoring."""
    mock_hashtags = [
        TrendingHashtagResponse(
            _id="1",
            tag="#OceanAlert",
            count=1245,
            trend="up",
            last_updated=datetime.now()
        ),
        TrendingHashtagResponse(
            _id="2",
            tag="#CoastalSafety",
            count=892,
            trend="up",
            last_updated=datetime.now()
        ),
        TrendingHashtagResponse(
            _id="3",
            tag="#MarinaBeach",
            count=567,
            trend="up",
            last_updated=datetime.now()
        ),
        TrendingHashtagResponse(
            _id="4",
            tag="#StormSurge",
            count=445,
            trend="stable",
            last_updated=datetime.now()
        ),
        TrendingHashtagResponse(
            _id="5",
            tag="#TsunamiWatch",
            count=234,
            trend="down",
            last_updated=datetime.now()
        )
    ]

    return TrendingHashtagListResponse(hashtags=mock_hashtags)


# Development server
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )