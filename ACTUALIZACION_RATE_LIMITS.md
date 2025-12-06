# 🔄 Actualización de Rate Limits - Gemini Free Tier 2025-12-04

## ¿Qué cambió?

Se han actualizado los límites de rate limiting para reflejar los **límites exactos del Free Tier de Google Gemini** según la documentación oficial más reciente.

**Fuente**: https://ai.google.dev/gemini-api/docs/rate-limits (Actualizado: 4 de Diciembre de 2025)

---

## Límites Anteriores (Estimados)

```
gemini-2.5-flash:  10 RPM, 1000 RPD
gemini-2.0-flash:  10 RPM, 1000 RPD
gemini-2.5-pro:    10 RPM, 1000 RPD
```

---

## Límites Nuevos (Oficiales - Free Tier)

### Tabla Comparativa

| Modelo | RPM Anterior | RPM Nuevo | RPD Anterior | RPD Nuevo | Cambio |
|--------|--------------|-----------|--------------|-----------|--------|
| **gemini-2.5-flash** | 10 | **10** | 1000 | **250** | ⬇️ -75% (RPD) |
| **gemini-2.0-flash** | 10 | **15** | 1000 | **200** | ⬆️ +50% (RPM), ⬇️ -80% (RPD) |
| **gemini-2.5-pro** | 10 | **2** | 1000 | **50** | ⬇️ -80% (RPM), ⬇️ -95% (RPD) |

---

## Detalles de Cambios

### 1. Gemini 2.5 Flash
- **RPM**: Sin cambios (10 RPM)
- **RPD**: Reducido significativamente de 1000 a **250 requests/día**
- **Impacto**: Usuarios con alto volumen necesitarán ser más cuidadosos con el límite diario
- **Recomendación**: Para aplicaciones de producción, considerar comprar créditos o migrar a tier pagado

### 2. Gemini 2.0 Flash
- **RPM**: Aumentado de 10 a **15 RPM** ✅
- **RPD**: Reducido de 1000 a **200 requests/día**
- **Impacto**: Mejor para ráfagas rápidas, pero peor para volumen diario
- **Nota**: Este modelo tiene TPM de 1,000,000 (mucho más alto que otros)

### 3. Gemini 2.5 Pro
- **RPM**: Muy restrictivo, reducido a **2 RPM**
- **RPD**: Reducido dramáticamente a **50 requests/día**
- **Impacto**: Prácticamente inutilizable en free tier para aplicaciones de producción
- **Recomendación**: Usar solo en casos especiales donde necesites máxima calidad

---

## Implicaciones para Tu App

### Plan Free (3 días de reinicio)

Con los nuevos límites:

| Escenario | Modelo Recomendado | Máx Requests/Día | Notas |
|-----------|------------------|------------------|-------|
| Uso casual (< 10 req/día) | 2.5 Flash o 2.0 Flash | 250-200 | ✅ Suficiente |
| Uso moderado (50 req/día) | 2.5 Flash | 250 | ✅ Funciona |
| Uso intenso (100+ req/día) | Necesita tier pagado | - | ❌ Insuficiente |
| Tareas críticas | 2.5 Pro | 50 | ⚠️ Muy limitado |

### Estructura de Precios (para referencia)

Si un usuario quiere más límites:

- **Free Tier**: 250 RPD (2.5 Flash), gratis
- **Tier 1 (Pagado)**: 10,000+ RPD, requiere tarjeta de crédito
- **Premium (30 referrals)**: 3 días con límites mejorados (diseño tuyo)

---

## Cómo Implementar Esta Actualización

### 1. Archivo Actualizado ✅

El archivo `server/rate-limit-tracker.ts` ya contiene los límites correctos:

```typescript
export const MODEL_LIMITS = {
  "gemini-2.5-flash": {
    minuteLimit: 10,    // RPM
    dayLimit: 250,      // RPD (actualizado)
  },
  "gemini-2.0-flash": {
    minuteLimit: 15,    // RPM (aumentado)
    dayLimit: 200,      // RPD (actualizado)
  },
  "gemini-2.5-pro": {
    minuteLimit: 2,     // RPM (reducido)
    dayLimit: 50,       // RPD (actualizado)
  },
};
```

### 2. Documentación Actualizada ✅

- `INTEGRACION_SISTEMAS.md`
- `PASOS_SIGUIENTES.md`
- `QUICK_START.md`
- `RESUMEN_IMPLEMENTACION.md`

### 3. Próximas Acciones

- [ ] Comunicar a usuarios sobre nuevos límites
- [ ] Actualizar UI para mostrar límites correctos por modelo
- [ ] Considerar advertencia cuando usuario se acerca a 200 RPD (2.0 Flash) o 250 RPD (2.5 Flash)
- [ ] Implementar recomendaciones automáticas de modelo según uso
- [ ] Considerar ofrecer tier pagado como opción

---

## Métricas Importantes

### TPM (Tokens Per Minute) - Límite Global

Todos los modelos Free Tier tienen estos límites de TPM:

| Modelo | TPM | Implicaciones |
|--------|-----|---------------|
| gemini-2.5-flash | 250,000 | Aprox 2,000 tokens/request |
| gemini-2.0-flash | **1,000,000** | Mucho más alto, mejor para contextos largos |
| gemini-2.5-pro | 250,000 | Similar a Flash |

---

## Monitoreo y Alertas

Considera implementar alertas cuando:

1. **Usuario alcanza 80% del límite RPD**
   - Advertencia: "Quedan XX requests para hoy"

2. **Usuario alcanza 90% del límite RPM (para ráfagas)**
   - "Espera un minuto para la siguiente solicitud"

3. **Usuario está usando modelos ineficientemente**
   - Sugerencia: "Considera usar 2.0 Flash para mayor velocidad"

---

## FAQ

### P: ¿Afecta esto a usuarios premium?
R: No, esta actualización solo afecta el free tier. Considera definir límites propios para tu plan premium (30 referrals).

### P: ¿Qué pasa si alguien está usando 2.5 Pro constantemente?
R: Alcanzará el límite diario (50) muy rápido. Debería cambiar a 2.5 Flash (250 RPD).

### P: ¿Puedo pedir más límites a Google?
R: Sí, Google permite solicitudes de aumento de rate limit, pero no hay garantías en free tier.

### P: ¿Cuándo se resetean los límites?
R: Cada 24 horas a medianoche hora del Pacífico (PT).

---

## Historial de Cambios

| Fecha | Versión | Cambio |
|-------|---------|--------|
| 2025-12-04 | 1.1 | Actualización a límites oficiales Free Tier |
| 2025-12-01 | 1.0 | Implementación inicial con límites estimados |

---

## Referencias

- **Documentación oficial**: https://ai.google.dev/gemini-api/docs/rate-limits
- **Pricing**: https://ai.google.dev/gemini-api/docs/pricing
- **Blog reciente**: https://blog.laozhang.ai/api-guides/gemini-api-free-tier/

---

## Conclusión

Los nuevos límites son **más realistas** pero también **más restrictivos**. 

Para aplicaciones de producción con alto volumen:
- Considerar tier pagado de Gemini
- Implementar sistema de créditos
- Usar 30-day rolling average para monitoreo
- Ofrecer upgrades basados en consumo

Para aplicaciones casuales:
- Free tier sigue siendo viable
- 250 RPD (2.5 Flash) es razonable
- 15 RPM (2.0 Flash) es bueno para ráfagas

**Recomendación**: Comunicar claramente estos límites a tus usuarios en la UI. 📊
