# Deployment Guide - Fermi Block Explorer

## Cloudflare Pages Deployment

### Prerequisites
- Cloudflare account
- GitHub repository connected to Cloudflare Pages
- Backend API with CORS enabled for your domain

### Step 1: Configure Build Settings

In your Cloudflare Pages project settings:

**Build Configuration:**
- Build command: `bun install && bun run build`
- Build output directory: `dist`
- Root directory: `/` (or leave empty)

### Step 2: Set Environment Variables

In Cloudflare Pages dashboard, go to:
**Settings → Environment Variables**

Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_BASE` | `http://44.194.22.128:8080` | Production |
| `VITE_WS_BASE` | `ws://44.194.22.128:8080` | Production (optional) |

**Note:** These environment variables are build-time variables and get baked into your production bundle.

### Step 3: Backend CORS Configuration

Ensure your backend API at `44.194.22.128:8080` allows CORS requests from your Cloudflare Pages domain.

Required CORS headers:
```
Access-Control-Allow-Origin: https://your-app.pages.dev
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Or for development/testing (less secure):
```
Access-Control-Allow-Origin: *
```

### Step 4: Deploy

1. Push your code to GitHub
2. Cloudflare Pages will automatically build and deploy
3. Your app will be available at `https://your-project.pages.dev`

### Local Development

For local development, create a `.env.local` file:

```bash
# For local API server
VITE_API_BASE=http://localhost:8080
VITE_WS_BASE=ws://localhost:8080

# Or use the production API (requires CORS)
# VITE_API_BASE=http://44.194.22.128:8080
# VITE_WS_BASE=ws://44.194.22.128:8080
```

Then run:
```bash
bun install
bun dev
```

### Troubleshooting

**Issue: API calls fail with CORS errors**
- Solution: Verify CORS headers are set on your backend API
- Check browser console for specific CORS error messages

**Issue: API returns 404 or wrong data**
- Solution: Verify `VITE_API_BASE` is set correctly in Cloudflare Pages environment variables
- Rebuild the project after changing environment variables

**Issue: Changes not reflecting**
- Solution: Environment variables are build-time, not runtime. You must rebuild after changing them.

### Environment Variable Priority

1. `.env.local` (local development only, gitignored)
2. `.env` (committed to repo, optional)
3. Hardcoded defaults in `src/lib/api.ts`

The default API URL is set to `http://44.194.22.128:8080`, so the app will work without setting environment variables, but you can override it as needed.

### Build Verification

To verify your build locally before deploying:

```bash
bun run build
bun run serve
```

This will build the production bundle and serve it locally at `http://localhost:4173`
