# API Specification

## 1. Authentication
*   `POST /api/v1/auth/signup`: Registers a new user.
*   `POST /api/v1/auth/login`: Issues a JWT token on valid credentials.
*   `GET /api/v1/auth/profile`: Retrieves profile details for the authenticated session.

## 2. AI & Gemini Operations
*   `POST /api/v1/gemini/chat`: Real-time multilingual assistant chat endpoint.
*   `POST /api/v1/gemini/simulation`: Runs a critical scenario operations simulation.
*   `POST /api/v1/gemini/resource-optimize`: Generates staff reallocation instructions.
*   `GET /api/v1/gemini/briefing`: Operational dashboard summary briefings.
*   `POST /api/v1/gemini/announcement`: Creates public address emergency scripts.

## 3. Crowd Intelligence
*   `GET /api/v1/crowd/density`: Fetches localized capacity occupancy.
*   `GET /api/v1/crowd/alerts`: Active crowd congestion warnings.
*   `GET /api/v1/crowd/forecast`: Forecasted density levels for upcoming slots.
*   `POST /api/v1/crowd/explain-recommendation`: Provides reasoning for AI warnings.
*   `POST /api/v1/crowd/knowledge-base`: Query standard stadium manuals.
