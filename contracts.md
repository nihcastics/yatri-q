# YATRI-Q API Integration Contracts

## Overview
This document outlines the API contracts and integration points for connecting the YATRI-Q frontend with FastAPI backend services. The frontend currently uses mock data through modular adapters - these will be seamlessly replaced with actual API calls.

## Frontend Mock Data Replacement Plan

### Current Mock Implementation
- **File**: `/app/frontend/src/adapters/mock.js`
- **Usage**: Static mock data for trains, stations, bookings, etc.
- **Replacement Strategy**: Update adapter methods to call FastAPI endpoints

### API Base Configuration
```javascript
// In production, replace with actual API calls
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';
```

## Adapter-to-API Mapping

### 1. SchedulesAdapter → `/api/schedules`
**Frontend Method**: `SchedulesAdapter.searchTrains(params)`
**API Endpoint**: `POST /api/schedules/search`
**Request Body**:
```json
{
  "from": "NDLS",
  "to": "CSTM", 
  "date": "2025-01-15",
  "class": "3A",
  "quota": "GENERAL",
  "passengers": 1,
  "options": {
    "flexibleDates": false,
    "includeConnecting": false,
    "premiumTatkal": false
  }
}
```
**Response Format**:
```json
[
  {
    "trainNo": "12951",
    "trainName": "Mumbai Rajdhani Express",
    "type": "Rajdhani",
    "from": {"code": "NDLS", "name": "New Delhi", "city": "Delhi"},
    "to": {"code": "CSTM", "name": "Mumbai CST", "city": "Mumbai"},
    "depTime": "16:55",
    "arrTime": "08:35", 
    "durationMin": 935,
    "classes": ["1A", "2A", "3A"],
    "fares": {"1A": 4565, "2A": 2890, "3A": 2095},
    "status": "On time",
    "delayMin": 0
  }
]
```

### 2. SeatAdapter → `/api/predictions/seat`
**Frontend Method**: `SeatAdapter.predictSeat(params)`
**API Endpoint**: `POST /api/predictions/seat`
**Request Body**:
```json
{
  "trainNo": "12951",
  "date": "2025-01-15",
  "class": "3A", 
  "quota": "GENERAL"
}
```
**Response Format**:
```json
{
  "probability": 85,
  "band": "likely",
  "insights": [
    "High confirmation rate for this route",
    "Book 2-3 days in advance", 
    "3AC has better availability"
  ]
}
```

### 3. TatkalAdapter → `/api/predictions/tatkal`
**Frontend Method**: `TatkalAdapter.predictTatkal(params)`
**API Endpoint**: `POST /api/predictions/tatkal`
**Request Body**:
```json
{
  "trainNo": "12951",
  "date": "2025-01-15",
  "class": "3A"
}
```
**Response Format**:
```json
{
  "bestWindows": [{"start": "10:00", "end": "10:02"}],
  "note": "Strong tatkal chances"
}
```

### 4. SentimentAdapter → `/api/analytics/sentiment`
**Frontend Method**: `SentimentAdapter.getSentiment(params)`
**API Endpoint**: `GET /api/analytics/sentiment/{trainNo}?windowDays=7`
**Response Format**:
```json
{
  "tag": "positive",
  "reason": "Punctual service, good amenities",
  "snippets": [
    "Clean coaches",
    "On-time arrival", 
    "Good food quality"
  ]
}
```

### 5. TrackingAdapter → `/api/tracking`
**Frontend Method**: `TrackingAdapter.track(params)`
**API Endpoint**: `POST /api/tracking/live`
**Request Body**:
```json
{
  "trainNo": "12951",
  "date": "2025-01-15",
  "pnr": "4567891234"
}
```
**Response Format**:
```json
{
  "trainNo": "12951",
  "status": "Running",
  "delayMin": 5,
  "currentIndex": 2,
  "path": [
    {
      "lat": 28.6139,
      "lng": 77.2090,
      "eta": "16:55",
      "stationCode": "NDLS",
      "stationName": "New Delhi",
      "visited": true
    }
  ]
}
```

### 6. BookingsAdapter → `/api/bookings`
**Frontend Methods**: 
- `BookingsAdapter.getRecent()` → `GET /api/bookings/recent`
- `BookingsAdapter.saveDraft(plan)` → `POST /api/bookings/draft` 
- `BookingsAdapter.getPNRStatus(pnr)` → `GET /api/bookings/pnr/{pnr}`

**Response Formats**: Match current mock data structure

### 7. ChatbotAdapter → `/api/chat`
**Frontend Method**: `ChatbotAdapter.chat(params)`
**API Endpoint**: `POST /api/chat/query`
**Request Body**:
```json
{
  "prompt": "Find fastest train to Mumbai tomorrow",
  "context": {
    "from": "NDLS",
    "to": "CSTM",
    "date": "2025-01-16"
  }
}
```
**Response Format**:
```json
{
  "type": "search_suggestion",
  "message": "I found the fastest options for you:",
  "suggestions": {
    "from": "NDLS",
    "to": "CSTM",
    "class": "3A",
    "quota": "GENERAL",
    "sortBy": "duration"
  }
}
```

## Frontend Integration Steps

### Phase 1: API Client Setup
1. Create `ApiClient` class with base configuration
2. Add error handling and loading states
3. Implement retry logic for failed requests

### Phase 2: Adapter Replacement  
1. Replace mock calls with actual API calls in each adapter
2. Maintain same interface - no changes to React components needed
3. Add proper error handling and loading indicators

### Phase 3: Enhanced Features
1. Real-time WebSocket connections for live tracking
2. Push notification integration 
3. Offline support with service workers

## Error Handling Strategy

### Standard Error Response Format
```json
{
  "error": {
    "code": "TRAIN_NOT_FOUND",
    "message": "Train not found for given route",
    "details": {}
  }
}
```

### Frontend Error Handling
- Network errors: Show retry button with exponential backoff
- API errors: Display user-friendly messages with fallback options
- Validation errors: Highlight form fields with specific error messages

## Authentication Integration

### AuthAdapter → `/api/auth`
**Methods**:
- `loginPassword()` → `POST /api/auth/login`
- `loginOTP()` → `POST /api/auth/otp-login`  
- `logout()` → `POST /api/auth/logout`
- `me()` → `GET /api/auth/me`

**Token Management**:
- Store JWT in httpOnly cookie or secure localStorage
- Auto-refresh tokens before expiry
- Clear tokens on logout or expiry

## Backend Requirements Summary

### Core APIs Needed
1. **Train Search & Schedules** - IRCTC data integration
2. **ML Prediction Services** - Seat availability, Tatkal timing predictions  
3. **Live Tracking API** - Real-time train location with station updates
4. **Sentiment Analysis** - Train review aggregation and analysis
5. **AI Chatbot Service** - Claude integration for natural language queries
6. **User Management** - Authentication, profile, preferences
7. **Booking Management** - PNR tracking, history, drafts

### Database Schema Requirements
- Users (auth, preferences, travel history)
- Trains (schedules, routes, real-time status)
- Stations (codes, names, amenities, coordinates)  
- Bookings (PNR tracking, user associations)
- Predictions (cached ML results, confidence scores)
- Analytics (sentiment data, review aggregation)

### External Integration Points
- **IRCTC API** - Train schedules and availability
- **Railway Live Status API** - Real-time tracking data
- **Emergent LLM/Claude** - AI chatbot responses
- **Maps/Geolocation** - Station coordinates and routing
- **Review Sources** - Sentiment analysis data aggregation

## Testing Strategy

### Mock-to-API Validation
1. Compare mock responses with actual API responses
2. Ensure all frontend features work with real data
3. Test error scenarios and edge cases
4. Validate performance with actual API latencies

### Integration Testing
1. End-to-end user flows with real APIs
2. Real-time features (tracking, notifications)
3. AI chatbot accuracy and response handling
4. ML prediction accuracy validation

## Performance Considerations

### Optimization Strategies
1. **Caching**: Implement Redis for frequently accessed data
2. **Pagination**: Large result sets (train search, booking history)
3. **Debouncing**: Search inputs to reduce API calls
4. **Prefetching**: Predictive loading based on user behavior
5. **Compression**: gzip responses, image optimization
6. **CDN**: Static assets and cached responses

### Monitoring & Analytics
1. API response times and error rates
2. User interaction patterns and conversion funnels  
3. ML prediction accuracy metrics
4. Real-time tracking reliability
5. Chatbot query success rates

This contract ensures seamless integration between the current frontend and the upcoming FastAPI backend while maintaining the premium user experience and performance standards.