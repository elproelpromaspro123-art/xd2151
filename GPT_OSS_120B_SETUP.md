# GPT OSS 120B - Integración en tu Aplicación

## Información del Modelo

**Modelo:** `openai/gpt-oss-120b`
**Proveedor:** Groq (API OpenAI-compatible)
**Velocidad:** ~500 tokens/segundo
**Contexto:** 131,072 tokens (131K)
**Output Máximo:** 65,536 tokens (65K)

### Capacidades Soportadas

✅ **Tool Use (Llamadas a Funciones)** - Perfecto para crear agentes autónomos
✅ **Browser Search (Búsqueda Web)** - Integración con búsqueda en tiempo real
✅ **Code Execution (Ejecución de Código)** - Puede escribir y ejecutar código Python
✅ **Razonamiento Avanzado** - Pensamiento paso a paso para tareas complejas
✅ **JSON Schema Mode** - Salidas estructuradas y validadas
✅ **Multilingual** - Excelente rendimiento en 81+ idiomas

### Benchmarks

- **MMLU (Razonamiento General):** 90.0%
- **SWE-Bench (Coding):** 62.4%
- **HealthBench (Salud):** 57.6%
- **MMMLU (Multilingüe):** 81.3% promedio

### Casos de Uso Ideales

1. **Aplicaciones Agentes Avanzadas** - Razonamiento complejo con múltiples pasos
2. **Análisis y Programación** - Código de calidad competitiva con benchmarks 62.4%
3. **Investigación Científica** - Conocimiento robusto en salud y bioseguridad
4. **Aplicaciones Multilingües** - 81+ idiomas con alto desempeño
5. **Análisis de Documentos** - Usa el contexto completo de 131K tokens

## Cómo Está Configurado en tu App

### 1. Definición del Modelo

```typescript
"gpt-oss-120b": {
    id: "openai/gpt-oss-120b",
    name: "GPT OSS 120B",
    description: "OpenAI GPT-OSS 120B - Modelo MoE ultra potente...",
    supportsImages: false,
    supportsReasoning: true,  // ← Razonamiento habilitado
    isPremiumOnly: false,      // ← Disponible para usuarios FREE
    category: "general",
    provider: "groq",
    apiProvider: "groq",
    freeContextTokens: 131072,
    freeOutputTokens: 65536,
    premiumContextTokens: 131072,
    premiumOutputTokens: 65536,
}
```

### 2. Características Habilitadas

- **Razonamiento (Thinking):** Automáticamente activado cuando `useReasoning: true`
  - Usuarios FREE: 5,000 tokens de presupuesto para razonamiento
  - Usuarios PREMIUM: 10,000 tokens de presupuesto para razonamiento

- **Contexto Completo:** 131K tokens disponibles para:
  - Historial de conversación
  - Documentos grandes
  - Análisis de código extenso

## Precios Groq

| Tipo | Input | Cached Input | Output |
|------|-------|--------------|--------|
| Costo | $0.15/1M | $0.075/1M | $0.60/1M |
| Tokens por $ | 6.7M | 13.3M | 1.7M |

**Ejemplo:** 1000 tokens input + 500 tokens output = ~$0.0008 (8/10 de centavo)

## Cómo Usar en la UI

### Seleccionar el Modelo

1. Abre la aplicación de chat
2. En el selector de modelos, elige **"GPT OSS 120B"**
3. El modelo aparecerá como disponible para FREE users

### Usar Razonamiento

```typescript
// En la solicitud del chat
{
    message: "Resuelve este problema complejo de matemáticas...",
    model: "gpt-oss-120b",
    useReasoning: true,  // ← Activa el razonamiento
    chatMode: "general"
}
```

**Resultado:** El modelo pensará en profundidad antes de responder, mostrando su razonamiento paso a paso.

### Búsqueda Web

El modelo automáticamente detecta cuando necesitas información reciente:

```typescript
{
    message: "¿Cuáles son las noticias de tecnología más recientes?",
    model: "gpt-oss-120b",
    useWebSearch: true
}
```

## Ventajas vs Otros Modelos

| Aspecto | GPT OSS 120B | Llama 3.3 70B | DeepSeek R1 |
|--------|--------------|--------------|------------|
| Contexto | 131K | 128K | 128K |
| Output Máximo | 65K | 32K | 32K |
| Razonamiento | ✅ Avanzado | ❌ No | ✅ Muy avanzado |
| Tool Use | ✅ Sí | ❌ No | ❌ No |
| Multilingüe | ✅ 81 idiomas | ✅ Bueno | ⚠️ Limitado |
| Velocidad | ~500 tps | ~500 tps | ~100 tps |
| Premium Only | ❌ Free | ❌ Free | ✅ Premium |

## Troubleshooting

### Error: "La clave API de Groq no está configurada"

**Solución:** Asegúrate de tener en tu `.env`:
```bash
grokAPI=tu_api_key_aqui
```

Obtén tu API key en: https://console.groq.com/keys

### Razonamiento No Funciona

**Solución:** Solo disponible si `useReasoning: true` y el modelo soporta razonamiento.

Verifica en la solicitud:
```typescript
{ useReasoning: true }
```

### Rate Limiting (Error 429)

**Solución:** Groq tiene límites según plan:
- **Free:** 30 requests/minuto
- **Premium:** Límites más altos

Implementa reintentos exponenciales en el cliente.

## Optimizaciones para el Contexto Grande (131K)

### 1. Análisis de Documentos
```typescript
// Puedes enviar documentos enteros
const largeDocument = fs.readFileSync('doc.txt', 'utf-8');
// Aprox. 130K tokens = ~30,000 palabras
```

### 2. Contexto de Conversación
```typescript
// Mantener 20+ mensajes anteriores sin preocupación
// El modelo tiene espacio de sobra para contexto
```

### 3. Instrucciones Sistema + Ejemplos
```typescript
const systemPrompt = `
[Instrucciones detalladas - 1K tokens]
[Ejemplos de few-shot - 2K tokens]
[Guidelines especiales - 1K tokens]
`;
// Aún quedan 127K tokens para el usuario
```

## Integraciones Futuras Posibles

Con la base actual, puedes agregar:

1. **Tool Use API** - Permitir que el modelo llame funciones
```typescript
const tools = [
    {
        name: "search_web",
        description: "Busca en internet",
        parameters: { ... }
    }
];
// Agregar tools a requestBody
```

2. **JSON Schema Validation** - Respuestas estructuradas
```typescript
requestBody.response_format = {
    type: "json_schema",
    json_schema: { ... }
};
```

3. **Prompt Caching** - Cachear prompts largos
```typescript
// $0.075/1M tokens cached vs $0.15/1M normal
// Ideal para documentos repetitivos
```

## Próximos Pasos

1. ✅ Modelo configurado y funcionando
2. ✅ Razonamiento habilitado
3. ⏳ Agregar UI visual para mostrar razonamiento
4. ⏳ Implementar Tool Use (llamadas a funciones)
5. ⏳ Agregar JSON Schema validation

## Referencias

- [Documentación Oficial](https://console.groq.com/docs/model/openai/gpt-oss-120b)
- [OpenAI Model Card](https://openai.com/index/gpt-oss-model-card/)
- [Groq API Docs](https://console.groq.com/docs)
