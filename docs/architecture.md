# System Architecture

## Architectural Patterns

StadiumIQ AI follows a strict **layered architecture** to decouple concerns and enforce SOLID principles:

```
[ User Browser ]
       │  HTTP
       ▼
[ Controller Layer ] (Parses HTTP, validates DTO inputs)
       │
       ▼
[ Service Layer ]    (Executes domain logic, manages transaction boundaries)
       │
       ▼
[ Repository Layer ] (Wraps Prisma Client database actions)
       │
       ▼
[ MongoDB Database ]
```

### Separation of Concerns

1. **Controller**: Validates schema DTO input using Zod and coordinates responses using a unified helper.
2. **Service**: Encapsulates all algorithm paths (crowd predictions, reallocations, Gemini prompting).
3. **Repository**: Prevents database queries from leaking into controllers or service logic.
