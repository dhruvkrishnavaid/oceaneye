# OceanEye - Coastal Hazard Monitoring Platform

**Smart India Hackathon 2025 - Problem Statement SIH25039**

A comprehensive coastal hazard monitoring platform that enables citizens, coastal residents, volunteers, and disaster managers to report observations during hazardous ocean events and monitor public communication trends via social media.

## 🌊 Project Overview

OceanEye addresses the critical need for real-time coastal hazard monitoring across India's vast 7,517 km coastline. The platform combines crowdsourced reporting with AI-powered social media monitoring to provide enhanced early warning systems for coastal communities.

### 🎯 Problem Statement

**Title:** Development of a Unified Platform for Crowdsourced Coastal Hazard Reporting and Social Media Monitoring for Enhanced Early Warning Systems

**Challenge:** India's extensive coastline faces numerous ocean hazards including tsunamis, storm surges, high waves, and unusual sea behavior. Current warning systems lack real-time ground truth and public communication insights, creating gaps in emergency response capabilities.

## ✨ Key Features

- **🗺️ Real-time Incident Mapping** - Interactive maps with geotagged reports and severity indicators
- **📱 Citizen Reporting System** - Easy-to-use interface for submitting hazard reports with media uploads
- **📊 Social Media Intelligence** - AI-powered monitoring of social platforms for coastal hazard discussions
- **📈 Trend Analysis** - Hashtag tracking and sentiment analysis for public communication insights
- **🚨 Dashboard Analytics** - Comprehensive statistics and real-time monitoring for disaster managers
- **✅ Verification System** - Report validation and status tracking for incident management

## 🏗️ Architecture

OceanEye is built as a full-stack application with separate frontend and backend components:

```
oceaneye/
├── frontend/          # React-based dashboard application
├── backend/           # FastAPI-based REST API service
├── test-api.html      # API testing interface
└── README.md          # This file
```

### Frontend (Dashboard)
- **Technology**: React 19 with TanStack Start (SSR)
- **Styling**: Tailwind CSS 4.0 + ShadCN UI
- **State Management**: TanStack Query
- **Routing**: TanStack Router
- **Package Manager**: Bun

### Backend (API Service)
- **Framework**: FastAPI with async/await support
- **Database**: MongoDB with Motor (async driver)
- **File Storage**: Local filesystem with aiofiles
- **Package Manager**: UV (Python)

## 🚀 Quick Start

### Prerequisites

- **Frontend**: Node.js 18+, Bun package manager
- **Backend**: Python 3.10+, MongoDB, UV package manager

### Running the Application

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd oceaneye
   ```

2. **Start the Backend API**:
   ```bash
   cd backend
   uv sync
   uv run fastapi dev app/main.py
   ```
   Backend will be available at `http://localhost:8000`

3. **Start the Frontend Dashboard**:
   ```bash
   cd frontend
   bun install
   bun run dev
   ```
   Frontend will be available at `http://localhost:3000`

4. **Access the Application**:
   - **Dashboard**: http://localhost:3000
   - **API Documentation**: http://localhost:8000/docs
   - **API Health Check**: http://localhost:8000/health

## 📚 Documentation

### Component Documentation

- **[Frontend README](frontend/README.md)** - Detailed frontend setup, development guide, and technical documentation
- **[Backend README](backend/README.md)** - API documentation, database setup, and backend development guide

### API Testing

Use the included [`test-api.html`](test-api.html) file to test API endpoints directly in your browser, or visit the interactive API documentation at `http://localhost:8000/docs`.

## 🛠️ Development

### Frontend Development

The frontend uses modern React patterns with TanStack ecosystem:

```bash
cd frontend
bun install          # Install dependencies
bun run dev          # Start development server
bun run build        # Build for production
bun run test         # Run tests
bun run lint         # Lint code
```

### Backend Development

The backend provides RESTful APIs with FastAPI:

```bash
cd backend
uv sync              # Install dependencies
uv run fastapi dev app/main.py  # Start development server
uv run python test_atlas_connection.py  # Test database connection
```

### Key Development Features

- **Hot Reload**: Both frontend and backend support hot reloading during development
- **Type Safety**: TypeScript frontend with Pydantic backend models
- **API Documentation**: Auto-generated OpenAPI documentation
- **File Uploads**: Support for image and video uploads with reports
- **CORS Configuration**: Pre-configured for local development

## 🗄️ Database Schema

### Collections

- **user_reports** - Citizen-generated coastal hazard reports
- **social_posts** - Social media posts and mentions
- **trending_hashtags** - Hashtag trend analytics

### Data Models

The platform uses structured data models for:
- Coastal hazard types (tsunamis, storm surges, high waves, etc.)
- Severity levels (low, medium, high, critical)
- Report status tracking (pending, verified, resolved)
- Social media sentiment analysis

## 🌐 Deployment

### Production Considerations

- **Frontend**: Can be deployed to Vercel, Netlify, or any static hosting service
- **Backend**: Suitable for deployment on cloud platforms (AWS, GCP, Azure)
- **Database**: MongoDB Atlas recommended for production
- **File Storage**: Consider cloud storage solutions (AWS S3, Google Cloud Storage)

### Environment Configuration

Both components support environment-based configuration:
- Frontend: Environment variables for API endpoints
- Backend: Database connections, CORS settings, file upload limits

## 🤝 Contributing

This project was developed for Smart India Hackathon 2025. For development setup and contribution guidelines, please refer to the individual component documentation.

## 📄 License

This project is developed as part of Smart India Hackathon 2025 submission for problem statement SIH25039.

---

**Team Information**: SIH25039 Solution - Coastal Hazard Monitoring Platform  
**Technology Stack**: React + FastAPI + MongoDB  
**Target Users**: Citizens, Coastal Residents, Volunteers, Disaster Managers