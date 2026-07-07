# Production Deployment Guide

## Unified Deployment on Netlify

StadiumIQ AI deploys as a single application configuration on Netlify.

### Build Setup

- **Base Directory**: `frontend`
- **Build Command**: `npm install --include=dev && npm run build`
- **Publish Directory**: `frontend/.next`
- **Functions Directory**: `netlify/functions`

### Redirect Handlers

We rewrite frontend API traffic to serverless handlers:
```toml
[[redirects]]
  from = "/api/v1/*"
  to = "/.netlify/functions/api/api/v1/:splat"
  status = 200
  force = true
```
This ensures zero-configuration CORS and unified SSL across the platform.
