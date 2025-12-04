# Cambios Detallados - Rate Limit Stream Optimization

## 1. server/rateLimitStream.ts

### Cambio 1: Agregar configuración de intervalo
```typescript
// Línea 21: Nuevo
const UPDATE_INTERVAL_MS = 30000; // 30 segundos (antes era 1000ms = 1 segundo)

// Línea 19: Nuevo
const lastSentState = new Map<string, any>(); // Cache para evitar duplicados
```

### Cambio 2: Broadcaster con deduplicación
**Antes:**
```typescript
setInterval(() => {
    // Envía CADA segundo a TODOS los suscriptores
    // Incluso si el estado no cambió
}, 1000);
```

**Después:**
```typescript
export function startRateLimitBroadcaster() {
    setInterval(() => {
        if (subscribers.size === 0) return;

        subscribers.forEach((subscriber) => {
            try {
                if (!subscriber.res.writable) return;

                let updateData;
                let cacheKey: string;
                
                if (subscriber.modelKey) {
                    updateData = getRateLimitInfo(subscriber.modelKey);
                    cacheKey = `model_${subscriber.modelKey}`;
                } else {
                    updateData = getAllRateLimitedModels();
                    cacheKey = 'all_models';
                }

                // ✅ NUEVO: Comparar con último estado
                const lastState = lastSentState.get(cacheKey);
                const newStateStr = JSON.stringify(updateData);
                const lastStateStr = lastState ? JSON.stringify(lastState) : null;

                // Solo enviar si cambió
                if (newStateStr !== lastStateStr) {
                    lastSentState.set(cacheKey, updateData);
                    
                    if (subscriber.modelKey) {
                        sendSSEMessage(subscriber.res, "rate-limit-tick", updateData);
                    } else {
                        sendSSEMessage(subscriber.res, "rate-limits-tick", { models: updateData });
                    }
                }
            } catch (error) {
                console.error("[SSE] Error in broadcaster:", error);
                subscribers.delete(subscriber);
            }
        });
    }, UPDATE_INTERVAL_MS); // ✅ 30 segundos (antes 1 segundo)
}
```

---

## 2. client/src/hooks/useRateLimitStream.ts

### Cambio: Evitar reconexiones infinitas
**Antes:**
```typescript
useEffect(() => {
    connect();
    return () => {
        disconnect();
    };
}, [modelKey, connect, disconnect]); // ❌ Dependencias incorrectas
// Esto causa que cada cambio de `connect` trigger una reconexión
```

**Después:**
```typescript
useEffect(() => {
    // Solo conectar si modelKey cambió
    let shouldConnect = true;

    if (shouldConnect) {
        connect();
    }

    return () => {
        shouldConnect = false;
        disconnect();
    };
}, [modelKey]); // ✅ Solo depende de modelKey, no de funciones
```

---

## 3. client/src/hooks/useModelAvailability.ts

### Cambio: Agregar escucha de SSE para sincronización en tiempo real

**Antes:**
```typescript
export function useModelAvailability(models: AIModel[] | undefined) {
    const [updatedModels, setUpdatedModels] = useState<AIModel[]>(models || []);

    // Solo hacía polling cada 5 segundos SI había modelos rate-limited
    useEffect(() => {
        const hasRateLimited = updatedModels.some(m => m.isRateLimited);
        if (hasRateLimited) {
            const interval = setInterval(fetchModels, 5000);
            return () => clearInterval(interval);
        }
    }, [updatedModels, fetchModels]);
}
```

**Después:**
```typescript
import { useRef } from 'react';

export function useModelAvailability(models: AIModel[] | undefined) {
    const [updatedModels, setUpdatedModels] = useState<AIModel[]>(models || []);
    const eventSourceRef = useRef<EventSource | null>(null);

    // ✅ NUEVO: Suscribirse a cambios en tiempo real
    useEffect(() => {
        try {
            const eventSource = new EventSource('/api/rate-limits/stream');

            // Cuando hay cambio en rate limits, refetchar
            eventSource.addEventListener('rate-limits-update', (event: Event) => {
                fetchModels();
            });

            // Actualización periódica de countdown
            eventSource.addEventListener('rate-limits-tick', (event: Event) => {
                fetchModels();
            });

            eventSource.onerror = () => {
                eventSource.close();
                // Fallback a polling
                const interval = setInterval(fetchModels, 30000);
                return () => clearInterval(interval);
            };

            eventSourceRef.current = eventSource;
        } catch (error) {
            // Fallback si SSE falla
            const interval = setInterval(fetchModels, 30000);
            return () => clearInterval(interval);
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [fetchModels]);
}
```

---

## 4. server/providerLimits.ts

### Cambio: Mejorar mensajes según duración

**Antes:**
```typescript
return {
    isAvailable: false,
    remainingTime,
    resetTime: modelData.backoffUntil,
    reason: "Límite de rate limit alcanzado. Intenta de nuevo pronto.",
    // ❌ Mismo mensaje para 5 minutos y 24 horas
    ...
};
```

**Después:**
```typescript
// Determinar mensaje según el tiempo restante
let reason = "Límite de rate limit alcanzado. Intenta de nuevo pronto.";
const remainingHours = remainingTime / (1000 * 60 * 60);

// Si es > 23 horas, avisar explícitamente
if (remainingHours > 23) {
    reason = "Límite de rate limit alcanzado. Tendrás que esperar aproximadamente 24 horas.";
} else if (remainingHours > 1) {
    const hours = Math.floor(remainingHours);
    reason = `Límite de rate limit alcanzado. Espera ${hours}+ horas.`;
}

return {
    isAvailable: false,
    remainingTime,
    resetTime: modelData.backoffUntil,
    reason, // ✅ Mensaje dinámico basado en duración
    ...
};
```

---

## 5. server/routes.ts

### Cambio: Endpoint `/api/models` con información de rate limit completa

**Antes:**
```typescript
const models = Object.entries(AI_MODELS).map(([key, model]) => {
    const rateLimitStatus = getModelAvailabilityStatus(key);
    
    return {
        key,
        ...model,
        available: isAccessible && rateLimitStatus.isAvailable,
        isRateLimited: !rateLimitStatus.isAvailable,
        remainingTime: rateLimitStatus.remainingTime,
        resetTime: rateLimitStatus.resetTime,
        // ❌ No hay `reason` ni `rateLimitInfo` detallado
    };
});
```

**Después:**
```typescript
const models = Object.entries(AI_MODELS).map(([key, model]) => {
    const rateLimitStatus = getModelAvailabilityStatus(key);
    
    // ✅ NUEVO: Obtener información completa
    let rateLimitInfo: any = null;
    if (!rateLimitStatus.isAvailable) {
        rateLimitInfo = getRateLimitInfo(key);
    }
    
    return {
        key,
        ...model,
        available: isAccessible && rateLimitStatus.isAvailable,
        isRateLimited: !rateLimitStatus.isAvailable,
        remainingTime: rateLimitStatus.remainingTime,
        resetTime: rateLimitStatus.resetTime,
        rateLimitInfo,      // ✅ NUEVO: info detallada
        reason: rateLimitStatus.reason, // ✅ NUEVO: mensaje descriptivo
    };
});
```

---

## Impacto de Cambios

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| rateLimitStream.ts | +20 | Deduplicación + intervalo |
| useRateLimitStream.ts | +6 | Deps fix |
| useModelAvailability.ts | +42 | SSE + fallback polling |
| providerLimits.ts | +12 | Mensajes dinámicos |
| routes.ts | +8 | Info completa de rate limit |

**Total:** ~88 líneas de código nuevo/modificado

---

## Verificación de Cambios

### Test 1: Spam de logs
```bash
# Antes: grep "[Rate Limit Stream] Client subscribed" server.log | wc -l
# Después: Mucho menor (solo cuando hay cambios de suscripción)
```

### Test 2: Panel se actualiza
1. Seleccionar modelo
2. Generar error que cause rate limit
3. Observar panel
4. ✅ Modelo debe cambiar a "no disponible" en tiempo real

### Test 3: Mensaje de 24h
1. Causar rate limit en Groq (2h de espera)
2. Verificar que dice "espera 2+ horas"
3. Cambiar backoff a 24h
4. Verificar que dice "espera aproximadamente 24 horas"

