# Cómo Usar GPT OSS 120B en tu Aplicación

## Acceso Inmediato

El modelo ya está disponible y listo para usar. No requiere configuración adicional.

### Opción 1: Desde la Interfaz Web

1. **Abre tu aplicación en el navegador**
   - Navega a tu sitio

2. **En la pantalla de chat, busca el selector de modelos**
   - Generalmente está en la parte superior o en un dropdown

3. **Selecciona "GPT OSS 120B"**
   - Aparecerá en la sección de modelos GRATUITOS
   - Muestra: ✨ (razonamiento habilitado)

4. **(Opcional) Activa "Razonamiento Avanzado"**
   - Si tu UI lo soporta, verás un toggle de "reasoning"
   - Esto habilita el pensamiento paso a paso

5. **Escribe tu mensaje y presiona enviar**
   - Ejemplo: "Resuelve este problema matemático complicado"
   - El modelo procesará tu solicitud con el contexto de 131K tokens

### Opción 2: Solicitud API Directa

```bash
# Asume que tienes un token de autenticación
TOKEN="tu_bearer_token_aquí"

curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "tu-conversation-id",
    "message": "¿Cuál es la mejor solución arquitectónica para este problema?",
    "model": "gpt-oss-120b",
    "useReasoning": true,
    "chatMode": "general"
  }' \
  --no-buffer
```

**Respuesta en streaming SSE:**
```
data: {"conversationId":"...", "requestId":"..."}
data: {"thinking":"Primero debo entender..."}
data: {"content":"La mejor solución sería..."}
data: [DONE]
```

## Casos de Uso Recomendados

### 1. Problemas Complejos con Razonamiento
```
"Necesito optimizar un algoritmo de ordenamiento para N=1,000,000 items. 
¿Cuál es la mejor estrategia? Explica tu razonamiento paso a paso."

useReasoning: true
```
→ Verás el pensamiento del modelo antes de la respuesta

### 2. Análisis de Documentos Largos
```
"Aquí va un documento de 30,000 palabras... ¿Cuáles son los puntos clave?"
```
→ Aprovecha los 131K tokens para documentos enormes

### 3. Consultas Multilingües
```
"Can you analyze this code AND explicar en español cómo optimizarlo?"
```
→ Excelente en 81+ idiomas simultáneamente

### 4. Búsqueda Web + Análisis
```
"¿Cuáles son las últimas tendencias en IA? Busca información reciente."

useWebSearch: true
```
→ Combina búsqueda web con análisis profundo

### 5. Programación Competitiva
```
"Resuelve este problema de LeetCode Hard en O(n log n)"
```
→ 62.4% en SWE-Bench, mejor que muchos otros modelos

## Diferencias vs Otros Modelos en tu App

| Característica | GPT OSS 120B | Llama 3.3 | Qwen Coder |
|---|---|---|---|
| **Velocidad** | 500 tps | 500 tps | Más lento |
| **Contexto** | 131K | 128K | 262K |
| **Razonamiento** | ✅ Sí | ❌ No | ❌ No |
| **Multilingüe** | ✅ 81 idiomas | ⚠️ Bueno | ⚠️ Limitado |
| **Programación** | ✅ Muy bueno | ✅ Muy bueno | ✅ Especializado |
| **Costo** | Económico | Económico | Económico |

**Cuándo usar cada uno:**
- **GPT OSS 120B:** Problemas generales, razonamiento, multilingüe
- **Llama 3.3:** Programación, uso general, conversación rápida
- **Qwen Coder:** Problemas SOLO de programación, máximo contexto

## Configuración Recomendada

### Para Mejor Razonamiento
```json
{
  "model": "gpt-oss-120b",
  "useReasoning": true,
  "temperature": 0.3,
  "chatMode": "general"
}
```
- Temperatura baja = respuestas más directas y razonadas
- Razonamiento habilitado = pensamiento profundo

### Para Respuestas Rápidas
```json
{
  "model": "gpt-oss-120b",
  "useReasoning": false,
  "temperature": 0.7,
  "chatMode": "general"
}
```
- Sin razonamiento = 3-5x más rápido
- Temperatura normal = respuestas más creativas

### Para Documentos Enormes
```json
{
  "model": "gpt-oss-120b",
  "useReasoning": false,
  "chatMode": "general"
  // Sin razonamiento para máxima capacidad de contexto
}
```
- 131K tokens completos para tu documento
- Procesamiento más rápido sin razonamiento

## Limitaciones Conocidas

| Limitación | Detalles |
|---|---|
| **No soporta imágenes** | Solo texto en/out |
| **Rate limiting** | ~30 req/min en plan free de Groq |
| **Razonamiento requiere presupuesto** | 5K tokens para users free |
| **Output máximo** | 65K tokens (muy generoso) |

## Troubleshooting

### "Modelo no aparece en el selector"
- Reinicia la aplicación
- Limpia caché del navegador (Ctrl+Shift+Del)
- Verifica que tu navegador está actualizado

### "Error de API: La clave no está configurada"
- Contacta al administrador
- Necesita variable de entorno `grokAPI` en servidor

### "Razonamiento no funciona"
- Solo funciona si `supportsReasoning: true` para el modelo
- Requiere `useReasoning: true` en tu solicitud
- Puede ser lento (es normal, necesita pensar)

### "Respuesta cortada o incompleta"
- Estás cerca del límite de 65K tokens de output
- Reduce el contexto anterior (limita a últimos 10 mensajes)
- O usa Llama 3.3 que tiene 32K pero es más eficiente

## Ventajas Principales

1. **Ultra Rápido en Groq** (~500 tps)
2. **Muy Económico** (~$0.0005 por respuesta típica)
3. **Contexto Enorme** (131K para documentos largos)
4. **Razonamiento Avanzado** (mismo nivel que modelos caros)
5. **Multilingüe** (81+ idiomas)
6. **Disponible para FREE users** (sin tier premium)

## Estadísticas del Modelo

```
Velocidad en Groq:    500 tokens/segundo ⚡
Contexto:             131,072 tokens (131K) 📚
Output máximo:        65,536 tokens (65K) 📝
Parámetros activos:   5.1B por token 🧠
Parámetros totales:   120B 🔧

Benchmarks:
  MMLU (razonamiento):  90.0% ✅
  SWE-Bench (código):   62.4% ✅
  MMMLU (multilingüe):  81.3% ✅
```

## Preguntas Frecuentes

**¿Es realmente gratis?**
- Sí, cualquier usuario puede usarlo
- Solo pagas si usas token masivamente (1M+ tokens/mes)
- Típicamente: $0.0005 por respuesta

**¿Qué tan bueno es para programación?**
- 62.4% en SWE-Bench (muy competitivo)
- Mejor que algunos modelos premium
- Excelente para debugging y refactoring

**¿Puedo usarlo para aplicaciones en producción?**
- Sí, totalmente
- Groq es confiable y rápido
- Costo muy bajo para volúmenes altos

**¿Qué pasa si agoté los 131K tokens?**
- Las respuestas estarán truncadas
- Reduce el contexto anterior o división en múltiples chats
- Llama 3.3 tiene 128K pero es más compacto

---

**¡Listo! Tu modelo GPT OSS 120B está operativo y funcional.**
