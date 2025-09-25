"""
CRUD operations for OceanEye MongoDB collections.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from motor.motor_asyncio import AsyncIOMotorCollection

from app.db import (
    get_user_reports_collection,
    get_social_posts_collection,
    get_trending_hashtags_collection,
    get_users_collection
)
from app.models import (
    UserReportCreate, UserReportUpdate, UserReportResponse,
    UserCreate, UserResponse,
    SocialPostCreate, SocialPostResponse,
    TrendingHashtagResponse,
    CoastalHazardType, SeverityLevel, ReportStatus
)


class CRUDOperations:
    """Base CRUD operations class."""

    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create(self, obj_data: dict) -> str:
        """Create a new document."""
        obj_data["created_at"] = datetime.utcnow()
        result = await self.collection.insert_one(obj_data)
        return str(result.inserted_id)

    async def get_by_id(self, obj_id: str) -> Optional[dict]:
        """Get document by ID."""
        if not ObjectId.is_valid(obj_id):
            return None
        result = await self.collection.find_one({"_id": ObjectId(obj_id)})
        if result:
            result["_id"] = str(result["_id"])
        return result

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[dict] = None
    ) -> List[dict]:
        """Get all documents with pagination and filters."""
        query = filters or {}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results

    async def update(self, obj_id: str, update_data: dict) -> bool:
        """Update document by ID."""
        if not ObjectId.is_valid(obj_id):
            return False

        update_data["updated_at"] = datetime.utcnow()
        result = await self.collection.update_one(
            {"_id": ObjectId(obj_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def delete(self, obj_id: str) -> bool:
        """Delete document by ID."""
        if not ObjectId.is_valid(obj_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(obj_id)})
        return result.deleted_count > 0

    async def count(self, filters: Optional[dict] = None) -> int:
        """Count documents matching filters."""
        query = filters or {}
        return await self.collection.count_documents(query)


class UserReportsCRUD(CRUDOperations):
    """CRUD operations for user reports."""

    def __init__(self):
        # Don't call super().__init__ here, initialize collection lazily
        pass

    @property
    def collection(self):
        """Get collection with lazy initialization."""
        coll = get_user_reports_collection()
        if coll is None:
            raise RuntimeError("Database not connected")
        return coll

    async def create_report(self, report: UserReportCreate) -> str:
        """Create a new user report."""
        report_data = report.model_dump()
        report_data["status"] = ReportStatus.PENDING
        report_data["timestamp"] = datetime.utcnow()
        return await self.create(report_data)

    async def get_report(self, report_id: str) -> Optional[UserReportResponse]:
        """Get report by ID."""
        report_data = await self.get_by_id(report_id)
        if report_data:
            return UserReportResponse(**report_data)
        return None

    async def get_reports(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[ReportStatus] = None,
        hazard_type: Optional[CoastalHazardType] = None,
        severity: Optional[SeverityLevel] = None,
        location: Optional[str] = None
    ) -> List[UserReportResponse]:
        """Get reports with filters."""
        filters = {}
        if status:
            filters["status"] = status
        if hazard_type:
            filters["type"] = hazard_type
        if severity:
            filters["severity"] = severity
        if location:
            filters["location"] = {"$regex": location, "$options": "i"}

        reports_data = await self.get_all(skip, limit, filters)
        return [UserReportResponse(**report) for report in reports_data]

    async def update_report(self, report_id: str, report_update: UserReportUpdate) -> bool:
        """Update report information."""
        update_data = report_update.model_dump(exclude_unset=True)
        return await self.update(report_id, update_data)

    async def update_report_status(self, report_id: str, status: ReportStatus) -> bool:
        """Update report status."""
        return await self.update(report_id, {"status": status})

    async def delete_report(self, report_id: str) -> bool:
        """Delete report by ID."""
        return await self.delete(report_id)

    async def get_reports_by_location(self, location: str) -> List[UserReportResponse]:
        """Get reports by location."""
        filters = {"location": {"$regex": location, "$options": "i"}}
        reports_data = await self.get_all(filters=filters)
        return [UserReportResponse(**report) for report in reports_data]

    async def get_recent_reports(self, hours: int = 24) -> List[UserReportResponse]:
        """Get reports from the last N hours."""
        from datetime import timedelta
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        filters = {"timestamp": {"$gte": cutoff_time}}
        reports_data = await self.get_all(filters=filters)
        return [UserReportResponse(**report) for report in reports_data]

    async def get_reports_count(self) -> int:
        """Get total reports count."""
        return await self.count()

    async def get_reports_by_severity(self, severity: SeverityLevel) -> List[UserReportResponse]:
        """Get reports by severity level."""
        filters = {"severity": severity}
        reports_data = await self.get_all(filters=filters)
        return [UserReportResponse(**report) for report in reports_data]


class SocialPostsCRUD(CRUDOperations):
    """CRUD operations for social posts."""

    def __init__(self):
        pass

    @property
    def collection(self):
        """Get collection with lazy initialization."""
        coll = get_social_posts_collection()
        if coll is None:
            raise RuntimeError("Database not connected")
        return coll

    async def create_post(self, post: SocialPostCreate) -> str:
        """Create a new social post."""
        post_data = post.model_dump()
        post_data["timestamp"] = datetime.utcnow()
        return await self.create(post_data)

    async def get_post(self, post_id: str) -> Optional[SocialPostResponse]:
        """Get post by ID."""
        post_data = await self.get_by_id(post_id)
        if post_data:
            return SocialPostResponse(**post_data)
        return None

    async def get_posts(
        self,
        skip: int = 0,
        limit: int = 100,
        platform: Optional[str] = None,
        sentiment: Optional[str] = None,
        location: Optional[str] = None
    ) -> List[SocialPostResponse]:
        """Get posts with filters."""
        filters = {}
        if platform:
            filters["platform"] = platform
        if sentiment:
            filters["sentiment"] = sentiment
        if location:
            filters["location"] = {"$regex": location, "$options": "i"}

        posts_data = await self.get_all(skip, limit, filters)
        return [SocialPostResponse(**post) for post in posts_data]


class TrendingHashtagsCRUD(CRUDOperations):
    """CRUD operations for trending hashtags."""

    def __init__(self):
        pass

    @property
    def collection(self):
        """Get collection with lazy initialization."""
        coll = get_trending_hashtags_collection()
        if coll is None:
            raise RuntimeError("Database not connected")
        return coll

    async def get_trending(self, limit: int = 10) -> List[TrendingHashtagResponse]:
        """Get trending hashtags."""
        # Sort by count descending
        cursor = self.collection.find().sort("count", -1).limit(limit)
        hashtags_data = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            hashtags_data.append(doc)
        return [TrendingHashtagResponse(**hashtag) for hashtag in hashtags_data]


class UserCRUD(CRUDOperations):
    """CRUD operations for users."""

    def __init__(self):
        # Don't call super().__init__ here, initialize collection lazily
        pass

    @property
    def collection(self):
        """Get collection with lazy initialization."""
        coll = get_users_collection()
        if coll is None:
            raise RuntimeError("Database not connected")
        return coll

    async def create_user(self, user: UserCreate) -> str:
        """Create a new user."""
        user_data = user.model_dump()
        # In a real app, hash the password here
        user_data["is_active"] = True
        try:
            return await self.create(user_data)
        except DuplicateKeyError:
            raise ValueError("User with this username or email already exists")

    async def get_user(self, user_id: str) -> Optional[UserResponse]:
        """Get user by ID."""
        user_data = await self.get_by_id(user_id)
        if user_data:
            return UserResponse(**user_data)
        return None

    async def get_user_by_username(self, username: str) -> Optional[UserResponse]:
        """Get user by username."""
        user_data = await self.collection.find_one({"username": username})
        if user_data:
            user_data["_id"] = str(user_data["_id"])
            return UserResponse(**user_data)
        return None

    async def get_users(self, skip: int = 0, limit: int = 100) -> List[UserResponse]:
        """Get all users."""
        users_data = await self.get_all(skip, limit)
        return [UserResponse(**user) for user in users_data]


# Global CRUD instances
user_reports_crud = UserReportsCRUD()
social_posts_crud = SocialPostsCRUD()
trending_hashtags_crud = TrendingHashtagsCRUD()
user_crud = UserCRUD()


# Convenience functions
async def create_user_report(report: UserReportCreate) -> str:
    """Create a new user report."""
    return await user_reports_crud.create_report(report)


async def get_user_report(report_id: str) -> Optional[UserReportResponse]:
    """Get user report by ID."""
    return await user_reports_crud.get_report(report_id)


async def get_user_reports(
    skip: int = 0,
    limit: int = 100,
    status: Optional[ReportStatus] = None,
    hazard_type: Optional[CoastalHazardType] = None,
    severity: Optional[SeverityLevel] = None,
    location: Optional[str] = None
) -> List[UserReportResponse]:
    """Get user reports with filters."""
    return await user_reports_crud.get_reports(skip, limit, status, hazard_type, severity, location)


async def update_user_report(report_id: str, report_update: UserReportUpdate) -> bool:
    """Update user report."""
    return await user_reports_crud.update_report(report_id, report_update)


async def delete_user_report(report_id: str) -> bool:
    """Delete user report."""
    return await user_reports_crud.delete_report(report_id)