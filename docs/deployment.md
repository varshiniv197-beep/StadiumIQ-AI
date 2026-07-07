# StadiumIQ AI - Deployment Guide

StadiumIQ AI is designed for containerized deployment, ensuring consistency across staging, testing, and production environments.

---

## 1. Prerequisites
- **Node.js**: Version 20 or higher.
- **Docker**: Version 20.10+ and Docker Compose installed.
- **Prisma**: Automatically compiles database clients.

---

## 2. Docker Compose Deployment (Recommended)
Our root-level `docker-compose.yml` launches three orchestrated service layers: a PostgreSQL database container, the Express Node backend, and the Next.js frontend web app.

### Steps to Run
1. **Configure Environment Variables**:
   Create a root `.env` file or export the following parameters in your terminal shell:
   ```bash
   GEMINI_API_KEY="your-google-gemini-key"
   ```
2. **Build and Run Containers**:
   Execute the orchestrator build:
   ```bash
   docker-compose up --build -d
   ```
3. **Verify running containers**:
   ```bash
   docker-compose ps
   ```
4. **Access Applications**:
   - Web Frontend: `http://localhost:3000`
   - Express API v1: `http://localhost:5000/api/v1`
   - API Health check: `http://localhost:5000/api/v1/health`

---

## 3. Local Development Run (Zero-Configuration)
If Docker is unavailable, the application falls back to a local SQLite database that requires zero configuration:

1. **Root Dependencies Installation**:
   Ensure npm concurrently runs script workspaces:
   ```bash
   npm run install:all
   ```
2. **Backend Database Setup**:
   Navigate to the backend, run migrations, and run seeds to prepopulate realistic World Cup data:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npm run db:seed
   ```
3. **Boot Development Services**:
   Return to the root and start both backend and frontend servers concurrently:
   ```bash
   cd ..
   npm run dev
   ```
4. **Grading & Tests**:
   To test routes, run:
   ```bash
   npm run test
   ```
