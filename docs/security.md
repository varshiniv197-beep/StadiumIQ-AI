# StadiumIQ AI - Security Architecture

StadiumIQ AI implements security measures across both application layers to satisfy enterprise requirements for data privacy, authentication sanity, and DDoS/brute-force defense.

---

## 1. Authentication & Cryptography
* **Password Hashing**: Done using `bcryptjs` with a cost factor of `10` salt rounds. Plain text credentials are never stored or logged in standard application traces.
* **Session Tokenization**: Handled using JSON Web Tokens (JWT). 
  - Tokens are signed using a cryptographically secure `JWT_SECRET` key loaded from environmental profiles.
  - Token payload houses basic identities: `id`, `email`, `role`, and `name`.
  - Expiry is set to `24 hours` to enforce session renewal.
- **Client Handling**: Web client stores tokens in memory state or securely inside HTTP headers on requests, ensuring minimal exposure to Cross-Site Scripting (XSS) extraction.

---

## 2. Role-Based Access Control (RBAC)
Endpoints are locked behind authorization layers that inspect the token's `role` properties:
- **Organizer Only (`ORGANIZER`)**: Access to AI Scenario Simulator, AI staff reallocation trigger, and global executive metrics reports.
- **Security Officer Only (`SECURITY_OFFICER`)**: Access to scenario simulations and incident timeline modifications.
- **Volunteer (`VOLUNTEER`)**: Ability to claim task cards and report active concourse incidents.
- **Fan (`FAN`)**: Ability to request personalized travel plans and query the multi-lingual assistant chatbot.

---

## 3. Web Layer Security Middlewares
* **Helmet.js**: Configured on Express to inject secure HTTP response headers (disabling `X-Powered-By`, enforcing `Content-Security-Policy`, and blocking clickjacking options).
* **Cross-Origin Resource Sharing (CORS)**: Access is configured securely for matching domains, blocking malicious remote domain injections.
* **Express Rate Limiter**: 
  - Restricts overall request limits to `100 requests per 15 minutes` per IP address.
  - Prevents automated script flood attacks from exhausting Gemini API tokens or scanning user logins.
* **Input Validation via Zod**: Every API payload is validated against strict Zod types, rejecting payload bloating or sql injection attempts.
