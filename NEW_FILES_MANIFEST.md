# Nuevos Archivos - Sistema de Rate Limit en Tiempo Real

## Archivos Backend

### `server/rateLimitStream.ts` - NUEVO
**Propósito:** Gestiona Server-Sent Events (SSE) para actualizaciones de rate limit en tiempo real

**Funciones principales:**
- `subscribeToRateLimits(res, modelKey?)` - Suscribe cliente a SSE
- `sendSSEMessage(res, eventType, data)` - Envía evento formateado
- `notifyRateLimitUpdate(modelKey)` - Notifica a todos sobre actualización
- `startRateLimitBroadcaster()` - Inicia broadcaster de 1 segundo
- `getSubscriberCount()` - Retorna cantidad de clientes activos
- `clearAllSubscribers()` - Limpia conexiones (para shutdown)

**Uso:** Importado por `server/routes.ts` para crear endpoints SSE

---

## Archivos Frontend

### `client/src/hooks/useRateLimitStream.ts` - NUEVO
**Propósito:** Hook React para suscribirse a actualizaciones SSE de rate limits

**Exports:**
- `useRateLimitStream(options)` - Hook principal con reconexión automática
  - Retorna: `{ limitInfo, isConnected, error, reconnect, disconnect }`
  
- `useRateLimitInfo(modelKey?)` - Hook alternativo para obtener info una sola vez
  - Retorna: `{ info, loading, error }`

**Interfaz RateLimitInfo:**
```typescript
{
  available: boolean;
  modelKey: string;
  resetTime: number;
  remainingMs: number;
  remainingSeconds: number;
  formattedTime: string; // "2m 30s"
  reason?: string;
  headers?: {
    remaining: { requests?, tokens? };
    reset: { requests?, tokens? };
  };
}
```

---

### `client/src/components/RateLimitAlert.tsx` - NUEVO
**Propósito:** Componente React que muestra alerta de rate limit con countdown

**Props:**
- `modelKey: string` - Identificador del modelo
- `modelName: string` - Nombre display del modelo
- `onAvailable?: () => void` - Callback cuando se reinicia

**Características:**
- Muestra nombre del modelo no disponible
- Countdown en grande: "Se reinicia en: 2m 30s"
- Información detallada de headers (si disponible)
- Indicador de estado de conexión SSE

**Uso:**
```tsx
<RateLimitAlert 
  modelKey="llama-3.3-70b"
  modelName="Llama 3.3 70B"
  onAvailable={() => enableButton()}
/>
```

---

## Archivos Documentación

### `RATE_LIMIT_REAL_TIME.md`
**Propósito:** Documentación técnica completa

**Contiene:**
- Overview del sistema
- Arquitectura backend y frontend
- Flujo completo de datos
- Documentación oficial utilizada
- Testing y troubleshooting

---

### `RATE_LIMIT_INTEGRATION_GUIDE.md`
**Propósito:** Guía práctica de integración

**Contiene:**
- Pasos para usar en tu aplicación
- Ejemplos de código para diferentes casos
- Testing manual
- Notas de seguridad
- Troubleshooting

---

### `RATE_LIMIT_IMPLEMENTATION_SUMMARY.txt`
**Propósito:** Resumen ejecutivo de cambios

**Contiene:**
- Objetivo logrado
- Lista detallada de cambios por archivo
- Flujo técnico completo
- Providers soportados
- Ventajas de la implementación

---

### `NEW_FILES_MANIFEST.md` (este archivo)
**Propósito:** Índice de nuevos archivos creados

---

## Archivos Modificados

### `server/providerLimits.ts`
**Cambios:**
- Agregados tipos para headers de rate limit
- Nueva función parseRetryAfterHeader()
- Nuevas funciones extractGroqLimitInfo() y extractOpenRouterLimitInfo()
- Actualizada recordRateLimitError() para capturar headers
- Actualizada getModelAvailabilityStatus() para retornar headers
- Nuevas funciones getRateLimitInfo() y getAllRateLimitedModels()

---

### `server/routes.ts`
**Cambios:**
- Agregados imports de rateLimitStream y getRateLimitInfo
- Actualizado manejo de error 429 en streamGeminiCompletion()
- Actualizado manejo de error 429 en streamChatCompletion()
- Actualizado manejo de error 429 en streamGroqCompletion()
- Agregado endpoint GET /api/rate-limits
- Agregado endpoint GET /api/rate-limits/stream (SSE)
- Agregada llamada a startRateLimitBroadcaster() en registerRoutes()

---

## Próximos Pasos para Usar

1. **Revisar estructura de archivos:**
   ```
   server/
     ├── routes.ts (MODIFICADO)
     ├── providerLimits.ts (MODIFICADO)
     └── rateLimitStream.ts (NUEVO)
   
   client/src/
     ├── components/
     │   └── RateLimitAlert.tsx (NUEVO)
     └── hooks/
         └── useRateLimitStream.ts (NUEVO)
   ```

2. **Integrar en tu página principal:**
   - Importar `RateLimitAlert` o usar hooks directamente
   - Mostrar alerta cuando modelo está limitado
   - Deshabilitar botón "Enviar" si hay rate limit

3. **Testing:**
   - Trigger un error 429
   - Verificar logs: `[Rate Limit] model limited for Xs`
   - Verificar SSE en DevTools → Network → stream
   - Verificar countdown decreciente en UI

4. **Deployar:**
   - Los archivos ya están listos
   - No requieren variables de entorno adicionales
   - No requieren cambios en BD

---

## Dependencias

**Backend:** 
- Express (ya existe)
- TypeScript (ya existe)
- `providerLimits.ts` (existente)

**Frontend:**
- React (ya existe)
- Lucide icons (`AlertCircle`)
- CSS/TailwindCSS (ya existe)

No se agregaron nuevas dependencias npm.

---

## Performance

- **SSE:** 1 evento/segundo por suscriptor
- **Memoria:** ~100 bytes por cliente conectado
- **CPU:** Mínimo overhead
- **Ancho de banda:** ~500 bytes/segundo por cliente

Escalable a cientos de clientes simultáneos.

---

## Seguridad

✅ Tiempo viene del servidor (no se puede manipular)
✅ Cada modelo tiene su propio estado
✅ Limpieza automática cada 24 horas
✅ Reconexión automática (no exponencial)
✅ No requiere autenticación adicional

---

## Soporte para Múltiples Modelos

El sistema soporta simultáneamente:
- Groq: `llama-3.3-70b`, `gpt-oss-120b`, `qwen3-32b`
- OpenRouter: `qwen-coder`, `deepseek-r1t2`, `gemma-3-27b`
- Gemini: `gemini-2.5-flash`

Cada modelo mantiene su propio estado de rate limit.

---

## Debugging

**Logs disponibles:**
```
[Rate Limit] model limited for 179s. Headers: {...}
[Rate Limit Stream] Client subscribed for model llama-3.3-70b
[Rate Limit Broadcaster] Starting real-time rate limit updates
```

**Monitoreo:**
- DevTools Console: busca `[Rate Limit]`
- DevTools Network: filtra por "stream"
- Backend logs: `console.log` con [Rate Limit] prefix
