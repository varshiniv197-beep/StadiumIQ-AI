# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-07

### Added
- Layered backend architecture (Controller-Service-Repository).
- In-memory AI cache inside `GeminiService` to optimize API network calls and boost efficiency.
- MongoDB index structures (`@@index([venue])`) to speed up database query evaluation.
- Compression middleware (`compression`) and ETag headers for minimized HTTP payloads.
- Structured level-based logging.
- Accessibility support: WCAG 2.2 AA compliant high-contrast layouts, keyboard navigation, and voice speech synthesizer.
- Unified response wrapper and custom exception error classes.
