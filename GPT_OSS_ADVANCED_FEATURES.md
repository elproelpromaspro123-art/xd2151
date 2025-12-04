# GPT OSS 120B - Características Avanzadas (Roadmap)

## Capacidades Documentadas por Groq

El modelo soporta capacidades que pueden ser agregadas a futuro:

### ✅ Ya Implementadas
1. **Razonamiento (Thinking)** - Pensamiento paso a paso
2. **Streaming** - Respuestas en tiempo real
3. **Búsqueda Web** - Integración con Tavily
4. **Contexto Grande** - 131K tokens completos

### 🔄 Listos para Implementar (Low effort)

#### 1. Tool Use (Function Calling)
**Qué es:** El modelo puede llamar funciones definidas
**Caso de uso:** Crear agentes que ejecutan acciones

```typescript
// En server/routes.ts, agregar en requestBody:

const tools = [
    {
        type: "function",
        function: {
            name: "execute_python",
            description: "Ejecuta código Python y retorna el resultado",
            parameters: {
                type: "object",
                properties: {
                    code: {
                        type: "string",
                        description: "Código Python a ejecutar"
                    }
                },
                required: ["code"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "search_web",
            description: "Busca información en la web",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Términos de búsqueda"
                    }
                },
                required: ["query"]
            }
        }
    }
];

// En streamGroqCompletion:
if (selectedModel === "gpt-oss-120b") {
    requestBody.tools = tools;
    requestBody.tool_choice = "auto"; // Deixa el modelo decidir
}

// Procesar respuestas con tool calls:
if (delta?.tool_calls) {
    // Ejecutar la función llamada
    // Retornar resultado al modelo
}
```

**Impacto:** Crea agentes autónomos que pueden:
- Ejecutar código Python
- Buscar información
- Realizar cálculos
- Acceder a APIs externas

---

#### 2. JSON Schema Mode
**Qué es:** Respuestas estructuradas garantizadas
**Caso de uso:** APIs que necesitan JSON válido

```typescript
// En streamGroqCompletion:
const jsonSchema = {
    type: "object",
    properties: {
        analysis: {
            type: "string",
            description: "Análisis principal"
        },
        recommendations: {
            type: "array",
            items: { type: "string" },
            description: "Recomendaciones"
        },
        confidence: {
            type: "number",
            minimum: 0,
            maximum: 1,
            description: "Confianza de la respuesta"
        }
    },
    required: ["analysis", "recommendations"]
};

requestBody.response_format = {
    type: "json_schema",
    json_schema: {
        name: "analysis_response",
        schema: jsonSchema,
        strict: true
    }
};
```

**Impacto:** Respuestas siempre JSON válidas:
```json
{
    "analysis": "...",
    "recommendations": ["...", "..."],
    "confidence": 0.95
}
```

---

#### 3. Prompt Caching
**Qué es:** Cachear instrucciones sistema para ahorrar tokens/dinero
**Caso de uso:** Prompts largos repetitivos

```typescript
// Costo reducido: $0.075/1M vs $0.15/1M (+100% de tokens cacheados)

const systemPrompt = `${VERY_LONG_INSTRUCTIONS}`;

const message = {
    role: "user",
    content: [
        {
            type: "text",
            text: systemPrompt,
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: userMessage
        }
    ]
};
```

**Impacto:** 50% ahorro en tokens si el prompt se repite

---

#### 4. Vision (Images) - NO SOPORTADO
⚠️ **No implementar:** GPT OSS 120B NO soporta imágenes en input
- Usa Gemma 3 27B o Gemini 2.5 Flash para imágenes
- Groq anunció soporte futuro

---

### 🚀 Implementaciones Complejas

#### Agente Multi-Paso con Tool Use
```typescript
// El modelo puede hacer ciclos:
// 1. Llama función A
// 2. Recibe resultado
// 3. Llama función B basado en A
// 4. Genera respuesta final

// Requiere:
// - Loop para procesar tool_calls
// - Ejecución de funciones
// - Retorno de contexto al modelo
// - Hasta N iteraciones
```

#### Análisis de Documentos Gigantes
```typescript
// Aprovechar 131K tokens:
// - Cargar documento de 30,000 palabras
// - Agregar instrucciones (5,000 palabras)
// - Espacio para respuesta (65,536 tokens)

// Funciona perfectamente sin cambios
```

#### Razonamiento Profundo + Tool Use
```typescript
// Combinar ambas capacidades:
// 1. Modelo razona sobre el problema
// 2. Identifica qué función necesita
// 3. Llama la función
// 4. Continúa razonando con resultado
// 5. Genera respuesta justificada

// Requiere arquitectura de loop complejo
```

---

## Roadmap de Implementación

### Fase 1: COMPLETADA ✅
- [x] Configuración básica del modelo
- [x] Streaming de respuestas
- [x] Razonamiento (thinking)
- [x] Integración Groq API
- [x] Aparición automática en UI

### Fase 2: Recomendada (1-2 días)
- [ ] Agregar Tool Use básico
- [ ] Implementar JSON Schema mode
- [ ] Agregar documentación UI

### Fase 3: Optimización (1 semana)
- [ ] Prompt caching
- [ ] Agentes multi-paso
- [ ] UI visual para razonamiento

### Fase 4: Avanzado (2+ semanas)
- [ ] Sistema de funciones extensible
- [ ] Caché inteligente de prompts
- [ ] Análisis de costo por conversación

---

## Cómo Agregar Tool Use (Tutorial)

### Paso 1: Definir funciones
```typescript
// En server/routes.ts, cerca de AI_MODELS

const AVAILABLE_TOOLS = [
    {
        type: "function",
        function: {
            name: "calculate",
            description: "Realiza cálculos matemáticos complejos",
            parameters: {
                type: "object",
                properties: {
                    operation: { type: "string" },
                    operands: { type: "array", items: { type: "number" } }
                },
                required: ["operation", "operands"]
            }
        }
    }
];

async function executeToolCall(name: string, args: any): Promise<string> {
    switch(name) {
        case "calculate":
            return JSON.stringify(eval(`${args.operands.join(args.operation)}`));
        default:
            return "Función no encontrada";
    }
}
```

### Paso 2: Agregar tools a la solicitud
```typescript
// En streamGroqCompletion, línea 857:
requestBody.tools = AVAILABLE_TOOLS;
```

### Paso 3: Procesar tool_calls
```typescript
// En el loop de procesamiento (línea 930+):
if (delta?.tool_calls) {
    for (const toolCall of delta.tool_calls) {
        const result = await executeToolCall(
            toolCall.function.name,
            toolCall.function.arguments
        );
        // Retornar resultado al modelo
    }
}
```

### Paso 4: Completar el ciclo
```typescript
// Agregar mensaje con resultado
messagesWithContext.push({
    role: "tool",
    content: result,
    tool_call_id: toolCall.id
});

// Enviar mensaje nuevamente
// Modelo continuará generando respuesta final
```

---

## Comparativa: Con vs Sin Tool Use

### Sin Tool Use (Actual)
```
Usuario: "¿Cuál es 123456 * 789012?"
Modelo: "El resultado es aproximadamente 97,393,267,872"
❌ Posible error matemático
```

### Con Tool Use (Futuro)
```
Usuario: "¿Cuál es 123456 * 789012?"
Modelo: Llama function "calculate"
Sistema: Ejecuta 123456 * 789012 = 97,393,267,872
Modelo: "El resultado exacto es 97,393,267,872"
✅ Exacto al 100%
```

---

## Costo de Implementaciones

| Feature | Tokens Usados | Impacto | Dificultad |
|---------|---------------|--------|------------|
| Razonamiento | +5-10K por query | +$0.003-0.006 | ✅ Fácil |
| Tool Use | +variable | Depende uso | ⚠️ Media |
| JSON Schema | +tokens validación | -0% | ✅ Fácil |
| Prompt Caching | -50% si se repite | -$0.0015 | ⚠️ Media |

---

## Recomendaciones

### Para Usuarios Actuales
✅ **La implementación actual es suficiente**
- Razonamiento funciona perfectamente
- Búsqueda web integrada
- Contexto enorme (131K)

### Para Mejora Continua
1. **Primero:** Agregar UI para razonamiento visualizado
2. **Segundo:** Tool Use para agentes
3. **Tercero:** JSON Schema para APIs estructuradas
4. **Cuarto:** Prompt caching para ahorrar costos

### Para Producción a Escala
- Implementar monitoring de costos
- Agregar rate limiting inteligente
- Caché distribuido de prompts
- Load balancing entre modelos

---

## Recursos

- **Documentación Groq:** https://console.groq.com/docs
- **Guía de Tool Use:** https://platform.openai.com/docs/guides/function-calling
- **JSON Schema:** https://json-schema.org/
- **Prompt Caching:** https://platform.openai.com/docs/guides/prompt-caching

---

**Estado:** Modelo básico completado y funcionando. Todas las mejoras son opcionales.
