# AGENTS.md

## Commands
- **Dev**: `npm run dev` - Starts development server with tsx
- **Build**: `npm run build` - Production build via script/build.ts
- **Typecheck**: `npm run check` - Runs `tsc` for type checking
- **DB Push**: `npm run db:push` - Pushes schema changes with drizzle-kit

## Architecture
- **client/**: React SPA with Vite, TailwindCSS, shadcn/ui components, wouter routing
- **server/**: Express backend with auth (passport), sessions, OpenRouter AI integration
- **shared/**: Drizzle ORM schema + Zod validation (conversations, messages, users)
- Path aliases: `@/*` → `client/src/*`, `@shared/*` → `shared/*`
- Database: PostgreSQL via Neon serverless (`@neondatabase/serverless`)

## Code Style
- TypeScript strict mode, ESM modules (`"type": "module"`)
- React components in `client/src/components/`, pages in `client/src/pages/`
- API routes defined in `server/routes.ts`, auth logic in `server/auth.ts`
- Use Zod schemas for request validation (see `shared/schema.ts`)
- Drizzle ORM for DB operations; use `createInsertSchema` from drizzle-zod
- UI: shadcn/ui + Radix primitives, Lucide icons, TailwindCSS
- Error responses: `{ error: "message" }` with appropriate HTTP status codes
