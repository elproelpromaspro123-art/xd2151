# Pasos Siguientes - Integración Completada

## ✅ Lo que ya está implementado

1. **Discord Webhook Logging** - Sistema automático de registro de chats
2. **Rate Limiting Gemini** - Control de límites por minuto/día
3. **Contador de Mensajes** - Reinicio automático cada 3 días
4. **Sistema de Referrals** - Premium por 30 invitaciones (máximo 2 cuentas por IP)
5. **Server-Sent Events (SSE)** - Actualizaciones en tiempo real
6. **Componentes React** - UI para mostrar datos en tiempo real
7. **Rutas Backend** - Endpoints para todas las funcionalidades

---

## 🚀 Pasos para completar la integración

### Paso 1: Compilar y verificar tipos TypeScript
```bash
npm run check
```
Asegúrate de que no hay errores de tipos.

### Paso 2: Iniciar el servidor en desarrollo
```bash
npm run dev
```
El servidor debería iniciar sin errores en los logs.

### Paso 3: Ejecutar tests de integración
```bash
npx ts-node test-integration.ts
```
Esto verificará que todos los endpoints funcionan correctamente.

### Paso 4: Integrar logging en endpoint `/api/chat`

En `server/routes.ts`, después de que el bot responde (en la función `streamGeminiCompletion`, `streamGroqCompletion`, o `streamChatCompletion`):

```typescript
// Después de obtener fullContent (respuesta completa del bot)
if (userId && user?.email && currentConversationId) {
  // Registrar en Discord webhook
  await logChatToDiscord(
    userId,
    user.email,
    currentConversationId,
    (await getUserConversation(userId, currentConversationId))?.title || "Sin título",
    message,
    fullContent,
    selectedModel
  );
}
```

### Paso 5: Conectar frontend a actualizaciones en tiempo real

En la página del chat (`client/src/pages/ChatPage.tsx` o similar):

```tsx
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { RateLimitDisplay } from "@/components/RateLimitDisplay";
import { MessageResetTimer } from "@/components/MessageResetTimer";
import { ReferralDisplay } from "@/components/ReferralDisplay";

export function ChatPage() {
  const user = useAuthStore(state => state.user);
  const { messageResetInfo, rateLimitStatus, referralStats, isConnected } = 
    useRealtimeUpdates(user?.id || null);

  return (
    <div className="space-y-4">
      {/* Mostrar conectividad SSE */}
      {!isConnected && user && (
        <div className="text-xs text-yellow-600">
          Conectando a actualizaciones...
        </div>
      )}

      {/* Componentes de estado */}
      <MessageResetTimer resetInfo={messageResetInfo} />
      <RateLimitDisplay 
        modelKey="gemini-2.5-flash" 
        status={rateLimitStatus["gemini-2.5-flash"]} 
      />
      <ReferralDisplay stats={referralStats} />

      {/* Rest del chat... */}
    </div>
  );
}
```

### Paso 6: Validar rate limit antes de enviar mensaje

En el handler de envío de mensaje:

```typescript
async function handleSendMessage() {
  // Validar rate limit
  const rateLimitCheck = await fetch("/api/rate-limit/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelKey: selectedModel }),
  });

  if (!rateLimitCheck.ok) {
    const error = await rateLimitCheck.json();
    showError(`${error.message}`);
    return;
  }

  // Si pasa, continuar con el envío
  // ...
}
```

### Paso 7: Hacer persistente el sistema de referrals en BD

Actualmente el sistema de referrals usa archivos JSON. Para producción, migrarlo a PostgreSQL:

```typescript
// En server/auth.ts - función registerUser
import { referralLogs, users } from "@shared/schema";

export async function registerUser(
  email: string,
  password: string,
  referralCode?: string
) {
  // ... crear usuario ...

  // Si hay código de referral, registrar en BD
  if (referralCode) {
    const referrer = db.query.users
      .findFirst({ where: eq(users.referralCode, referralCode) });

    if (referrer) {
      db.insert(referralLogs).values({
        id: randomUUID(),
        referrerId: referrer.id,
        newUserId: newUser.id,
        newUserEmail: email,
        newUserIp: getClientIp(req),
        newUserIpHash: hashIp(getClientIp(req)),
        status: "pending",
      });
    }
  }
}
```

---

## 📋 Checklist de Testing

- [ ] Discord webhook recibe mensaje de prueba
- [ ] Rate limit se actualiza después de cada petición
- [ ] SSE conecta y recibe actualizaciones
- [ ] Contador de mensajes cuenta regresivo en tiempo real
- [ ] Link de referral personalizado funciona
- [ ] Premium se otorga después de 30 referrals

---

## 🔧 Configuración de Variables de Entorno

Asegúrate de tener en `.env`:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1446553036062462013/JypHWo3-g9h_7kM7e_vHkWQE23P11x7sSnZkuE1oqliiy-aARQP7IrlCgGUdsMNJGgsc
GOOGLE_GEMINI_API_KEY=tu_api_key
DATABASE_URL=tu_conexion_bd
PORT=5000
NODE_ENV=development
```

---

## 📊 Monitoreo

### Ver logs de webhook en Discord
El webhook enviará mensajes a tu canal de Discord cada vez que alguien cree un chat.

### Ver logs en terminal
```bash
# En desarrollo
npm run dev

# En producción
npm run build && npm start
```

Busca logs con:
- `[webhook-logs]` - Logs de Discord
- `[rate-limit]` - Cambios en rate limiting
- `[message-timer]` - Reinicio de mensajes
- `[referral]` - Eventos de referrals
- `[realtime]` - Conexiones SSE

---

## 🐛 Debugging

### Verificar conexión SSE
```javascript
// En consola del navegador
const es = new EventSource('/api/realtime?userId=tu_id');
es.onmessage = (e) => console.log('SSE:', e.data);
es.onerror = (e) => console.error('SSE Error:', e);
```

### Verificar webhook
```bash
curl -X POST https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN \
  -H "Content-Type: application/json" \
  -d '{"content":"Test message"}'
```

### Ver archivo de logs locales
```bash
cat data/webhook_logs.json
cat data/rate_limits.json
cat data/referrals.json
cat data/users.json
```

---

## 📊 Límites Exactos del Free Tier de Gemini (2025-12-04)

### Requests Per Minute (RPM) y Per Day (RPD)

| Modelo | RPM | RPD | Notas |
|--------|-----|-----|-------|
| `gemini-2.5-flash` | 10 | 250 | Modelo equilibrado, mejor para uso general |
| `gemini-2.0-flash` | 15 | 200 | Modelo más rápido, TPM hasta 1,000,000 |
| `gemini-2.5-pro` | 2 | 50 | Modelo más potente, muy restrictivo |

**Importante**: Los límites de TPM (Tokens Per Minute) se mantienen en 250,000 TPM para todos los modelos (excepto 2.0-flash que tiene 1,000,000 TPM).

Fuente: https://ai.google.dev/gemini-api/docs/rate-limits

---

## ⚠️ Casos Límite Conocidos

1. **SSE desconecta después de 30 segundos de inactividad**
   - Normal, el servidor envía ping cada 30s
   - Cliente debería reconectar automáticamente

2. **Rate limit resetea pero no se muestra en tiempo real**
   - Causa: SSE no está conectado
   - Solución: Verificar conexión SSE

3. **Referral no cuenta si comparte el mismo email**
   - Esperado: 1 email = 1 cuenta
   - Solución: Usar emails diferentes para test

4. **Discord webhook falla**
   - Causa: URL webhook inválida o expirada
   - Solución: Generar nueva URL en Discord
   - Los logs se guardan localmente aunque falle

5. **Gemini 2.5 Pro agota límite diario muy rápido**
   - Esperado: Solo 50 requests/día en free tier
   - Solución: Usar gemini-2.5-flash para uso general, Pro solo para tareas críticas

---

## 📈 Próximas Características (Optional)

- [ ] Dashboard de análisis de chats
- [ ] Alertas en Discord cuando se alcanzan límites
- [ ] Bonificación extra de referrals
- [ ] Historial de cambios de rate limit
- [ ] Exportación de conversaciones
- [ ] Sistema de suspensión por abuso

---

## 🎯 Success Criteria

✅ Todo funciona correctamente cuando:

1. ✅ Chats aparecen en Discord dentro de 1-2 segundos
2. ✅ Rate limit se bloquea exactamente en el límite
3. ✅ Contador de mensajes reinicia cada 3 días
4. ✅ SSE actualiza sin necesidad de F5
5. ✅ Referral premium se otorga a los 30 usuarios
6. ✅ Máximo 2 cuentas por IP funciona correctamente

---

Para más detalles, ver `INTEGRACION_SISTEMAS.md`
