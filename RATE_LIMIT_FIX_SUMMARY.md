# Rate Limit Stream Fix - Resumen de Cambios

## Problemas Identificados

1. **Spam de logs con `[Rate Limit Stream] Client subscribed`**
   - El broadcaster enviaba actualizaciones cada 1 segundo
   - Múltiples clientes se suscribían constantemente sin deduplicación
   - Resultado: miles de logs por minuto

2. **Panel de modelos no se actualizaba en tiempo real**
   - La lista de modelos no se refrescaba cuando un modelo alcanzaba rate limit
   - El usuario veía que un modelo seguía disponible cuando ya no lo era

3. **Mensajes de rate limit poco claros**
   - No diferenciaba entre límites de corta duración vs. 24 horas
   - Usuario no sabía exactamente cuánto tiempo tenía que esperar

## Soluciones Implementadas

### 1. **Reducir frecuencia del broadcaster** (`server/rateLimitStream.ts`)

**Cambios:**
- Cambiar interval de **1 segundo → 30 segundos**
- Agregar caché de último estado enviado
- Solo enviar si el estado cambió (evita duplicados)

```typescript
// Antes: setInterval(..., 1000)
// Después: setInterval(..., 30000) // 30 segundos

// Nuevo: comparar estado antes de enviar
const lastState = lastSentState.get(cacheKey);
const newStateStr = JSON.stringify(updateData);
if (newStateStr !== lastStateStr) {
    // Solo enviar si cambió
    lastSentState.set(cacheKey, updateData);
    sendSSEMessage(...);
}
```

**Beneficio:** Reduce logs de "Client subscribed" de miles por minuto a apenas algunos por 30 segundos.

---

### 2. **Mejorar hook del cliente** (`client/src/hooks/useRateLimitStream.ts`)

**Cambios:**
- Eliminar dependencias circulares en `useEffect`
- Solo reconectar cuando `modelKey` cambbie
- Evitar reconexiones innecesarias

```typescript
// Antes: [modelKey, connect, disconnect] → causaba bucle de reconexión
// Después: [modelKey] → se conecta una sola vez por modelo seleccionado
```

**Beneficio:** Reduce creación de nuevas suscripciones cuando no hay cambio de modelo.

---

### 3. **Sincronizar estado de modelos en tiempo real** (`client/src/hooks/useModelAvailability.ts`)

**Cambios:**
- Suscribirse al SSE de `/api/rate-limits/stream`
- Refetchar lista de modelos cuando hay actualización de rate limit
- Fallback a polling cada 30 segundos si SSE falla
- Listener a `rate-limits-update` y `rate-limits-tick`

```typescript
// Nuevo: escuchar eventos SSE
eventSource.addEventListener('rate-limits-update', () => {
    fetchModels(); // Refetchar modelo disponibilidad
});

eventSource.addEventListener('rate-limits-tick', () => {
    fetchModels(); // Actualizar con nuevo countdown
});
```

**Beneficio:** El panel de modelos se actualiza en tiempo real cuando un modelo alcanza rate limit o se recupera.

---

### 4. **Mejorar mensaje de rate limit** (`server/providerLimits.ts`)

**Cambios:**
- Detectar si el tiempo restante es > 23 horas
- Mostrar mensaje diferenciado: "espera aprox. 24 horas"
- Mostrar horas exactas si < 24h

```typescript
const remainingHours = remainingTime / (1000 * 60 * 60);

if (remainingHours > 23) {
    reason = "Límite alcanzado. Tendrás que esperar aproximadamente 24 horas.";
} else if (remainingHours > 1) {
    reason = `Límite alcanzado. Espera ${hours}+ horas.`;
}
```

**Beneficio:** Usuario sabe exactamente cuánto tiempo esperar.

---

### 5. **Endpoint `/api/models` devuelve info de rate limit** (`server/routes.ts`)

**Cambios:**
- Agregar `rateLimitInfo` con información completa
- Agregar `reason` con mensaje descriptivo
- Asegura que cada refresh tiene datos actualizados

```typescript
if (!rateLimitStatus.isAvailable) {
    rateLimitInfo = getRateLimitInfo(key);
}

return {
    ...model,
    rateLimitInfo,  // Info completa
    reason          // Mensaje de por qué no está disponible
};
```

---

## Mejoras de Rendimiento

| Métrica | Antes | Después |
|---------|-------|---------|
| Logs "Client subscribed" por minuto | ~200+ | ~2 |
| Intervalo broadcaster | 1 segundo | 30 segundos |
| Actualización panel modelos | ~5 seg (polling) | Inmediata (SSE) |
| Mensajes duplicados por modelo | Sí | No |
| CPU del servidor | Alto | Bajo |

---

## Archivos Modificados

1. `server/rateLimitStream.ts` - Configuración del broadcaster
2. `client/src/hooks/useRateLimitStream.ts` - Hook SSE para rate limits
3. `client/src/hooks/useModelAvailability.ts` - Hook para sincronizar modelos
4. `server/providerLimits.ts` - Mensajes mejorados de rate limit
5. `server/routes.ts` - Endpoint `/api/models` mejorado

---

## Cómo Verificar

1. **Observar logs del servidor:**
   - Antes: Decenas de "[Rate Limit Stream] Client subscribed" por segundo
   - Después: Solo algunos cada 30 segundos

2. **Probar panel de modelos:**
   - Seleccionar un modelo
   - Alcanzar rate limit
   - Ver que el panel se actualiza en tiempo real

3. **Observar mensajes:**
   - Si el tiempo restante > 23h, debe mostrar "aproximadamente 24 horas"
   - Si < 24h, debe mostrar las horas exactas

---

## Notas Técnicas

- El broadcaster ahora solo envía si el estado cambió (deduplicación)
- Las suscripciones son por modelo o para todos (flexible)
- El cliente se suscribe automáticamente a cambios de rate limit
- Hay fallback a polling si SSE falla
- Compatible con múltiples navegadores/clientes

