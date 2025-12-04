# Gemini 2.5 Flash - Quick Reference Card

## Model Details
| Property | Value |
|----------|-------|
| **Model ID** | gemini-2.5-flash |
| **Display Name** | Gemini 2.5 Flash |
| **Provider** | Google |
| **API Endpoint** | generativelanguage.googleapis.com/v1beta/models |
| **Environment Variable** | `process.env.Gemini` |
| **Already Configured** | ✓ Yes |

## Capabilities
| Feature | Supported | Notes |
|---------|-----------|-------|
| **Text Chat** | ✓ | Full conversation support |
| **Image Analysis** | ✓ | PNG, JPEG, WEBP, HEIC, HEIF |
| **Extended Thinking** | ✓ | Reasoning mode for complex tasks |
| **Web Search** | ✓ | Compatible with existing feature |
| **Chat History** | ✓ | Full context preservation |
| **Streaming** | ✓ | Server-sent events (SSE) |
| **Image Generation** | ✗ | Analysis only, not generation |
| **Function Calling** | ✗ | Not yet implemented |

## Free Tier Limits
```
Requests Per Day:    250
Requests Per Min:     10
Tokens Per Min:   250,000
Context Tokens:   1,048,576 (1M)
Output Tokens:       65,535
```

## Thinking Budget
```
Free User:     5,000 tokens
Premium User: 10,000 tokens
```

## Image Support
```
Formats:  PNG, JPEG, WEBP, HEIC, HEIF
Max Size: 7 MB
Max Per Request: 3,000 (current: 1)
```

## API Request Format

### Basic Chat
```json
{
  "message": "Your message",
  "model": "gemini-2.5-flash",
  "chatMode": "general"
}
```

### With Image
```json
{
  "message": "Analyze this",
  "model": "gemini-2.5-flash",
  "imageBase64": "data:image/jpeg;base64,..."
}
```

### With Reasoning
```json
{
  "message": "Complex problem",
  "model": "gemini-2.5-flash",
  "useReasoning": true
}
```

### With Web Search
```json
{
  "message": "Latest news",
  "model": "gemini-2.5-flash",
  "useWebSearch": true
}
```

## Response Format (SSE)
```
data: {"content":"text chunk"}
data: {"reasoning":"thinking chunk"}
data: {"progress":{"tokensGenerated":N,"estimatedSecondsRemaining":N}}
data: [DONE]
```

## Error Codes
| Code | Message | Solution |
|------|---------|----------|
| **429** | Rate limit exceeded | Wait 24h or upgrade tier |
| **401/403** | Auth error | Check API key |
| **503** | Service unavailable | Retry later |
| **400** | Invalid request | Check format |

## Key Endpoints
```
POST /api/chat           → New message
POST /api/chat/regenerate → Regenerate response
POST /api/chat/stop      → Cancel generation
GET  /api/models         → List all models (includes Gemini)
```

## TypeScript Types
```typescript
type ModelKey = "gemini-2.5-flash" | "qwen-coder" | ...

interface AIModel {
  id: string
  name: string
  supportsImages: boolean
  supportsReasoning: boolean
  apiProvider: "gemini" | "openrouter"
  // ...
}
```

## Code Integration Points

### In Chat Handler:
```typescript
if (modelInfo.apiProvider === "gemini") {
  await streamGeminiCompletion(res, ...)
} else {
  await streamChatCompletion(res, ...)
}
```

### Model Detection:
```typescript
const modelInfo = AI_MODELS[selectedModel]
const isGeminiModel = modelInfo.apiProvider === "gemini"
```

## Pricing (Free Tier)
```
Input:   $0.075 per 1M tokens
Output:  $0.30 per 1M tokens
Thinking: $0.30 per 1M tokens
```

## Performance Tips
✓ Keep images < 7MB
✓ Use reasoning only for complex tasks
✓ Monitor token usage
✓ Compress images if needed
✓ Cache repeated requests (future)

## Testing Checklist
```
□ Basic text chat
□ Image analysis
□ Reasoning mode
□ Web search integration
□ Model switching
□ Error handling
□ Rate limit behavior
```

## Common Scenarios

### Scenario 1: Simple Q&A
```
useReasoning: false
useWebSearch: false
Expected: Fast response
```

### Scenario 2: Complex Problem
```
useReasoning: true
useWebSearch: false
Expected: Detailed thinking + answer
```

### Scenario 3: Current Information
```
useReasoning: false
useWebSearch: true
Expected: Recent data in response
```

### Scenario 4: Image Analysis
```
imageBase64: "<data-url>"
model: "gemini-2.5-flash"
Expected: Image understanding
```

## Files Affected
```
server/routes.ts
├── AI_MODELS configuration (lines 49-119)
├── streamGeminiCompletion() (lines 316-553)
├── /api/chat handler (lines 1411-1523)
└── /api/chat/regenerate (lines 1528-1628)
```

## Documentation
| File | Purpose |
|------|---------|
| GEMINI_INTEGRATION.md | Technical details |
| GEMINI_SETUP_CHECKLIST.md | Deployment steps |
| GEMINI_EXAMPLES.md | Code samples |
| GEMINI_SUMMARY.txt | Overview |
| GEMINI_QUICK_REFERENCE.md | This file |

## Environment Variables
```bash
# Must be set:
Gemini=<your-api-key>

# Already configured:
OPENROUTER_API_KEY=<existing-key>
```

## Upgrade Path
```
Free Tier (current):
  250 RPD, 10 RPM, 250k TPM

Tier 1 (with billing):
  10k RPD, 1k RPM, 1M TPM

Enable in Google Cloud:
  → Project Settings
  → Billing Account
  → No cost unless used
```

## Monitoring Metrics
- Daily API calls (vs 250 limit)
- Average tokens per request
- Error rate (429s indicate limit)
- Response latency
- Thinking usage if enabled

## Troubleshooting

**Issue: "Rate limit exceeded"**
→ Check daily call count
→ Wait for midnight PT reset
→ Consider Tier 1 upgrade

**Issue: Image not processed**
→ Verify format (PNG, JPEG, etc.)
→ Check file size < 7MB
→ Validate base64 encoding

**Issue: Thinking not working**
→ Ensure useReasoning: true
→ Check reasoning toggle in UI
→ Verify no syntax errors

**Issue: API key error**
→ Verify Gemini env variable set
→ Check key validity in Google AI Studio
→ Confirm project has API enabled

## Links
- Docs: https://ai.google.dev/gemini-api/docs
- Models: https://ai.google.dev/gemini-api/docs/models
- Status: https://status.cloud.google.com
- Studio: https://aistudio.google.com

---
**Quick Ref v1.0** | Updated Dec 4, 2025 | Ready for deployment
