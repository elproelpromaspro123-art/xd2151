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

## ROBLOX Mode (Obligatorio desde 5/12/2025)
**CONTEXTO OBLIGATORIO**: Antes de generar cualquier código Roblox/Lua, **SIEMPRE** lee y contextualízate con `ROBLOX_DOCUMENTATION.md`. Este documento contiene:
- API oficial de Roblox Studio 2025.1
- Patrones correctos de UI (Roact, Fusion, componentes modernos)
- Best practices y métodos validados
- Enumeraciones, propiedades y eventos actualizados
- Código de ejemplo funcional 2025

**Workflow Roblox**:
1. Lee `ROBLOX_DOCUMENTATION.md` completamente
2. Valida sintaxis Lua contra ejemplos del documento
3. Usa patrones del documento (no improvises)
4. Si no lo encuentras en el documento, advierte al usuario que necesita actualizar ROBLOX_DOCUMENTATION.md
