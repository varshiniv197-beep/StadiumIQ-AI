# StadiumIQ AI - API Specification (v1)

This document describes the REST endpoints available on the StadiumIQ Express backend. All requests and responses are exchanged as JSON.

---

## Authentication Endpoints

### 1. Register User
- **Method**: `POST`
- **Path**: `/api/v1/auth/signup`
- **Request Body**:
  ```json
  {
    "email": "user@fifa.com",
    "password": "securepassword123",
    "name": "Alex Morgan",
    "role": "ORGANIZER" // Allowed: "FAN", "ORGANIZER", "VOLUNTEER", "VENUE_STAFF", "SECURITY_OFFICER", "TRANSPORT_COORDINATOR", "SUSTAINABILITY_MANAGER"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "uuid-string",
      "email": "user@fifa.com",
      "name": "Alex Morgan",
      "role": "ORGANIZER"
    }
  }
  ```

### 2. Login User
- **Method**: `POST`
- **Path**: `/api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@fifa.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "uuid-string",
      "email": "user@fifa.com",
      "name": "Alex Morgan",
      "role": "ORGANIZER"
    }
  }
  ```

---

## Crowd & Safety Intelligence Endpoints

### 1. Get Live Telemetry
- **Method**: `GET`
- **Path**: `/api/v1/crowd/telemetry`
- **Query Parameters**: `venue` (e.g. `METLIFE_STADIUM`, `ESTADIO_AZTECA`, `BC_PLACE`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "telemetry": [
      {
        "id": "uuid-string",
        "zone": "Gate D",
        "crowdCount": 2400,
        "capacityLimit": 3000,
        "queueLength": 160,
        "avgWaitTimeSeconds": 720,
        "congestionLevel": 0.8,
        "riskZone": false
      }
    ]
  }
  ```

### 2. Get 60m Queue Forecasts
- **Method**: `GET`
- **Path**: `/api/v1/crowd/forecast`
- **Query Parameters**: `venue`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "forecast": [
      {
        "zone": "Gate D",
        "capacityLimit": 3000,
        "current": 2400,
        "t10": 2600,
        "t20": 2800,
        "t30": 2950,
        "t60": 3000,
        "congestionTrend": "INCREASING"
      }
    ]
  }
  ```

### 3. Explain Recommendation (Explainable AI)
- **Method**: `POST`
- **Path**: `/api/v1/crowd/explain-recommendation`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "advice": "Open Gate B relief lanes immediately."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "explanation": {
      "reasoning": "Spike in Meadowlands rail arrivals is saturating Gate A scanners.",
      "confidence": 94,
      "expectedImprovement": "Reduce queue sizes by 18%",
      "contributingMetrics": [
        { "metric": "Metro line load", "weightPercentage": 50, "state": "Peak" }
      ]
    }
  }
  ```

---

## Crisis Operations & Simulations

### 1. Trigger Crisis Scenario
- **Method**: `POST`
- **Path**: `/api/v1/operations/simulate-scenario`
- **Headers**: `Authorization: Bearer <token>` (Must be ORGANIZER or SECURITY_OFFICER)
- **Request Body**:
  ```json
  {
    "scenario": "FIRE_ALERT",
    "venue": "METLIFE_STADIUM"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "simulation": {
      "riskAssessment": "Active fire detected at North Concourse.",
      "actionPlan": ["Sound alarm", "Open emergency exit gates"],
      "resourceAllocation": "Redirect volunteers to Gate E",
      "evacuationStrategy": "Evacuate North stand through Gate E",
      "announcements": [
        { "language": "English", "text": "Please exit immediately." }
      ]
    },
    "alert": { "id": "uuid", "message": "SIMULATED FIRE_ALERT" }
  }
  ```
