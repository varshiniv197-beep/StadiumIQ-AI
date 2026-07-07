# Database Architecture

## Prisma & MongoDB

StadiumIQ AI coordinates telemetry tracking, task dispatcher workflows, and logs using MongoDB Atlas.

## Performance Indices

To maintain fast query response times under high concurrency, indexes are defined on fields used in filters and queries:

```prisma
model CrowdTelemetry {
  id                 String       @id @default(uuid()) @map("_id")
  venue              StadiumVenue @default(METLIFE_STADIUM)
  // ... other fields
  @@index([venue])
}
```

Every major model (TransitStatus, SustainabilityMetric, Incident, OperationalRecommendation, etc.) includes index annotations mapping their `venue` filters to physical database indexes.
