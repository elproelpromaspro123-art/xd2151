# MANDATORY CONTEXT FILE - Lee primero

Este archivo debe ser leído por CUALQUIER modelo de IA antes de generar código.

## 🔴 REGLA ABSOLUTA

Toda solicitud de código en este proyecto requiere:

1. **Lectura obligatoria de AGENTS.md**
   - Contiene la configuración del proyecto
   - Defines las normas de código
   - Especifica el workflow para cada tipo de tarea

2. **Si es código Roblox/Lua:**
   - Lectura obligatoria de ROBLOX_DOCUMENTATION.md
   - Validar sintaxis contra ejemplos del documento
   - No improvisar APIs o métodos
   - Si algo no existe en el documento, avisar al usuario

3. **Si es código JavaScript/TypeScript:**
   - Seguir el stack definido en AGENTS.md
   - Usar arquitectura especificada (client/server/shared)
   - Validar contra patrones del proyecto

## ✅ CHECKLIST ANTES DE RESPONDER

### Todos los códigos
- [ ] ¿Leíste AGENTS.md completamente?
- [ ] ¿El código sigue los patrones del proyecto?
- [ ] ¿Validaste contra ejemplos reales?
- [ ] ¿Incluiste comentarios en Español si el proyecto es Español?

### Solo para código Roblox/Lua
- [ ] ¿Leíste ROBLOX_DOCUMENTATION.md?
- [ ] **¿Todas las funciones se definen ANTES de usarlas?**
- [ ] ¿Los métodos de clase están antes de `render()`?
- [ ] ¿No hay forward references?
- [ ] ¿El código pasa la validación "Orden de Declaración"?

## 📋 REFERENCIA RÁPIDA AGENTS.md

```
ROBLOX Mode → Lee ROBLOX_DOCUMENTATION.md (2025.1)
TypeScript → strict mode, ESM modules
React → components en client/src/components/
Backend → Express routes en server/routes.ts
BD → Drizzle ORM + Zod validation
UI → shadcn/ui + TailwindCSS
```

**Si no encuentras algo en AGENTS.md → ADVIERTE AL USUARIO**
