# Deployment Guide - Roblox UI Designer Pro

## Pre-Deployment Checklist

Before deploying to production, ensure the following:

### 1. Build Verification
```bash
npm run build           # Build the application
npm run verify-deploy  # Verify all required files exist
npm run check         # TypeScript type checking
```

### 2. Required Environment Variables (Configure in Render Dashboard)

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key for AI models | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Yes |
| `DATABASE_URL` | PostgreSQL database connection string | No* |
| `TAVILY_API_KEY` | Tavily web search API key | No |
| `GOOGLE_API_KEY` | Google API key | No |
| `SESSION_SECRET` | Session encryption secret (auto-generated) | Auto |
| `Site_Key` | Cloudflare Turnstile site key | No |
| `Secret_Key` | Cloudflare Turnstile secret key | No |

*DATABASE_URL: If not using database (file-based storage), can be left empty.

### 3. Deployment Configuration (render.yaml)

The application uses `render.yaml` for configuration. Key settings:

- **Start Command**: `node dist/index.cjs`
- **Build Command**: `npm ci && npm run build`
- **Health Check**: `/health` endpoint (returns `{ status: "ok" }`)
- **Port**: `10000` (configurable via `PORT` env var)
- **Node Version**: `22.16.0` or higher recommended
- **Memory**: `--max-old-space-size=512` (512MB limit)

### 4. Health Check

The application exposes a health check endpoint:

```bash
curl https://your-app.onrender.com/health
# Response: { "status": "ok", "timestamp": "2025-12-04T..." }
```

## Deployment Process

### Via Render Dashboard

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select the repository
4. Choose branch: `main`
5. Runtime: `Node.js`
6. Build Command: `npm ci && npm run build`
7. Start Command: `node dist/index.cjs`
8. Configure environment variables (see above)
9. Click "Create Web Service"

### Via GitHub Integration (Automatic)

Once connected:
1. Push changes to `main` branch
2. Render automatically triggers a new deployment
3. Monitor the deployment in the Render dashboard

## Troubleshooting

### Timeout During Deployment (> 15 minutes)

**Symptoms**: Build succeeds but deployment times out

**Solutions**:
1. Check `/health` endpoint responds quickly
2. Verify all required env variables are set
3. Check server logs: `docker logs <container-id>`
4. Increase `keepAliveTimeout` (already set to 65s in code)

### High Memory Usage

**Symptoms**: "Out of memory" errors during build

**Solutions**:
1. Build limit is set to 512MB in `NODE_OPTIONS`
2. Reduce bundle size by:
   - Using dynamic imports: `const Component = lazy(() => import('./Component'))`
   - Tree-shaking unused dependencies
   - Optimizing image assets

### Port Conflicts

The application listens on:
- Development: `5000`
- Production: `10000` (configured in render.yaml)

### Static Files Not Serving

Ensure `dist/public/` directory exists with:
- `index.html`
- `assets/` folder with CSS/JS bundles

## Performance Optimization

### Build Time
- Current build time: ~6-8 seconds
- Client build: ~5.5s
- Server bundle: ~0.1s

### Startup Time
- Server startup: ~1-2 seconds
- Health check responds: <100ms

### Bundle Size
- Client JS: ~1MB gzipped
- CSS: ~16KB gzipped
- Total: ~1.2MB

## Monitoring

### Application Logs

View logs in Render dashboard:
```
Logs > All Logs
```

### Key Metrics to Monitor

1. **Response Time**: Should be <200ms for API endpoints
2. **Error Rate**: Should be <1%
3. **Build Time**: Should complete within 5 minutes
4. **Memory Usage**: Should stay under 512MB

## Rollback

If deployment fails:

1. Go to Render dashboard
2. Click "Deploy" → "View Deploys"
3. Find the previous successful deployment
4. Click "Redeploy"

## Database Management

If using PostgreSQL:

1. Set `DATABASE_URL` environment variable
2. Run migrations: `npm run db:push`
3. Database operations are non-blocking (async)

## File Storage

If not using database, files are stored in:
- `/opt/render/project/data/` (with 1GB persistent disk)
- `storage.json` - Conversations and messages
- `users.json` - User accounts
- `verification_codes.json` - Email verification codes

## Post-Deployment

After successful deployment:

1. ✓ Verify health check works
2. ✓ Test login functionality
3. ✓ Test chat API endpoints
4. ✓ Verify API keys are working
5. ✓ Monitor error logs for 24 hours
6. ✓ Check performance metrics

## Security Notes

- All environment variables are kept private
- Session secrets are auto-generated
- HTTPS is enforced by Render
- CORS is properly configured
- Rate limiting can be added via middleware

## Additional Resources

- [Render Deployment Docs](https://render.com/docs)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
