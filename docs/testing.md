# Testing Guide

## Testing Framework

Our testing suite is built on **Vitest** for speed and concurrency, combined with **Supertest** for testing Express controller and route handlers.

## Running Tests

To run the complete test suite:
```bash
# In backend workspace:
npm run test
```

To view test coverage:
```bash
npm run test -- --coverage
```

## Coverage Targets

- **Statements**: >95%
- **Branches**: >90%
- **Functions**: >95%
- **Lines**: >95%
