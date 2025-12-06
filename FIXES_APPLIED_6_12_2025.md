# Fixes Applied - December 6, 2025

## Issues Fixed

### 1. Send Button Not Working + Added "Auto" Mode
**Problem:** The 500, 1000, 1500, 2000 buttons were selected, but the send button remained disabled because it required message content.

**Solution:** 
- Added `canSendWithLineCountOnly` state to allow sending with ONLY line count selected
- Modified send button disabled condition: `(!hasContent && !canSendWithLineCountOnly)`
- When specific line count is selected, auto-generates default prompt:
  - **ScreenGui mode:** "Genera una UI moderna y profesional de {lineCount} líneas exactas sin errores."
  - **LocalScript mode:** "Genera un script autocontenido funcional de {lineCount} líneas exactas sin errores."
- **Added Fifth Button "Auto" (Purple Gradient)** - allows free conversation without line count restrictions
  - Users can now chat naturally in Roblox mode without forcing code generation
  - Bot has full freedom to respond with messages, explanations, or code
  - Requires user to type a message (normal chat behavior)
  - No CONFIG_ROBLOX_LINE_COUNT is sent in auto mode

**Button Behavior:**
| Button | Color | Behavior |
|--------|-------|----------|
| 500 | Cyan-Blue | Fixed 500 lines, can send without typing |
| 1000 | Cyan-Blue | Fixed 1000 lines, can send without typing |
| 1500 | Cyan-Blue | Fixed 1500 lines, can send without typing |
| 2000 | Cyan-Blue | Fixed 2000 lines, can send without typing |
| Auto | Purple-Pink | Free conversation, must type message |

**Files Changed:**
- `client/src/components/chat/ChatInput.tsx` (lines 72-78, 197, 160-178, 614-656)

### 2. Bot Not Acknowledging Code Generation Start
**Problem:** When sending Roblox code requests, the model immediately starts generating without indication.

**Solution:**
- Server now sends acknowledgment message when Roblox mode is detected
- Message includes: script type (ScreenGui/LocalScript) and line count
- Example: "Generando UI de ScreenGui con exactamente 1000 líneas sin errores..."

**Files Changed:**
- `server/routes.ts` (lines 2639-2651)

### 3. Gemini 2 (General Mode) Integration
**Status:** Already working correctly
- Gemini 2 ignores Roblox mode settings automatically
- General mode only shows mode toggles and web search
- No line count buttons appear in general mode

## Roblox API Updates (December 2024)

### Major Features Shipped in Q4 2024
1. **Mesh and Image APIs** - EditableMesh and EditableImage now available in published experiences
2. **Studio Luau File Sync Preview** - External editor sync support
3. **Accessory Adjustment APIs** - Size/placement controls for avatars
4. **New Audio API** - AngleAttenuation for directional audio

### Upcoming Features (Early 2025)
- **Acoustic Simulation** - Sound behavior simulation
- **Avatar Settings** - Size, collision, clothing controls
- **Player Script Packages** - Live-update camera/control scripts
- **New Studio UI** - Finalized flexible interface (January 2025)
- **Updated Type Solver** - Better Luau inference and type operators

### Platform Changes
- **Windows 7/8.1 Support** - Ending January 2025 (Windows 10+ required)
- **Legacy Chat System** - Removal April 30, 2025 (migrate to TextChatService)
- **Team Chat in Studio** - Removal January 30, 2025

### Validation Notes
- Current ROBLOX_API_REAL.md has valid properties for Roblox 2025
- Luau type checking fully supported in Studio
- Native Code Generation uses type annotations for optimization
- All UIComponents (UICorner, UIStroke, UIGradient) validated

## How The "Auto" Button Works

**Selection:** Click the **"Auto"** button (purple gradient) in Roblox mode

**Behavior:**
- No line count restrictions are sent to the AI
- Bot can respond with:
  - Normal conversation/explanations
  - Code snippets of any size
  - Multi-part responses with varying length
  - Full freedom without CONFIG_ROBLOX_LINE_COUNT constraints

**When to use:**
- Asking for guidance or explanations
- Learning about Roblox concepts
- Getting code reviews or debugging help
- Any conversation that doesn't require fixed-length code generation

**Difference from specific line counts (500/1000/1500/2000):**
- Specific counts: Forces exact line count, auto-generates prompt if needed
- Auto: Allows natural conversation, no code generation enforcement

## Testing Recommendations

1. **Test Specific Line Count:**
   - Switch to Roblox mode
   - Select 500, 1000, 1500, or 2000
   - Send button activates even without typing
   - Bot responds with exact line count acknowledgment

2. **Test Auto Mode:**
   - Select the "Auto" button (purple)
   - Type a question like "¿Cómo creo una UI?"
   - Bot responds naturally without line count restrictions
   - Can request code of any size

3. **Verify Acknowledgment Message:**
   - Check that bot says "Generando UI de ScreenGui con exactamente {lineCount} líneas sin errores..."
   - Should only appear when specific line counts are selected

4. **Test General Mode:**
   - Switch to General mode
   - Line count buttons disappear completely
   - Can type and send freely
   - Works with Gemini 2 and 2.5 models

## Configuration Notes

All configured code requests now automatically include:
- `CONFIG_ROBLOX_OUTPUT=screen` or `CONFIG_ROBLOX_OUTPUT=localscript`
- `CONFIG_ROBLOX_LINE_COUNT={selected}`
- Default prompt if user didn't type

These get parsed by the system prompt and ensure accurate code generation.
