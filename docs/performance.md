# Performance & Optimization

## Backend Optimizations

1. **AI Prompts Cache**: Avoids calling Google Gemini API repeatedly for duplicate requests. Stores compiled telemetry summaries, journey itinerary options, and localized translations in-memory (TTL: 30-120s).
2. **Database Indexing**: Directs MongoDB to build indices (`@@index([venue])`) across high-frequency models, eliminating collection scans.
3. **Payload Compression**: Implements gzip response compression to minimize transport sizes.
4. **ETag Headers**: Enables browser client-side caching of static telemetry datasets using HTTP validation tags.

## Frontend Optimizations

1. **State Optimization**: Restricts component rendering cycles via `useMemo` and `useCallback` on telemetry graphs.
2. **Code Splitting**: Dynamic component mounting via Next.js `lazy()` imports.
