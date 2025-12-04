# Artifacts System - Developer Reference

## Architecture Overview

```
User Message
    ↓
AI Response (streaming)
    ↓
MessageContent (parses markdown)
    ↓
Code block detected > 50 chars?
    ├─ YES → ArtifactCard (compact)
    │         └─ onClick → setArtifactState()
    │              └─ ArtifactPanel (50% width)
    └─ NO  → CodeBlock (inline)
```

---

## Component Hierarchy

```
ChatPage
├─ ChatInput (sends messages)
├─ MessageBubble[] (displays messages)
│  └─ MessageContent (parses markdown)
│     ├─ ArtifactCard (NEW)
│     │  └─ onClick → onOpen callback
│     └─ CodeBlock (for short code)
└─ ArtifactPanel (50% right side)
   └─ Shows code + controls
```

---

## Key Files and Locations

### Backend
```
server/routes.ts
├─ AI_MODELS config (lines 66-190)
│  └─ "gemini-2.5-flash": { isPremiumOnly: true, ... }
├─ Premium check (line 695)
│  └─ if (AI_MODELS[selectedModel].isPremiumOnly && !isPremium)
└─ Streaming logic (lines 819-861)
   └─ Different handlers per provider
```

### Frontend
```
client/src/
├─ pages/ChatPage.tsx
│  ├─ artifactState: { isOpen, content, language, title }
│  └─ onOpenArtifact callback
├─ components/chat/
│  ├─ MessageContent.tsx (NEW: ArtifactCard integration)
│  ├─ ArtifactCard.tsx (NEW: compact display)
│  └─ ArtifactPanel.tsx (UPDATED: optimized UI)
└─ index.css
   └─ artifact-card styles (lines 862-890)
```

---

## Integration Points

### 1. Model Selection
**File:** `ChatInput.tsx:168-169`
```typescript
const freeModels = models.filter(m => !m.isPremiumOnly);
const premiumModels = models.filter(m => m.isPremiumOnly);
```
→ Filters models based on user premium status

### 2. Message Sending
**File:** `ChatPage.tsx:660-868`
```typescript
const isPremium = user.isPremium;
const selectedModel = "qwen-coder"; // or other
if (AI_MODELS[selectedModel].isPremiumOnly && !isPremium) {
  return error 403;
}
// Continue with streaming...
```
→ Validates model access before sending

### 3. Artifact Detection
**File:** `MessageContent.tsx:39-51`
```typescript
const shouldShowAsArtifact = codeString.length > 50;
if (shouldShowAsArtifact && onOpenArtifact) {
  return <ArtifactCard ... />;
}
```
→ Renders compact card instead of full code

### 4. Artifact Display
**File:** `ChatPage.tsx:927-937`
```typescript
{artifactState.isOpen && (
  <ArtifactPanel
    content={artifactState.content}
    language={artifactState.language}
    title={artifactState.title}
    onClose={() => setArtifactState({...})}
  />
)}
```
→ Shows full code in side panel

---

## Data Flow Example

### Request
```json
{
  "conversationId": "conv-123",
  "message": "Create a function",
  "model": "gemini-2.5-flash",
  "useReasoning": false
}
```

### Validation (Backend)
```typescript
const isPremium = user.isPremium; // true
const model = "gemini-2.5-flash";
const modelInfo = AI_MODELS[model];

if (modelInfo.isPremiumOnly && !isPremium) {
  response: { error: "Premium required" }
} else {
  // Stream response...
}
```

### Response (Streaming)
```
data: {"conversationId":"...","requestId":"..."}
data: {"content":"Here's a function:"}
data: {"content":"\n```javascript\nfunction..."}
data: {"content":"...```"}
data: [DONE]
```

### Processing (Frontend)
```javascript
fullMessage = "Here's a function:\n```javascript\nfunction..."

// MessageContent parses markdown
code = "function..."  // 50+ chars
language = "javascript"

// Renders ArtifactCard
→ User sees compact card
→ Click opens ArtifactPanel
```

---

## Styling System

### ArtifactCard States
```css
/* Default */
border: border/50
bg: gradient from-muted/35 to-muted/15
shadow: sm

/* Hover */
border: border/70 (+ shadow-lg)
bg: gradient from-muted/55 to-muted/25
overlay: blue-500/5 → purple-500/5 (opacity 100%)
icon: bg-blue-500/30
chevron: opacity 100%, translate-x-1

/* Focus */
ring: primary/50 (2px)
```

### Tailwind Classes Used
- Gradients: `from-*/to-*`, `group-hover:from-*`
- Transitions: `transition-all`, `duration-250`
- Colors: `text-foreground`, `bg-muted`, `text-primary`
- Layout: `flex`, `items-start`, `gap-3`, `relative`
- Responsive: No special handling (components adapt naturally)

---

## Customization Guide

### Change Artifact Threshold
```typescript
// MessageContent.tsx:17
const CODE_ARTIFACT_THRESHOLD = 50; // ← Change this
```

### Change Panel Width
```typescript
// ChatPage.tsx:722
className={`...${artifactState.isOpen ? 'hidden lg:flex lg:w-1/2' : 'flex w-full'}`}
// lg:w-1/2 ← Change to lg:w-2/3, lg:w-3/5, etc
```

### Change Colors
```typescript
// ArtifactCard.tsx
bg-blue-500/20      // ← Icon background
text-blue-400       // ← Icon color
from-blue-500/5     // ← Hover overlay
```

### Add New Languages
```typescript
// ArtifactCard.tsx:11-14
const displayLanguage = 
  language === "luau" ? "Luau" :
  language === "lua" ? "Luau" :
  language === "rust" ? "Rust" : // ← Add new
  language.toUpperCase();
```

---

## Testing Checklist

### Unit Tests (if added)
```typescript
// ArtifactCard.test.tsx
describe('ArtifactCard', () => {
  test('renders with correct props');
  test('calls onOpen when clicked');
  test('displays line count correctly');
  test('shows language badge');
});
```

### Integration Tests
```typescript
// MessageContent.test.tsx
describe('Code block rendering', () => {
  test('shows ArtifactCard for code > 50 chars');
  test('shows CodeBlock for code < 50 chars');
  test('passes correct language to ArtifactCard');
});
```

### Manual Tests
1. **Free User:** Verify Gemini 2.5 not selectable
2. **Premium User:** Verify Gemini 2.5 works
3. **Long Code:** Verify ArtifactCard renders
4. **Short Code:** Verify CodeBlock renders
5. **Click:** Verify panel opens
6. **Controls:** Verify copy/download/close work

---

## Performance Considerations

### Optimization Tips
- ✅ ArtifactCard is a functional component (memoized by React)
- ✅ No state in ArtifactCard (prop-driven)
- ✅ CSS transitions use GPU (transform, opacity)
- ✅ Panel uses ScrollArea for virtual scrolling (large files)
- ⚠️ Syntax highlighting can be slow for 100k+ lines
  → Consider debouncing or pagination

### Monitoring
```typescript
// Monitor artifact renders
useEffect(() => {
  console.time('ArtifactPanel render');
  return () => console.timeEnd('ArtifactPanel render');
}, []);

// Monitor code parsing
const start = performance.now();
const code = parseCode();
console.log(`Code parsing: ${performance.now() - start}ms`);
```

---

## Troubleshooting

### Issue: ArtifactCard not showing
**Causes:**
- Code < 50 characters (threshold)
- `onOpenArtifact` callback is undefined
- ArtifactCard not imported

**Fix:**
```typescript
// Check threshold
console.log('Code length:', code.length);

// Check callback
console.log('onOpenArtifact:', onOpenArtifact);

// Check import
import { ArtifactCard } from "./ArtifactCard"; // ✓
```

### Issue: Panel won't close
**Causes:**
- onClose handler not defined
- State not updating

**Fix:**
```typescript
// In ChatPage.tsx
onClose={() => setArtifactState(prev => ({
  ...prev,
  isOpen: false  // ← Must be explicit
}))}
```

### Issue: Styling looks wrong
**Causes:**
- CSS not compiled
- Tailwind classes not recognized
- Theme classes conflicting

**Fix:**
```bash
npm run build  # Rebuild CSS
npm run dev    # Hot reload
# Check DevTools: Elements → Styles
```

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Gradients | ✅ | ✅ | ✅ | ✅ |
| Transitions | ✅ | ✅ | ✅ | ✅ |
| Flexbox | ✅ | ✅ | ✅ | ✅ |
| Focus Rings | ✅ | ✅ | ✅ | ✅ |
| Scroll Smooth | ✅ | ✅ | 🟡 | ✅ |

---

## Future Enhancements

```typescript
// Potential improvements
interface ArtifactCard {
  // Current
  title: string;
  language: string;
  code: string;
  onOpen: () => void;
  
  // Future additions
  preview?: string;           // First 3 lines
  fileName?: string;          // file.js
  codeType?: 'code'|'docs';   // Type of artifact
  createdAt?: Date;           // Timestamp
  author?: string;            // Who wrote it
  isEditable?: boolean;       // Edit in panel
}
```

---

## Version History

- **v1.0** (Current)
  - Compact ArtifactCard component
  - Integrated with MessageContent
  - Panel with full code display
  - Gemini 2.5 Premium only

- **v0.9** (Previous)
  - Full code in chat
  - Artifact button on CodeBlock
  - No ArtifactCard component

---

This is a living document. Update as implementation evolves.
