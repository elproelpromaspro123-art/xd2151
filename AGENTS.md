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

## ROBLOX Mode (🔴 OBLIGATORIO DESDE 5/12/2025)

### ⚡ REGLA ABSOLUTA - PRINCIPIO FUNDAMENTAL

**📌 LOCALSCRIPTS DEBEN SER AUTOCONTENIDOS**
- ✅ TODO el código en UN SOLO archivo LocalScript
- ❌ NO dependencias de módulos
- ❌ NO requieren otros scripts
- ❌ Sin comentarios en el código (código limpio)
- ✅ Funciona 100% independiente

### ⚡ REGLA ABSOLUTA
**ANTES de generar CUALQUIER código Roblox/Lua:**

1. **DEBES leer**: `CONTRATO_ROBLOX.md` (aceptación obligatoria)
2. **DEBES leer**: `ROBLOX_DOCUMENTATION.md` (API Reference)
3. **DEBES leer**: `.amp/ROBLOX_API_REAL.md` (propiedades válidas)
4. **DEBES validar**: `npm run validate:lua <archivo.lua>`
5. **DEBES validar**: `npm run validate:api <archivo.lua>`
6. **DEBES cumplir**: `ROBLOX_VALIDATION.md` (checklist)

**Si no cumplo estos requisitos, NO genero código.**

### 📋 Validación Obligatoria

**Errores ROJOS detectados**:
```
❌ Nil indexing: Acceso a propiedades sin validar
❌ Variables undefined: Usar variable que no existe
❌ Syntax errors: Paréntesis/end desbalanceados
❌ Method calls sin validación: Llamar métodos en nil
```

**Errores NARANJAS detectados**:
```
⚠️ Forward references: Usar función antes de definirla
⚠️ Undefined functions: Función llamada pero no definida
```

### 🔄 Workflow Obligatorio

1. Leo `CONTRATO_ROBLOX.md` → Acepto términos
2. Leo `ROBLOX_DOCUMENTATION.md` → Aprendo patrones
3. Genero código siguiendo orden de declaración
4. Ejecuto: `npm run validate:lua script.lua`
5. Debe mostrar: `✅ SIN ERRORES DETECTADOS`
6. Si hay errores → Corrijo y repito paso 4
7. Solo entrego si `npm run validate:lua` retorna 0

### ✅ Checklist de Validación (Obligatorio)

**ANTES de CUALQUIER código**:
- [ ] ¿Leí CONTRATO_ROBLOX.md?
- [ ] ¿Leí ROBLOX_DOCUMENTATION.md completamente?
- [ ] ¿Ejecuté npm run validate:lua?

**Errores ROJOS**:
- [ ] ¿Valido variables ANTES de usarlas?
- [ ] ¿Uso if/then para nil checks?
- [ ] ¿Uso :WaitForChild() o :FindFirstChild()?
- [ ] ¿Sin accesos a propiedades de nil?

**Errores NARANJAS**:
- [ ] ¿Funciones definidas ANTES de usarlas?
- [ ] ¿Métodos definidos ANTES de render()?
- [ ] ¿Callbacks definidos ANTES de Connect()?
- [ ] ¿Sin forward references?

**Resultado final**:
- [ ] ¿npm run validate:lua retorna ✅ SIN ERRORES?
- [ ] ¿Código compilable en Roblox Studio?
- [ ] ¿Listo para producción?
