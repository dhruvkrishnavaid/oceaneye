# OceanEye Backend API - SIH25039 Solution

A FastAPI-based backend service for the OceanEye coastal hazard monitoring platform, providing RESTful APIs for citizen reports, social media monitoring, and dashboard analytics.

## 🌊 Overview

The OceanEye Backend API serves as the core data processing and storage layer for the coastal monitoring platform. It handles user-generated reports, social media data ingestion, file uploads, and provides real-time analytics for the dashboard frontend.

## 📋 Table of Contents

- [🛠️ Technical Stack](#️-technical-stack)
- [🚀 Getting Started](#-getting-started)
- [📱 API Endpoints](#-api-endpoints)
- [🗄️ Database](#️-database)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [🧪 Testing](#-testing)
- [📚 API Documentation](#-api-documentation)

## 🛠️ Technical Stack

- **Framework**: FastAPI 0.117.1+ with async/await support
- **Database**: MongoDB with Motor (async driver)
- **File Storage**: Local filesystem with aiofiles
- **Authentication**: JWT-based (planned)
- **Package Manager**: UV (Python package manager)
- **Python**: 3.10+

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or higher
- MongoDB instance (local or Atlas)
- UV package manager (recommended) or pip

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd oceaneye/backend
   ```

2. **Install dependencies**:
   ```bash
   # Using UV (recommended)
   uv sync
   
   # Or using pip
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

4. **Run the development server**:
   ```bash
   # Using UV
   uv run fastapi dev app/main.py
   
   # Or using uvicorn directly
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

## 📱 API Endpoints

### Core Endpoints

- **GET** `/` - API information and available endpoints
- **GET** `/health` - Health check endpoint
- **GET** `/docs` - Interactive API documentation (Swagger UI)

### Dashboard Analytics

- **GET** `/api/dashboard/stats` - Get dashboard statistics

### User Reports

- **POST** `/api/reports` - Create new coastal hazard report with file uploads
- **GET** `/api/reports` - Get user reports with filtering and pagination
- **GET** `/api/reports/{report_id}` - Get specific report by ID

### Social Media Monitoring

- **GET** `/api/social` - Get social media posts with filtering
- **GET** `/api/trending` - Get trending hashtags

### File Uploads

The API supports file uploads for images and videos with reports:
- Supported formats: Images (JPEG, PNG, GIF), Videos (MP4, AVI, MOV)
- Files are stored in [`uploads/`](uploads/) directory
- Automatic file type detection and organization

## 🗄️ Database

### MongoDB Collections

- **user_reports** - Citizen-generated coastal hazard reports
- **social_posts** - Social media posts and mentions
- **trending_hashtags** - Hashtag trend analytics

### Models

The API uses Pydantic models for data validation:
- [`UserReportCreate`](app/models.py) - Report creation schema
- [`SocialPostResponse`](app/models.py) - Social media post schema
- [`DashboardStats`](app/models.py) - Dashboard analytics schema

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application and routes
│   ├── models.py        # Pydantic data models
│   ├── crud.py          # Database operations
│   └── db.py            # Database connection management
├── uploads/             # File upload storage
│   ├── images/          # Uploaded images
│   └── videos/          # Uploaded videos
├── main.py              # Entry point (development)
├── pyproject.toml       # Project dependencies and metadata
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```bash
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017/oceaneye
# Or for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/oceaneye

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=uploads
```

### CORS Configuration

The API is configured to accept requests from common frontend development ports:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- `http://localhost:8080` (Vue CLI default)

## 🧪 Testing

### Database Connection Test

Test your MongoDB connection:

```bash
uv run python test_atlas_connection.py
```

### API Testing

Use the interactive API documentation at `http://localhost:8000/docs` to test endpoints, or use curl:

```bash
# Health check
curl http://localhost:8000/health

# Get dashboard stats
curl http://localhost:8000/api/dashboard/stats

# Get user reports
curl http://localhost:8000/api/reports
```

## 📚 API Documentation

- **Interactive Documentation**: Visit `http://localhost:8000/docs` when the server is running
- **OpenAPI Schema**: Available at `http://localhost:8000/openapi.json`
- **ReDoc Documentation**: Available at `http://localhost:8000/redoc`

### Example API Usage

#### Creating a Report with File Upload

```bash
curl -X POST "http://localhost:8000/api/reports" \
  -H "Content-Type: multipart/form-data" \
  -F "title=High Waves Alert" \
  -F "description=Unusual wave patterns observed" \
  -F "location=Marina Beach, Chennai" \
  -F "latitude=13.0478" \
  -F "longitude=80.2619" \
  -F "severity=medium" \
  -F "hazard_type=high_waves" \
  -F "author=Coastal Observer" \
  -F "files=@wave_photo.jpg"
```

#### Filtering Reports

```bash
# Get reports by severity
curl "http://localhost:8000/api/reports?severity=high&limit=10"

# Get reports by location
curl "http://localhost:8000/api/reports?location=Chennai&skip=0&limit=20"
```

---

For more information about the complete OceanEye platform, see the [frontend documentation](../frontend/README.md).