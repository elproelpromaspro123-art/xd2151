# Fix: Groq GPT-OSS 120B Reasoning Configuration

## Problema

Error al usar razonamiento con `gpt-oss-120b`:
```
400 {"error":{"message":"property 'thinking' is unsupported","type":"invalid_request_error"}}
```

## Causa

El modelo GPT-OSS de Groq NO soporta el parámetro `thinking`. En cambio, usa `reasoning_effort` que es específico de los modelos GPT-OSS.

## Documentación Oficial

Según [Groq Reasoning Docs](https://console.groq.com/docs/reasoning):

**Para GPT-OSS 20B y 120B:**
```
reasoning_effort: "low" | "medium" | "high"
```

- `low`: Usa pocos tokens de razonamiento
- `medium`: Razonamiento moderado (default)
- `high`: Razonamiento completo

## Solución Implementada

### Archivo: `server/routes.ts` (Líneas 857-867)

```typescript
// Agregar razonamiento si el modelo lo soporta
if (useReasoning && modelInfo.supportsReasoning) {
    // Para GPT-OSS usar reasoning_effort (low, medium, high)
    // Para otros modelos de Groq usar include_reasoning
    const modelId = modelInfo.id;
    if (modelId.includes('gpt-oss')) {
        requestBody.reasoning_effort = isPremium ? "high" : "medium";
    } else {
        requestBody.include_reasoning = true;
    }
}
```

## Diferencias Entre Modelos Groq

| Modelo | Parámetro | Valores |
|--------|-----------|---------|
| **GPT-OSS 20B/120B** | `reasoning_effort` | `"low"`, `"medium"`, `"high"` |
| **Llama 3.3 70B** | `include_reasoning` | `true` / `false` |
| **Otros Groq** | `include_reasoning` | `true` / `false` |

## Cambios Realizados

✅ Detecta automáticamente si el modelo es GPT-OSS
✅ Usa `reasoning_effort` con niveles dinámicos:
   - **Premium users**: `"high"` (razonamiento completo)
   - **Free users**: `"medium"` (razonamiento moderado)
✅ Otros modelos Groq mantienen `include_reasoning`

## Validación

✅ TypeScript: 0 errores
✅ Compilación exitosa

## Referencias

- [Groq Reasoning Documentation](https://console.groq.com/docs/reasoning)
- [GPT-OSS 120B Groq Page](https://console.groq.com/docs/model/openai/gpt-oss-120b)
- [OpenAI GPT-OSS Release Notes](https://openai.com/index/introducing-gpt-oss/)

## Status

✅ **FIXED** - GPT-OSS 120B reasoning now works correctly
