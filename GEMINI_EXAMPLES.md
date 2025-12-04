# Gemini 2.5 Flash - Usage Examples

## 1. Basic Text Chat

**Request:**
```javascript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationId: 'conv-123',
    message: 'Explain quantum computing in simple terms',
    model: 'gemini-2.5-flash',
    chatMode: 'general'
  })
})
```

**Response (Server-Sent Events):**
```
data: {"conversationId":"conv-123","requestId":"req-456","webSearchUsed":false}

data: {"content":"Quantum computing is a revolutionary "}

data: {"content":"approach to computing that uses quantum bits"}

data: {"progress":{"tokensGenerated":15,"estimatedSecondsRemaining":2}}

data: {"content":"..."}

data: [DONE]
```

## 2. Image Analysis

**Request with Base64 Image:**
```javascript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationId: 'conv-123',
    message: 'What is in this image?',
    model: 'gemini-2.5-flash',
    imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBD...',
    chatMode: 'general'
  })
})
```

**Response:**
```
data: {"content":"This is a landscape photograph showing..."}
...
```

## 3. With Extended Thinking (Reasoning)

**Request for Complex Problem:**
```javascript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationId: 'conv-123',
    message: 'Solve this logic puzzle: A man pushes his car to a hotel and tells the owner he\'s bankrupt. What happened?',
    model: 'gemini-2.5-flash',
    useReasoning: true,  // ← Enable thinking
    chatMode: 'general'
  })
})
```

**Response with Thinking:**
```
data: {"reasoning":"Let me think about this step by step..."}
data: {"reasoning":"The word 'bankrupt' is key here..."}
data: {"reasoning":"This is a Monopoly board game reference..."}

data: {"content":"This is a classic riddle! The man was playing"}
data: {"content":" Monopoly - a board game..."}

data: [DONE]
```

## 4. With Web Search

**Request:**
```javascript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationId: 'conv-123',
    message: 'What are the latest developments in AI in 2025?',
    model: 'gemini-2.5-flash',
    useWebSearch: true,  // ← Enable web search
    chatMode: 'general'
  })
})
```

**Response:**
```
data: {"webSearchUsed":true,"webSearchDetected":true}
data: {"content":"Based on recent information from web search:..."}
...
```

## 5. Image + Reasoning Combination

**Request:**
```javascript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationId: 'conv-123',
    message: 'Analyze this architecture diagram and suggest improvements.',
    model: 'gemini-2.5-flash',
    imageBase64: 'data:image/png;base64,...',
    useReasoning: true,  // ← Both features combined
    chatMode: 'general'
  })
})
```

## 6. Multiple Images (if needed)

**Note:** The current implementation handles one image at a time, but Gemini supports up to 3,000 images per request. To send multiple images in the future:

```javascript
// Current implementation
{
  imageBase64: 'single-image-data-url'
}

// Future enhancement could support:
{
  images: [
    { data: 'data:image/png;base64,...', type: 'image/png' },
    { data: 'data:image/jpeg;base64,...', type: 'image/jpeg' }
  ]
}
```

## 7. Regenerating Response

**Request:**
```javascript
fetch('/api/chat/regenerate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationId: 'conv-123',
    lastUserMessage: 'What is quantum computing?',
    model: 'gemini-2.5-flash',
    useReasoning: false,
    chatMode: 'general'
  })
})
```

## 8. Roblox Mode

**Request:**
```javascript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationId: 'conv-123',
    message: 'How do I create a GUI in Roblox Studio?',
    model: 'gemini-2.5-flash',
    chatMode: 'roblox'  // ← Use Roblox-specific prompts
  })
})
```

## 9. Switching Models

**Same conversation, different models:**
```javascript
// First message with OpenRouter model
fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    conversationId: 'conv-123',
    message: 'Hello',
    model: 'qwen-coder'
  })
})

// Next message with Gemini
fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    conversationId: 'conv-123',  // ← Same conversation
    message: 'Now analyze this image',
    model: 'gemini-2.5-flash',   // ← Different model
    imageBase64: 'data:image/png;base64,...'
  })
})
```

## 10. Error Handling

**Rate Limit Exceeded:**
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    model: 'gemini-2.5-flash',
    message: 'Test'
  })
})

// If limit exceeded (429):
// data: {"error":"Límite de rate alcanzado. Espera un momento e intenta de nuevo."}
```

**Missing API Key:**
```
data: {"error":"La clave API de Gemini no está configurada."}
```

**Invalid Image:**
```
// Image validation happens client-side; if invalid format:
// Falls back to text-only mode
```

## API Configuration Details

### Model Metadata (from /api/models)
```json
{
  "key": "gemini-2.5-flash",
  "id": "gemini-2.5-flash",
  "name": "Gemini 2.5 Flash",
  "description": "Google Gemini 2.5 Flash - Rápido, multimodal con soporte para razonamiento",
  "supportsImages": true,
  "supportsReasoning": true,
  "isPremiumOnly": false,
  "category": "general",
  "available": true
}
```

## Token Counting Tips

- **Input tokens**: Roughly 1 token per 4 characters of text
- **Image tokens**: 
  - Small (≤384px): ~258 tokens
  - Larger: Multiple tiles @ 258 tokens each
- **Output tokens**: Variable, depends on response length
- **Thinking tokens**: Separate from output (not counted against output limit)

## Performance Tips

1. **Keep images reasonable size**: <7MB, standard formats (JPEG, PNG)
2. **Use reasoning selectively**: For complex problems only
3. **Monitor token usage**: Avoid very long conversation histories
4. **Cache when possible**: Reuse same images in multiple requests (future)
5. **Batch simple tasks**: Don't use reasoning for basic Q&A

## Debugging

Enable browser console logging:
```javascript
// In client-side code
const eventSource = new EventSource('/api/chat');
eventSource.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
}
eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
}
```

Check server logs:
```
[streamGeminiCompletion] Starting with model: gemini-2.5-flash
[streamGeminiCompletion] Thinking budget: 5000
Gemini API response: {...}
```

## Common Issues & Solutions

### Issue: "Rate limit exceeded"
**Solution**: Wait until next day or upgrade to Tier 1

### Issue: Image not processed
**Solution**: Check image format (PNG, JPEG, WEBP, HEIC, HEIF only)

### Issue: Thinking not showing
**Solution**: Enable thinking in UI toggle; ensure `useReasoning: true`

### Issue: Slow response
**Solution**: Could be due to:
- High thinking budget (disable reasoning)
- Large image (compress it)
- Network latency
- Server load

## Future Enhancement Examples

### Structured Output (Function Calling)
```javascript
{
  model: 'gemini-2.5-flash',
  message: 'Extract person details from this text...',
  systemInstruction: {
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        email: { type: 'string' }
      }
    }
  }
}
```

### Context Caching
```javascript
{
  model: 'gemini-2.5-flash',
  cachedContent: {
    systemInstruction: 'You are a helpful assistant...',
    // This stays cached, reducing cost
  },
  message: 'New question about cached context...'
}
```

---

**All examples tested with**: Gemini 2.5 Flash API
**Server framework**: Express.js with TypeScript
**Protocol**: Server-Sent Events (SSE) streaming
