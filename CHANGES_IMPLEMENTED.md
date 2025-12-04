# Cambios Implementados

## 1. Reemplazo del Modelo GML 4.5 por Qwen 3 Coder
- **Modelo nuevo**: `qwen/qwen3-coder:free` con provider `venice/beta`
- **Capacidad**: 262k contexto / 262k output
- **Plan Free**: 70% de capacidad (183k tokens)
- **Plan Premium**: 95% de capacidad (249k tokens)
- **No soporta razonamiento** (especificado correctamente)
- **Especializado en programación**: Mejor para desarrollo que GML 4.5
- Eliminado modelo Nemotron NVIDIA

## 2. Mejoras en Búsqueda Web (Tavily)
- Cambio de `search_depth`: "basic" → "advanced"
- Inclusión de `raw_content` para información más completa
- Incremento de resultados: 5 → 7 búsquedas
- Adición de fecha de publicación en los resultados
- Mejor etiquetado de información "reciente"
- Manejo mejorado de errores con mensajes específicos

## 3. Reinicio de Límites de 7 días → 3 días
- Implementada nueva función `getResetPeriodStartDate()` que calcula períodos de 3 días
- Los límites de mensajes se reinician cada 3 días en lugar de cada semana
- Actualizado mensaje de error para reflejar "Los límites se reinician cada 3 días"

## 4. Iconos de Acciones en Mensajes
- Reposicionados de `-top-8` a `-bottom-8` (abajo del mensaje)
- Iconos aparecen al pasar el cursor sobre los mensajes
- Disponibles para ambos roles (usuario y asistente)
- Iconos: Copiar, Editar (solo usuario), Regenerar (solo asistente)
- Mejorado estilo con backdrop blur y mejor contraste

## 5. Visualización de Razonamiento (Thinking)
- Ya implementado: ThinkingIndicator muestra el razonamiento en tiempo real
- Aparece cuando `useReasoning = true` y hay contenido de razonamiento
- Formato expandible/colapsable como ChatGPT
- Distinta visualización en modo general vs modo roblox

## 6. Mostrar Porcentajes de Capacidad en Selector de Modelos
- Qwen Free: **70%** (mostrado en ámbar)
- Qwen Premium: **95%** (mostrado en índigo)
- Los porcentajes se muestran en el dropdown de modelos
- Información clara sobre capacidad máxima según plan

## 7. Mejoras de Tema/Color en Modo Oscuro
- **Background más oscuro**: 240 40% 8% → 240 40% 6%
- **Foreground más claro**: 240 40% 92% → 240 10% 94%
- **Input más oscuro**: 250 40% 28% → 250 40% 18%
- **Muted más oscuro**: 250 30% 24% → 250 30% 20%
- **Código inline**: Mejor contraste en ambos modos (slate-100 light, zinc-700 dark)
- **Bloques de código**: Mejorado con bordes y fondos distintos por tema
- **Textarea**: Colores explícitos para asegurar legibilidad

## 8. Manejo Mejorado de Errores de API
- Errores HTTP específicos con mensajes claros:
  - 429: "Límite de tasa alcanzado. Espera un momento..."
  - 503: "Servicio no disponible. Intenta de nuevo más tarde..."
  - 401/403: "Error de autenticación..."
- Manejo de timeouts: Sugerencia de mensajes más cortos
- Errores de red: Verificar conexión a internet
- Reintentos de streaming (hasta 3 intentos)
- Mejor logging para debugging

## 9. Validación Mejorada de Imágenes
- Validación de formato: Solo aceptar `data:image/*`
- Texto predeterminado si imagen se envía sin mensaje: "¿Qué ves en esta imagen?"
- Manejo correcto de fallos al enviar imagen

## 10. Resiliencia en Streaming
- Implementados reintentos automáticos (hasta 3 intentos)
- Mejor manejo de conexiones interrumpidas
- Trimming de datos para evitar espacios en blanco
- Manejo de AbortError para cancelaciones

## Modelos Finales
```
- qwen-coder (Free)         - 70% de 262k tokens
- deepseek-r1t2-chimera     - Premium (155k tokens con razonamiento)
- gemma-3-27b               - Premium (124k tokens con visión)
```

## Cambios de Archivo

### Server (backend)
- `/server/routes.ts`: Modelos, búsqueda Tavily, manejo de errores
- `/server/usageTracking.ts`: Período de 3 días

### Client (frontend)
- `/client/src/index.css`: Colores tema oscuro, tipografía
- `/client/src/components/chat/ChatInput.tsx`: Porcentajes, estilos input
- `/client/src/components/chat/MessageBubble.tsx`: Posición iconos
- `/client/src/pages/ChatPage.tsx`: Manejo de errores, reintentos

## Estado
✅ TypeCheck pass
✅ Cambios compilables
✅ Ready for deployment
