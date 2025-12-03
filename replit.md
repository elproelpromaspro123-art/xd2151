# Roblox UI Designer Pro

## Overview
A web application for designing professional UI/UX interfaces for Roblox Studio. Uses AI models (OpenRouter) to generate Luau code for Roblox interfaces with premium design styles.

## Project Structure
```
/
├── client/           # React frontend with Vite
│   ├── src/
│   │   ├── components/  # UI components (chat, ui library)
│   │   ├── pages/       # Page components (AuthPage, ChatPage)
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and helpers
│   └── index.html
├── server/           # Express.js backend
│   ├── auth.ts       # Authentication logic
│   ├── routes.ts     # API routes (includes /health endpoint)
│   ├── session.ts    # Session management
│   ├── storage.ts    # File-based data storage
│   ├── userStorage.ts # User-specific data management
│   └── index.ts      # Server entry point
├── shared/           # Shared types and schemas
├── script/           # Build scripts
├── data/             # JSON data storage (gitignored)
├── render.yaml       # Render deployment config
└── package.json      # Dependencies
```

## Tech Stack
- Frontend: React 18, TypeScript, Vite, TailwindCSS, Radix UI
- Backend: Express.js, TypeScript
- Database: PostgreSQL (via Replit or Neon)
- AI: OpenRouter API (KAT-Coder Pro, Grok 4.1, Amazon Nova 2 Lite, DeepSeek R1T2 Chimera)
- Auth: Custom auth with email verification (Gmail/Nodemailer), Google OAuth
- Storage: PostgreSQL database + file-based JSON storage for legacy data

## Development Commands
- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes to PostgreSQL

## Running on Replit

The project is configured to run on Replit with the following setup:

1. **Database**: PostgreSQL database is provisioned automatically via Replit
2. **Development Server**: Runs on port 5000 (configured for Replit's proxy)
3. **Workflow**: "Start application" workflow runs `npm run dev` automatically
4. **Environment Variables**: Configure these in Replit Secrets:
   - `OPENROUTER_API_KEY` - Required for AI features
   - `GMAIL_USER` - For email verification
   - `GMAIL_APP_PASSWORD` - Gmail app password
   - `GOOGLE_CLIENT_ID` - Optional, for Google OAuth
   - `GOOGLE_CLIENT_SECRET` - Optional, for Google OAuth
   - `TAVILY_API_KEY` - Optional, for web search
   
5. **Deployment**: Configured as "autoscale" deployment on Replit
   - Build command: `npm run build`
   - Run command: `npm run start`

## Deployment to Render

### Prerequisites
1. A GitHub repository with this code
2. A Render account (https://render.com)

### Deployment Steps
1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://dashboard.render.com
   - Click "New" > "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` configuration
   - Click "Create Web Service"

3. **Configure Environment Variables in Render:**
   Go to your service > Environment tab and add these secrets:
   - `OPENROUTER_API_KEY` - Your OpenRouter API key
   - `GMAIL_USER` - Gmail account for sending verification emails
   - `GMAIL_APP_PASSWORD` - Gmail app password (Google Account > Security > App Passwords)
   - `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
   - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional)
   - `TAVILY_API_KEY` - Tavily API key for web search (optional)
   - `GOOGLE_API_KEY` - Google API key (optional)

   Note: `SESSION_SECRET` and `APP_URL` are auto-configured by render.yaml

4. **Verify Deployment:**
   - Wait for the build to complete
   - Check the `/health` endpoint to verify the service is running
   - Access your app at `https://YOUR-APP-NAME.onrender.com`

### Environment Variables Reference
| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | API key for OpenRouter AI models |
| `GMAIL_USER` | Yes | Gmail account for email verification |
| `GMAIL_APP_PASSWORD` | Yes | Gmail app password |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth secret |
| `TAVILY_API_KEY` | No | Tavily search API key |
| `SESSION_SECRET` | Auto | Session encryption (auto-generated) |
| `DATA_DIR` | Auto | Persistent storage path |
| `APP_URL` | Auto | Application URL |
| `PORT` | Auto | Server port (10000 on Render) |
| `NODE_ENV` | Auto | Environment (production) |

## Features
- AI-powered Roblox UI code generation
- Real-time chat interface with streaming responses
- User authentication (email/password + Google)
- Email verification
- Premium tier with advanced AI models
- Web search integration for up-to-date Roblox info
- Dark mode UI design
- **Dual Chat Modes:**
  - **Roblox Mode**: Specialized in UI/UX design for Roblox Studio with Luau code generation
  - **General Mode (Modo General)**: General-purpose AI assistant for any topic
- Auto web search detection: automatically enables web search when user requests it
- Image upload support for models with vision (Grok, Amazon Nova)
- Reasoning mode for step-by-step explanations (Grok only)
- **AI Model Categories:**
  - Programming: KAT-Coder Pro, DeepSeek R1T2 Chimera
  - General: Grok 4.1, Amazon Nova 2 Lite

## Health Check
The application exposes a `/health` endpoint for Render health checks:
```
GET /health
Response: { "status": "ok", "timestamp": "2024-..." }
```

## User Preferences
- Language: Spanish
- Primary deployment: Replit (with autoscale)
- Alternative deployment: Render.com

## Recent Changes (December 2, 2025)
- Added new AI models: Amazon Nova 2 Lite (free, images+text) and DeepSeek R1T2 Chimera (free, programming)
- Models now categorized: programming (kat-coder, deepseek) vs general (grok, nova)
- Image upload now works with any model supporting images (Nova, Grok), not just premium users
- Google login requires email verification for unverified accounts
- Auto web search detection: server-side keyword matching for search intent
- Improved theme toggle with proper event dispatching and colorScheme setting
- Enhanced web search context in system prompts for better AI responses
- Added static file cache control for better performance
- Updated AIModel schema with optional category field

## Previous Changes (Replit Import)
- Imported from GitHub to Replit environment
- Fixed TypeScript exports in server/auth.ts
- Configured PostgreSQL database and pushed schema with drizzle-kit
- Set up "Start application" workflow on port 5000 with webview output
- Configured autoscale deployment for production
- Reorganized project structure from Chatbot/ to root
- Added .gitignore for production-ready repository
- Added /health endpoint for health checks
