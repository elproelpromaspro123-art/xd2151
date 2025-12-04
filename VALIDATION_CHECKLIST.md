# Checklist de Validación de Cambios

## ✅ Cambios Completados

### 1. Modelo Qwen 3 Coder
- [x] Agregado modelo `qwen/qwen3-coder:free`
- [x] Provider `venice/beta` configurado
- [x] Capacidad Free: 70% (183k tokens)
- [x] Capacidad Premium: 95% (249k tokens)
- [x] Especificado que NO soporta razonamiento
- [x] Removido modelo GML 4.5
- [x] Removido modelo Nemotron NVIDIA
- [x] Actualizado modelo por defecto a `qwen-coder`

### 2. Búsqueda Web (Tavily)
- [x] Cambio a `search_depth: "advanced"`
- [x] Inclusión de `raw_content: true`
- [x] Aumento de `max_results` a 7
- [x] Adición de fecha de publicación
- [x] Mensajes de error mejorados
- [x] Formato "información más reciente"

### 3. Período de Reinicio
- [x] Cambio de 7 días a 3 días
- [x] Nueva función `getResetPeriodStartDate()`
- [x] Mensaje actualizado en respuesta de error
- [x] Cálculo correcto de períodos

### 4. UI de Mensajes
- [x] Iconos movidos a posición inferior (-bottom-8)
- [x] Aparecen al pasar cursor
- [x] Copiar disponible para ambos roles
- [x] Editar solo para usuario
- [x] Regenerar solo para asistente
- [x] Estilos mejorados (backdrop blur, transiciones)

### 5. Razonamiento
- [x] ThinkingIndicator ya funcional
- [x] Muestra streaming de razonamiento
- [x] Expandible/colapsable
- [x] Distinto en modo general vs roblox

### 6. Porcentajes de Modelos
- [x] Qwen Free muestra "70%"
- [x] Qwen Premium muestra "95%"
- [x] Colores distintos (ámbar y índigo)
- [x] Selector ancho aumentado a w-80

### 7. Tema Oscuro
- [x] Colores más oscuros
- [x] Mejora de contraste en foreground
- [x] Input mejorado (más oscuro)
- [x] Código inline con mejor contraste
- [x] Bloques de código mejorados
- [x] Textarea con colores explícitos

### 8. Manejo de Errores
- [x] Mensajes de error específicos por código HTTP
- [x] Reintentos de streaming (3 intentos)
- [x] Manejo de AbortError
- [x] Logging mejorado
- [x] Errores de timeout
- [x] Errores de red

### 9. Validación de Imágenes
- [x] Validación de formato data:image/*
- [x] Texto predeterminado si no hay mensaje
- [x] Manejo correcto de fallos

### 10. Resiliencia
- [x] Reintentos automáticos
- [x] Trimming de datos
- [x] Conexión resiliente

## 📝 Pasos para Probar

### Prueba 1: Cambio de Modelo
1. Abre la web
2. Haz clic en el selector de modelos
3. Verifica que "Qwen 3 Coder" sea la opción por defecto
4. Si eres usuario free, debe mostrar "70%"
5. Si eres premium, debe mostrar "95%"
6. Envía un mensaje de programación

**Resultado esperado**: El modelo responde sobre programación

### Prueba 2: Período de 3 Días
1. Envía 10 mensajes en un día (usuario free)
2. Intenta enviar el 11º mensaje
3. Debe aparecer error: "Los límites se reinician cada 3 días"

**Resultado esperado**: Error con mensaje correcto

### Prueba 3: Búsqueda Web
1. Haz una pregunta como "¿Cuál es la última noticia sobre IA?"
2. O activa manualmente la búsqueda web
3. Verifica que aparezcan fechas de publicación

**Resultado esperado**: Resultados con información reciente y fechas

### Prueba 4: Iconos de Mensaje
1. Hover sobre un mensaje del usuario
2. Verifica que aparezcan iconos abajo (Copiar, Editar)
3. Hover sobre un mensaje del asistente
4. Verifica que aparezcan iconos abajo (Copiar, Regenerar)

**Resultado esperado**: Iconos visibles al hacer hover

### Prueba 5: Tema Oscuro
1. Cambiar a modo oscuro
2. Enviar un mensaje
3. Verificar legibilidad del input
4. Verificar bloques de código

**Resultado esperado**: Todo legible sin problemas

### Prueba 6: Imágenes (Gemma 3)
1. Selecciona Gemma 3 27B (Premium)
2. Sube una imagen
3. Escribe una pregunta sobre la imagen
4. Envía el mensaje

**Resultado esperado**: El modelo responde sobre la imagen

### Prueba 7: Razonamiento (DeepSeek)
1. Selecciona DeepSeek R1T2 (Premium)
2. Activa el toggle de "Pensar"
3. Envía una pregunta compleja
4. Verifica que aparezca "Razonamiento en progreso"
5. Haz click para expandir el razonamiento

**Resultado esperado**: Razonamiento visible y expandible

## 🔧 Comandos

```bash
# Verificar tipos
npm run check

# Compilar
npm run build

# Desarrollo
npm run dev

# Deploy
# ... (según tu setup)
```

## 📋 Cambios de Archivos Modificados

```
✅ server/routes.ts          - Modelos, búsqueda, errores
✅ server/usageTracking.ts   - Período de 3 días
✅ client/src/index.css      - Colores tema
✅ client/src/components/chat/ChatInput.tsx    - Porcentajes, estilos
✅ client/src/components/chat/MessageBubble.tsx - Posición iconos
✅ client/src/pages/ChatPage.tsx - Manejo de errores
```

## 🚀 Ready for Deployment
Todos los cambios están compilados y listos para deploy.

**Fecha**: 2025-12-04
**Estado**: ✅ Completo y validado
