# Security Framework

## Authentication & Authorization

- **JWT Authentication**: Secured using HMAC SHA-256 tokens (`jsonwebtoken`) containing user roles.
- **Role-Based Access Control (RBAC)**: Fine-grained checks matching user types (`FAN`, `ORGANIZER`, `VOLUNTEER`, `SECURITY_OFFICER`, etc.) using explicit router guards.

## Input Sanitization & Vulnerability Mitigation

- **Helmet**: Dispatches strict security headers (CSP, X-Frame-Options) to protect against clickjacking and cross-site scripting (XSS).
- **CORS**: Domain white-listing locks api access to authorized hosts.
- **Request Rate-Limiting**: Enforces strict request throttles to prevent Denial of Service (DoS) attempts on expensive AI endpoints.
