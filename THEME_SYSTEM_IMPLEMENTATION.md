# Sistema de Temas Completo

## Resumen de Cambios

Se implementó un sistema de temas completo que combina **modos** (roblox/general) con **tonos** (oscuro/claro). Cada combinación tiene su propio esquema de colores coherente sin conflictos.

## Estructura de Temas

### 1. **Roblox Oscuro** (`.roblox-dark`)
- **Paleta**: Violeta profundo, azul, morado
- **Background**: `260 30% 8%` (muy oscuro)
- **Foreground**: `260 20% 95%` (casi blanco)
- **Primary**: `280 85% 55%` (violeta brillante)
- **Shadow**: Oscuro intenso

### 2. **Roblox Claro** (`.roblox-light`)
- **Paleta**: Blanco/Gris claro con acentos violeta
- **Background**: `0 0% 98%` (casi blanco)
- **Foreground**: `260 20% 15%` (casi negro)
- **Primary**: `280 85% 55%` (violeta brillante)
- **Shadow**: Suave y ligero

### 3. **General Oscuro** (`.general-dark`)
- **Paleta**: Azul profundo, índigo, tonos fríos
- **Background**: `240 35% 7%` (muy oscuro)
- **Foreground**: `240 15% 93%` (casi blanco)
- **Primary**: `250 100% 68%` (azul índigo brillante)
- **Shadow**: Oscuro moderado

### 4. **General Claro** (`.general-light`)
- **Paleta**: Blanco/Gris claro con acentos azul índigo
- **Background**: `0 0% 99%` (blanco puro)
- **Foreground**: `240 15% 12%` (casi negro)
- **Primary**: `250 100% 68%` (azul índigo brillante)
- **Shadow**: Suave y ligero

## Archivos Modificados

### 1. `client/src/index.css`
Completamente refactorizado con:
- 4 nuevas clases de tema (`.roblox-dark`, `.roblox-light`, `.general-dark`, `.general-light`)
- Cada clase define variables CSS consistentes para color, sombras, bordes, etc.
- Estilos de código inline y tablas adaptados a cada tema
- Todas las utilidades (typing-indicator, animated-border, prose-chat) heredan del contexto actual

### 2. `client/src/App.tsx`
- `initializeTheme()` simplificado para aplicar solo `.dark` al inicio
- El tema específico se aplica en ChatPage

### 3. `client/src/pages/ChatPage.tsx`
- **useEffect 1 (línea 115)**: Aplica tema basado en `chatMode` + `themeSettings`
  - Remueve todas las clases de tema anteriores
  - Aplica la clase correcta: `roblox-dark`, `roblox-light`, `general-dark`, o `general-light`
- **useEffect 2 (línea 147)**: Escucha cambios de tema y aplica dinámicamente
  - Reacciona a cambios en `themeSettings` desde el modal
  - Preserva el modo actual pero cambia el tono

### 4. `client/src/components/ProfileModal.tsx`
- `applyTheme()` (línea 87) ahora aplicalas clases correctas
- Considera el `chatMode` actual para determinar qué clase aplicar
- Remueve todas las clases de tema antes de añadir la nueva

## Flujo de Cambio de Tema

1. Usuario abre Modal de Perfil
2. Usuario cambia toggle de "Roblox Oscuro" o "Roblox Claro"
3. `handleRobloxThemeChange()` o `handleGeneralThemeChange()` se ejecuta
4. Se guarda en localStorage: `themeSettings`
5. Se dispara evento: `themeSettingsChange`
6. ChatPage escucha el evento y llama a `handleThemeChange()`
7. Las clases CSS se actualizan dinámicamente
8. Toda la página cambia de color porque todas las variables CSS están dentro de las clases

## Diferencias Visuales

| Aspecto | Roblox | General |
|---------|--------|---------|
| **Color Primario** | Violeta `#8B5CF6` | Azul Índigo `#4F46E5` |
| **Estilo** | Gaming, vibrante | Tech, profesional |
| **Tonos Oscuros** | Azul violáceo | Azul frío profundo |
| **Tonos Claros** | Gris cálido | Gris frío |

## Testing

El sistema ha sido probado con:
- ✓ Build success: `npm run build`
- ✓ Cambios de modo (roblox ↔ general)
- ✓ Cambios de tono (oscuro ↔ claro)
- ✓ Persistencia en localStorage
- ✓ Aplicación inmediata sin recargar página

## Notas Técnicas

- **Sin conflictos**: Las clases están estructuradas para que solo una esté activa
- **Performance**: Variables CSS se heredan, no hay cálculos adicionales
- **Mantenibilidad**: Toda la configuración está en `index.css`, fácil de ajustar colores
- **Compatibilidad**: Mantiene fallback a `.dark` para casos edge

## Próximos Pasos (Opcional)

Si necesitas ajustar los colores:
1. Edita las secciones relevantes en `index.css`
2. Modifica los valores HSL de las variables
3. Rebuild: `npm run build`

Todos los componentes heredarán automáticamente los nuevos colores.
