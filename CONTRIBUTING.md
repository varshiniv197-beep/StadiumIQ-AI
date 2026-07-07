# Contributing Guidelines

Thank you for contributing to StadiumIQ AI! We welcome contributions to improve the platform.

## Code Style

- Write clean, maintainable, and well-documented TypeScript code.
- Enforce SOLID design principles. Keep controllers thin, defer business logic to services, and database queries to repositories.
- Use explicit validation schema DTOs via Zod for all HTTP request inputs.
- Keep components WCAG 2.2 AA compliant.

## How to Submit a Pull Request

1. Fork the repository and create your branch from `main`.
2. Write automated Vitest unit or integration tests for any new features or bug fixes.
3. Ensure the test suite passes: `npm run test`.
4. Submit your pull request matching our Pull Request template.
