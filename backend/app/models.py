"""
Pydantic models for OceanEye coastal monitoring application.
Models designed to match frontend Dashboard component requirements.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


# Enums for coastal monitoring
class CoastalHazardType(str, Enum):
    """Types of coastal hazards and incidents."""
    # Weather & Climate Events
    HURRICANE = "hurricane"
    STORM_SURGE = "storm_surge"
    FLOODING = "flooding"
    WATERSPOUT = "waterspout"
    HIGH_WAVES = "high_waves"
    UNUSUAL_TIDE = "unusual_tide"

    # Geological Events
    TSUNAMI = "tsunami"
    EARTHQUAKE = "earthquake"
    LANDSLIDE = "landslide"

    # Erosion & Physical Changes
    COASTAL_EROSION = "coastal_erosion"
    EROSION = "erosion"
    SEA_LEVEL_RISE = "sea_level_rise"
    COASTAL_DAMAGE = "coastal_damage"

    # Pollution & Contamination
    OIL_SPILL = "oil_spill"
    MARITIME_POLLUTION = "maritime_pollution"
    PLASTIC_DEBRIS = "plastic_debris"
    DEBRIS = "debris"
    OCEAN_NOISE_POLLUTION = "ocean_noise_pollution"

    # Biological & Ecological
    HARMFUL_ALGAL_BLOOM = "harmful_algal_bloom"
    OVERFISHING = "overfishing"
    HABITAT_DESTRUCTION = "habitat_destruction"
    DANGEROUS_SEA_CREATURES = "dangerous_sea_creatures"

    # Climate & Chemical Changes
    OCEAN_WARMING = "ocean_warming"
    OCEAN_ACIDIFICATION = "ocean_acidification"

    # Maritime Accidents
    SHIPPING_ACCIDENT = "shipping_accident"

    # Other
    OTHER = "other"


class SeverityLevel(str, Enum):
    """Severity levels for incidents."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ReportStatus(str, Enum):
    """Status of user reports."""
    PENDING = "pending"
    VERIFIED = "verified"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"
    FALSE_ALARM = "false_alarm"


class SocialPlatform(str, Enum):
    """Social media platforms."""
    TWITTER = "Twitter"
    FACEBOOK = "Facebook"
    YOUTUBE = "YouTube"
    INSTAGRAM = "Instagram"
    LINKEDIN = "LinkedIn"


class SentimentType(str, Enum):
    """Sentiment analysis types."""
    CONCERN = "concern"
    ADVISORY = "advisory"
    CAUTION = "caution"
    URGENT = "urgent"
    POSITIVE = "positive"
    NEUTRAL = "neutral"


# User Report Models
class UserReportBase(BaseModel):
    """Base model for user reports."""
    title: str = Field(..., description="Title of the report", min_length=1, max_length=200)
    description: str = Field(..., description="Detailed description", min_length=1)
    location: str = Field(..., description="Human-readable location", min_length=1)
    coordinates: List[float] = Field(..., description="[latitude, longitude]")
    severity: SeverityLevel = Field(default=SeverityLevel.MEDIUM)
    type: CoastalHazardType = Field(..., description="Type of coastal hazard")
    author: str = Field(..., description="Reporter name/ID", min_length=1)
    verified: bool = Field(default=False, description="Whether report is verified")
    images: int = Field(default=0, description="Number of images attached", ge=0)
    videos: int = Field(default=0, description="Number of videos attached", ge=0)

    @field_validator('coordinates')
    @classmethod
    def validate_coordinates(cls, v):
        if len(v) != 2:
            raise ValueError('Coordinates must be [latitude, longitude]')
        lat, lng = v
        if not (-90 <= lat <= 90):
            raise ValueError('Latitude must be between -90 and 90')
        if not (-180 <= lng <= 180):
            raise ValueError('Longitude must be between -180 and 180')
        return v


class UserReportCreate(UserReportBase):
    """Model for creating user reports."""
    pass


class UserReportUpdate(BaseModel):
    """Model for updating user reports."""
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    coordinates: Optional[List[float]] = None
    severity: Optional[SeverityLevel] = None
    type: Optional[CoastalHazardType] = None
    verified: Optional[bool] = None
    images: Optional[int] = None
    videos: Optional[int] = None


class UserReportResponse(UserReportBase):
    """Model for user report responses."""
    id: str = Field(..., alias="_id")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: ReportStatus = Field(default=ReportStatus.PENDING)
    updated_at: Optional[datetime] = None

    model_config = {
        "populate_by_name": True,
        "json_encoders": {
            datetime: lambda v: v.isoformat()
        }
    }


# Social Media Models
class SocialEngagement(BaseModel):
    """Engagement metrics for social posts."""
    likes: Optional[int] = 0
    retweets: Optional[int] = 0
    replies: Optional[int] = 0
    shares: Optional[int] = 0
    comments: Optional[int] = 0
    views: Optional[int] = 0


class SocialPostBase(BaseModel):
    """Base model for social media posts."""
    platform: SocialPlatform = Field(..., description="Social media platform")
    content: str = Field(..., description="Post content", min_length=1)
    author: str = Field(..., description="Author username/handle", min_length=1)
    engagement: SocialEngagement = Field(default_factory=SocialEngagement)
    hashtags: List[str] = Field(default_factory=list, description="Hashtags in the post")
    location: str = Field(..., description="Location mentioned in post", min_length=1)
    sentiment: SentimentType = Field(default=SentimentType.NEUTRAL)
    verified: bool = Field(default=False, description="Whether author is verified")


class SocialPostCreate(SocialPostBase):
    """Model for creating social posts."""
    pass


class SocialPostResponse(SocialPostBase):
    """Model for social post responses."""
    id: str = Field(..., alias="_id")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None

    model_config = {
        "populate_by_name": True,
        "json_encoders": {
            datetime: lambda v: v.isoformat()
        }
    }


# Trending Hashtag Models
class TrendingHashtagBase(BaseModel):
    """Base model for trending hashtags."""
    tag: str = Field(..., description="Hashtag with # prefix", min_length=2)
    count: int = Field(..., description="Number of mentions", ge=0)
    trend: str = Field(..., description="Trend direction: up, down, stable")

    @field_validator('tag')
    @classmethod
    def validate_hashtag(cls, v):
        if not v.startswith('#'):
            v = f"#{v}"
        return v


class TrendingHashtagResponse(TrendingHashtagBase):
    """Model for trending hashtag responses."""
    id: str = Field(..., alias="_id")
    last_updated: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "json_encoders": {
            datetime: lambda v: v.isoformat()
        }
    }


# Dashboard Statistics Models
class DashboardStats(BaseModel):
    """Dashboard statistics model."""
    active_reports: int = Field(..., description="Number of active reports")
    social_mentions: int = Field(..., description="Number of social media mentions")
    active_users: int = Field(..., description="Number of active users")
    verified_incidents: int = Field(..., description="Number of verified incidents")
    active_reports_change: str = Field(..., description="Change from last period")
    social_mentions_change: str = Field(..., description="Change from last period")
    active_users_description: str = Field(..., description="Description of active users")
    verified_incidents_description: str = Field(..., description="Description for verified incidents")


# User Models (simplified for now)
class UserBase(BaseModel):
    """Base model for users."""
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    full_name: Optional[str] = None
    role: str = Field(default="reporter", description="User role")


class UserCreate(UserBase):
    """Model for creating users."""
    password: str = Field(..., min_length=6)


class UserResponse(UserBase):
    """Model for user responses."""
    id: str = Field(..., alias="_id")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True}


# Response wrapper models
class UserReportListResponse(BaseModel):
    """Response model for list of user reports."""
    reports: List[UserReportResponse]
    total: int
    page: int
    limit: int


class SocialPostListResponse(BaseModel):
    """Response model for list of social posts."""
    posts: List[SocialPostResponse]
    total: int
    page: int
    limit: int


class TrendingHashtagListResponse(BaseModel):
    """Response model for list of trending hashtags."""
    hashtags: List[TrendingHashtagResponse]


class StandardResponse(BaseModel):
    """Standard API response model."""
    success: bool = True
    message: str
    data: Optional[Dict[str, Any]] = None