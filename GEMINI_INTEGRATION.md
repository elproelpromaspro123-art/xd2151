# Google Gemini 2.5 Flash Integration

## Overview
Google Gemini 2.5 Flash has been integrated into the webapp as a new AI model option. It's available on the free tier with support for images and extended thinking (reasoning).

## What Was Implemented

### 1. Model Configuration
Added `gemini-2.5-flash` to `AI_MODELS` in `server/routes.ts`:
- **Model ID**: `gemini-2.5-flash`
- **Name**: Gemini 2.5 Flash
- **Supports Images**: Yes
- **Supports Reasoning**: Yes  
- **Premium Only**: No (Free tier available)
- **Context Window**: 1M+ tokens
- **Output Tokens**: 65,535

### 2. Free Tier Limits
Gemini 2.5 Flash Free Tier (as of Dec 2025):
- **Requests Per Day (RPD)**: 250
- **Requests Per Minute (RPM)**: 10
- **Tokens Per Minute (TPM)**: 250,000
- **Note**: For users with <50 requests/day, considered "unlimited"

### 3. New API Handler: `streamGeminiCompletion()`
Created a dedicated streaming function in `server/routes.ts` that:
- Converts OpenRouter message format to Gemini API format
- Handles image conversion from data URLs to Gemini `inlineData` format
- Supports thinking/reasoning with configurable budgets:
  - Free tier: 5,000 thinking tokens
  - Premium tier: 10,000 thinking tokens
- Streams responses via Server-Sent Events (SSE)
- Processes thinking content separately from main response
- Includes progress tracking

### 4. Dual API Routing
Updated `/api/chat` and `/api/chat/regenerate` endpoints to:
- Detect which API provider to use based on selected model
- Route to `streamGeminiCompletion()` for Gemini models
- Route to `streamChatCompletion()` for OpenRouter models
- Automatically load correct API keys from environment variables

### 5. Environment Variables
Uses `process.env.Gemini` for the Gemini API key (already configured in your environment).

### 6. Supported Features
- **Multimodal Input**: Text, images (PNG, JPEG, WEBP, HEIC, HEIF)
- **Reasoning**: "Extended thinking" for complex tasks
- **Web Search Context**: Compatible with existing web search functionality
- **Chat History**: Full conversation context support
- **Image Analysis**: Built-in vision capabilities

## API Endpoint Changes

### Request Format
The existing `/api/chat` endpoint now supports:
```json
{
  "message": "Your message here",
  "model": "gemini-2.5-flash",
  "useReasoning": true,
  "imageBase64": "data:image/jpeg;base64,...",
  "useWebSearch": true,
  "chatMode": "general"
}
```

### Response Format (SSE)
Same as before:
- `{"content": "text chunk"}`
- `{"reasoning": "thinking chunk"}`
- `{"progress": {"tokensGenerated": N, "estimatedSecondsRemaining": N}}`
- `[DONE]` marker

## Key Technical Details

### 1. Message Format Conversion
OpenRouter format → Gemini format:
```
{
  role: "user" | "model",
  parts: [
    { text: "..." },
    { inlineData: { mimeType: "image/jpeg", data: "base64..." } }
  ]
}
```

### 2. Thinking/Reasoning
- Uses `thinkingBudget` parameter (Gemini 2.5 series)
- Budget is separate from output tokens
- Thinking chunks streamed in real-time
- Summary shown to user in chat UI

### 3. Rate Limiting
The free tier limit of 250 RPD per project means:
- If user hits limit, API returns 429 error
- Error is caught and user receives appropriate message
- Limits reset at midnight Pacific time

## How to Use

### For Users
1. Select "Gemini 2.5 Flash" from model dropdown
2. Optional: Enable "Reasoning" toggle for complex tasks
3. Optional: Upload image for vision analysis
4. Send message normally

### For Developers
The implementation is backwards compatible:
- All existing OpenRouter models continue to work
- Web search integration works with Gemini
- Image handling unified across providers
- Same chat history and context system

## Rate Limit Handling

If user exceeds free tier limits:
- Error message: "Límite de rate alcanzado. Espera un momento e intenta de nuevo."
- Limits reset every 24 hours
- Consider upgrading to Tier 1 (with billing) for higher limits:
  - **Tier 1**: 1,000 RPM, 1M TPM, 10,000 RPD

## Pricing

**Free Tier** (current):
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- Thinking output: $0.30 per 1M tokens (billed based on actual tokens, not budget)

**Premium Tier Equivalent** (Tier 1 with billing):
- Same pricing, but higher limits
- No setup cost, just enable billing in Google Cloud

## Next Steps (Optional Enhancements)

1. **Upgrade Path**: Monitor usage; offer Tier 1 tier for power users
2. **Caching**: Implement context caching for repeated requests (saves costs)
3. **Function Calling**: Add tool support for structured outputs
4. **Vision Advanced**: Use `media_resolution` parameter for detailed image analysis
5. **Batch API**: For non-real-time tasks requiring many requests

## Files Modified
- `server/routes.ts` - Main changes:
  - Added Gemini model config
  - Added `streamGeminiCompletion()` function
  - Updated `/api/chat` endpoint
  - Updated `/api/chat/regenerate` endpoint
  - Added API provider routing logic

## Documentation References
- [Gemini 2.5 Flash Docs](https://ai.google.dev/gemini-api/docs/models)
- [Thinking Guide](https://ai.google.dev/gemini-api/docs/thinking)
- [Image Understanding](https://ai.google.dev/gemini-api/docs/image-understanding)
- [Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
