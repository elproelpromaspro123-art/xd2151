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

## ROBLOX Mode (🔴 OBLIGATORIO DESDE 5/12/2025 - VERSIÓN 2.0)

### ⚡ PROTOCOLO DE 3 FASES PARA CÓDIGO 100% CORRECTO

**📌 LOCALSCRIPTS DEBEN SER AUTOCONTENIDOS**
- ✅ TODO el código en UN SOLO archivo LocalScript
- ❌ NO dependencias de módulos
- ❌ NO requieren otros scripts
- ❌ Sin comentarios en el código (código limpio)
- ✅ Funciona 100% independiente

### FASE 1: PRE-GENERACIÓN (Lectura Obligatoria)

**ANTES de generar CUALQUIER código Roblox/Lua, DEBO leer:**

1. ✅ `CONTRATO_ROBLOX.md` (aceptación obligatoria)
2. ✅ `ROBLOX_DOCUMENTATION.md` (API Reference)
3. ✅ `ROBLOX_VALIDATION.md` (checklist de errores)
4. ✅ `.amp/ROBLOX_API_REAL.md` (propiedades válidas)
5. ✅ `.amp/ESTRATEGIA_GENERACION.md` (metodología)
6. ✅ `.amp/SOLUCION_ERRORES_OMEGA.md` (garantía)

### FASE 2: GENERACIÓN (3 Reglas Obligatorias)

**Regla 1: Validar SIEMPRE antes de usar**
```lua
-- ❌ NUNCA: pairs(Config) sin validar
local function Create()
    for k, v in pairs(Config) do
        print(v)
    end
end

-- ✅ SIEMPRE: Validar primero
local function Create()
    if not Config then Config = {} end
    for k, v in pairs(Config) do
        print(v)
    end
end
```

**Regla 2: Definir ANTES de usar**
```lua
-- ❌ NUNCA: Usar antes de definir
Init()
local function Init() end

-- ✅ SIEMPRE: Definir primero
local function Init() end
Init()
```

**Regla 3: Estructura en 5 zonas**
```lua
-- Zona 1 (líneas 1-20): Variables locales
-- Zona 2 (líneas 21-50): Funciones helper
-- Zona 3 (líneas 51-100): Métodos de tabla
-- Zona 4 (líneas 101-150): Event handlers
-- Zona 5 (líneas 151+): Inicialización
```

### FASE 3: POST-VALIDACIÓN (Ejecución Obligatoria)

```bash
npm run validate:lua ./mi_script.lua
npm run validate:api ./mi_script.lua

# DEBE mostrar:
# ✅ SIN ERRORES DETECTADOS
# ✅ Orden de declaración correcto
```

### 🔴 REGLA CRÍTICA: PROTOCOLO DEBE SER VISIBLE

**Cuando genero código Roblox, DEBO mostrar EXPLÍCITAMENTE:**

1. ✅ **Lectura de documentación** (en el reasoning)
   - Menciono cada archivo que leo
   - Muestro que lo procesé

2. ✅ **Análisis de variables** (visible)
   - Listo variables a usar
   - Identifico cuáles pueden ser nil
   - Planeo validaciones

3. ✅ **Validaciones del código** (visible)
   - Muestro las validaciones añadidas
   - Verifico orden de funciones
   - Verifico propiedades válidas

4. ✅ **Resultado de validadores** (visible)
   - Ejecuto npm run validate:lua
   - Ejecuto npm run validate:api
   - Muestro resultado ✅

**Si no vés esto → El código NO cumple el protocolo**

Ver: `.amp/PROTOCOLO_VISIBLE.md` para ejemplos
Ver: `.amp/COMO_EXIGIR_CALIDAD.md` para cómo rechazar código deficiente

### ✅ Checklist de Validación (10 puntos)

**Lectura obligatoria**:
- [ ] ¿Leí CONTRATO_ROBLOX.md?
- [ ] ¿Leí ROBLOX_DOCUMENTATION.md?
- [ ] ¿Leí ROBLOX_VALIDATION.md?
- [ ] ¿Leí ROBLOX_API_REAL.md?

**Errores ROJOS (Nil indexing)**:
- [ ] ¿Valido variables ANTES de usarlas?
- [ ] ¿Valido ANTES de iterar con pairs()?
- [ ] ¿No hay acceso a nil sin validación?

**Errores NARANJAS (Forward references)**:
- [ ] ¿Funciones definidas ANTES de usarlas?
- [ ] ¿Callbacks definidos ANTES de Connect()?
- [ ] ¿Sin forward references?

**Validación final**:
- [ ] ¿npm run validate:lua retorna ✅ SIN ERRORES?
- [ ] ¿npm run validate:api retorna ✅ API VÁLIDA?
