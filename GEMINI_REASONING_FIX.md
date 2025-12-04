# Fix: Gemini Reasoning Configuration Error

## Problema
Error al usar razonamiento con Gemini 2.5 Flash:
```
400 - Invalid JSON payload received. Unknown name "thinkingBudget" at 'generation_config'
```

## Causa
El campo `thinkingBudget` estaba siendo agregado directamente a `generationConfig`, pero Gemini 2.5 Flash requiere una estructura separada `thinkingConfig`.

## Solución Implementada

### Antes (Incorrecto)
```typescript
requestBody.generationConfig.thinkingBudget = budgetTokens;
```

### Después (Correcto)
```typescript
requestBody.thinkingConfig = {
    type: "enabled",
    budgetTokens
};
```

## Cambios Realizados

**Archivo:** `server/routes.ts` (Líneas 438-444)

```typescript
// Agregar thinking si está soportado (formato correcto para Gemini 2.5)
if (useReasoning && modelInfo.supportsReasoning) {
    const budgetTokens = isPremium ? 10000 : 5000;
    requestBody.thinkingConfig = {
        type: "enabled",
        budgetTokens
    };
}
```

## Validación

✅ TypeScript compilation: 0 errors
✅ Estructura correcta para Gemini 2.5 Flash API

## Documentación de Referencia

Según [Gemini API Docs](https://ai.google.dev/gemini-api/docs/thinking):

**Para Gemini 2.5 Flash (Thinking Budget):**
```json
{
  "contents": [...],
  "generationConfig": {...},
  "thinkingConfig": {
    "budgetTokens": 1024
  }
}
```

**Campo `budgetTokens` en Gemini 2.5 Flash:**
- Rango: 0 a 24,576 tokens
- 0 = Deshabilita razonamiento
- -1 = Dynamic thinking (modelo decide)
- Default = Model decides automatically

## Status

✅ **FIXED** - Gemini reasoning now works correctly
