# StadiumIQ AI - Testing Guide

StadiumIQ AI implements a automated testing structure to verify role permissions, database integrity, input schemas, and AI service wrappers.

---

## 1. Test Architecture

We utilize:
* **Vitest**: A high-performance unit test runner.
* **Supertest**: An HTTP assertion library to request routes without starting the web listener processes.
* **React Testing Library (RTL)**: Frontend component integration runner (mocking hooks and context states).

---

## 2. Running Backend Tests
Backend tests are stored inside `backend/tests/`. They inspect core validation schemas and authentication guards.

### Executing Tests
To execute backend API tests locally:
```bash
cd backend
npm run test
```
* **Coverage**: Verifies health checks, transit advice, telemetry fetching, and mock API integrity.

---

## 3. Running Frontend Tests
Frontend tests verify component mount states, accessibility variables, and contextual routers.

### Executing Tests
To execute frontend tests locally:
```bash
cd frontend
npm run test
```

---

## 4. Test Verification Checklist
1. **Mocking External APIs**: We mock all requests directed to `@google/genai` inside tests to bypass network latency and API quota exhaustion.
2. **Database Context**: Running tests with `NODE_ENV=test` targets the SQLite file `backend/prisma/test.db` to prevent modifying active production databases.
3. **Continuous Integration**: The GitHub Actions runner executes both test suits on every commit push to `main`.
