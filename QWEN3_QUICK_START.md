# Qwen3-32B - Guía Rápida

## Información Rápida

| Propiedad | Valor |
|-----------|-------|
| Proveedor | Groq |
| Velocidad | ~400 tokens/seg |
| Contexto | 131K tokens |
| Output | 40K tokens |
| Razonamiento | ✅ Soportado |
| Imágenes | ❌ No soportado |
| Gratuito | ✅ Sí |
| Groq API Key | Requerida |

## Pasos para Usar

1. **Seleccionar el modelo**:
   - Click en el dropdown de modelos
   - Seleccionar "Qwen 3 32B"

2. **Activar razonamiento (opcional)**:
   - Click en el botón "R1" (Reasoning)
   - Se activará automáticamente si el modelo lo soporta

3. **Enviar mensaje**:
   - Escribir tu pregunta
   - Presionar Enter o botón Send

## Ejemplos de Uso Óptimo

### ✅ Ejemplo 1: Problema Matemático
```
Resuelve esta ecuación: 2x² + 5x - 3 = 0
Por favor muestra el paso a paso y coloca tu respuesta final en \boxed{}
```

**Resultado esperado**: Desglose detallado + respuesta formateada

### ✅ Ejemplo 2: Análisis Profundo
```
Analiza los pros y contras de usar microservicios vs monolito
```

**Resultado esperado**: Análisis estructurado con razonamiento claro

### ✅ Ejemplo 3: Código Complejo
```
Escribe una función en TypeScript que implemente un árbol binario de búsqueda 
con métodos insert, search y delete. Incluye tipos correctos.
```

**Resultado esperado**: Código bien estructurado y comentado

### ✅ Ejemplo 4: Diálogo Natural
```
¿Cuál es tu opinión sobre la inteligencia artificial en la educación?
```

**Resultado esperado**: Respuesta conversacional y equilibrada

### ❌ Ejemplo 5: No Óptimo (Sin Imagen)
```
Analiza esta imagen: [imagen]
```

**Problema**: Qwen3-32B no soporta imágenes. Usar Gemini 2.5 Flash o Gemma 3 27B

## Parámetros Técnicos

### Cuando Usas Razonamiento:
```
temperature: 0.6
top_p: 0.95
top_k: 20
min_p: 0
reasoning_format: "parsed"
```

### Cuando NO Usas Razonamiento:
```
temperature: 0.7
top_p: 0.8
top_k: 20
min_p: 0
```

## Comparación con Otros Modelos

| Modelo | Velocidad | Razonamiento | Imágenes | Contexto | Precio |
|--------|-----------|--------------|----------|----------|--------|
| **Qwen3-32B** | ⚡⚡⚡ (400 tps) | ✅ | ❌ | 131K | 💰 |
| Gemini 2.5 Flash | ⚡⚡⚡ (similar) | ✅ | ✅ | 1M | 💰💰 |
| Llama 3.3 70B | ⚡⚡⚡⚡ (500 tps) | ❌ | ❌ | 128K | 💰 |
| GPT-OSS 120B | ⚡⚡⚡⚡ (500 tps) | ✅ | ❌ | 131K | 💰💰 |

## Mejores Prácticas

### 1. Instrucciones Claras
```
BUENO: Resuelve paso a paso explicando cada parte de tu razonamiento
MALO: Resuelve esto
```

### 2. Formato Esperado
```
BUENO: Responde en formato JSON con campos: respuesta, confianza, fuentes
MALO: Dame la respuesta
```

### 3. Contexto Relevante
```
BUENO: Basándote en Python 3.10+, escribe...
MALO: Escribe código
```

### 4. Longitud Apropiada
- **Preguntas cortas**: 1-2 líneas
- **Análisis**: 3-5 líneas
- **Coding**: Incluir contexto necesario

## Cuándo Activar/Desactivar Razonamiento

### Activar R1 cuando:
- Problema matemático complejo
- Análisis multi-paso
- Decisión estratégica
- Debugging de código
- Necesitas explicación detallada

### Desactivar R1 cuando:
- Chat casual
- Preguntas simples
- Necesitas respuesta rápida
- Generación creativa rápida
- Traducción simple

## Prompts Recomendados por Tipo

### Matemáticas
```
Resuelve: [ecuación]
Pasos:
1. [usuario debe ver esto]
2. [y esto]
3. [solución]
Respuesta final: \boxed{[respuesta]}
```

### Código
```
Requisitos:
- Lenguaje: [lenguaje]
- Framework: [si aplica]
- Características: [listar]

Incluye:
- Tipos correctos
- Manejo de errores
- Comentarios
```

### Análisis
```
Tema: [tema]
Perspectivas a considerar:
- [perspectiva 1]
- [perspectiva 2]
- [perspectiva 3]

Formato: Lista con pro/contra de cada una
```

### Creativo
```
Escribe [tipo de contenido]
Estilo: [estilo]
Tono: [tono]
Restricciones: [restricciones]
```

## Troubleshooting

### Respuestas muy cortas
- Pedir explícitamente más detalle
- Usar razonamiento activado
- Hacer preguntas follow-up

### Razonamiento no visible
- Usar `reasoning_format: "parsed"` en API
- En UI, el razonamiento se muestra en panel aparte
- Algunos modelos ocultan razonamiento interno

### Timeout o error
- Reducir contexto (acortar historial)
- Simplificar la pregunta
- Esperar e intentar de nuevo
- Verificar API key de Groq

### Respuesta en inglés cuando esperas español
- Incluir "Responde en español" en el prompt
- Usar ejemplos en español
- Establecer idioma en system prompt

## Estadísticas de Uso

Monitorea en tiempo real:
- Tokens gastados
- Tiempo de respuesta
- Modelo usado
- Razonamiento activado/desactivado

## API Directa (Groq)

Si quieres usar directamente desde código:

```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen/qwen3-32b",
    "messages": [
      {"role": "user", "content": "Tu pregunta"}
    ],
    "reasoning_format": "parsed",
    "temperature": 0.6,
    "max_tokens": 8000
  }'
```

## Preguntas Frecuentes

**P: ¿Por qué algunos modelos dicen "R1" y otros no?**
R: R1 significa "Reasoning" - razonamiento complejo. Solo ciertos modelos lo soportan.

**P: ¿Puedo usar imágenes con Qwen3-32B?**
R: No, usa Gemini 2.5 Flash o Gemma 3 27B para imágenes.

**P: ¿Es más rápido que GPT-OSS?**
R: Similar en velocidad (~400 vs ~500 tps), pero Qwen es más eficiente en razonamiento.

**P: ¿Qué costo tiene usar razonamiento?**
R: Los tokens de razonamiento se cuentan en el output, incrementando el costo.

**P: ¿Puedo cambiar el modelo a mitad de una conversación?**
R: Sí, pero la nueva respuesta partirá del historial con el nuevo modelo.

## Siguiente: Ver Documentación Completa

Para más detalles, revisar: `QWEN3_32B_INTEGRATION.md`
