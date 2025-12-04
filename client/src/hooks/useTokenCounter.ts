import { useState, useCallback, useMemo, useRef } from "react";

interface TokenCounterState {
  totalTokensUsed: number;
  estimatedMaxTokens: number;
  contextPercentage: number;
  tokensInCurrentSession: number;
  estimatedCostUSD: number;
  warningLevel: "safe" | "warning" | "critical";
  modelTokenLimit: number;
  isApproachingLimit: boolean;
}

interface TokenEstimate {
  characters: number;
  estimatedTokens: number;
  costUSD: number;
}

// Estimación aproximada: 1 token ≈ 4 caracteres en inglés
const CHAR_TO_TOKEN_RATIO = 0.25;
const TOKEN_COST_PER_1K = 0.002; // Costo promedio por 1000 tokens

export function useTokenCounter(selectedModel?: string) {
  const [tokenState, setTokenState] = useState<TokenCounterState>({
    totalTokensUsed: 0,
    estimatedMaxTokens: 200000,
    contextPercentage: 0,
    tokensInCurrentSession: 0,
    estimatedCostUSD: 0,
    warningLevel: "safe",
    modelTokenLimit: 200000,
    isApproachingLimit: false,
  });

  const conversationHistoryRef = useRef<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  // Mapeo de límites de tokens por modelo
  const modelLimits: Record<string, number> = {
    "gpt-4-turbo": 128000,
    "gpt-4": 8192,
    "claude-3-opus": 200000,
    "claude-3-sonnet": 200000,
    "qwen-coder": 32768,
    "qwen-max": 30000,
    "gemini-2.0-flash": 1000000,
    "groq-mixtral": 32768,
    "mistral-large": 32768,
    default: 32768,
  };

  // Estimar tokens basado en caracteres
  const estimateTokens = useCallback((text: string): number => {
    return Math.ceil(text.length * CHAR_TO_TOKEN_RATIO);
  }, []);

  // Calcular costo estimado
  const calculateCost = useCallback((tokens: number): number => {
    return (tokens / 1000) * TOKEN_COST_PER_1K;
  }, []);

  // Agregar mensaje a historial
  const addMessage = useCallback(
    (role: "user" | "assistant", content: string) => {
      conversationHistoryRef.current.push({ role, content });

      const messageTokens = estimateTokens(content);
      const totalSessionTokens = conversationHistoryRef.current.reduce(
        (sum, msg) => sum + estimateTokens(msg.content),
        0
      );

      const modelLimit =
        selectedModel && modelLimits[selectedModel]
          ? modelLimits[selectedModel]
          : modelLimits.default;

      const contextPercentage = (totalSessionTokens / modelLimit) * 100;
      const warningLevel: "safe" | "warning" | "critical" =
        contextPercentage < 60
          ? "safe"
          : contextPercentage < 85
            ? "warning"
            : "critical";

      const estimatedCost = calculateCost(totalSessionTokens);

      setTokenState({
        totalTokensUsed: totalSessionTokens,
        estimatedMaxTokens: modelLimit,
        contextPercentage: Math.min(contextPercentage, 100),
        tokensInCurrentSession: totalSessionTokens,
        estimatedCostUSD: estimatedCost,
        warningLevel,
        modelTokenLimit: modelLimit,
        isApproachingLimit: contextPercentage > 80,
      });
    },
    [estimateTokens, calculateCost, selectedModel]
  );

  // Estimar tokens para un texto sin agregar
  const estimateTextTokens = useCallback(
    (text: string): TokenEstimate => {
      const tokens = estimateTokens(text);
      return {
        characters: text.length,
        estimatedTokens: tokens,
        costUSD: calculateCost(tokens),
      };
    },
    [estimateTokens, calculateCost]
  );

  // Limpiar sesión
  const clearSession = useCallback(() => {
    conversationHistoryRef.current = [];
    setTokenState({
      totalTokensUsed: 0,
      estimatedMaxTokens: modelLimits.default,
      contextPercentage: 0,
      tokensInCurrentSession: 0,
      estimatedCostUSD: 0,
      warningLevel: "safe",
      modelTokenLimit: modelLimits.default,
      isApproachingLimit: false,
    });
  }, []);

  // Obtener historial formateado para contexto
  const getContextFormattedHistory = useCallback(() => {
    return conversationHistoryRef.current
      .map((msg) => `[${msg.role.toUpperCase()}]\n${msg.content}`)
      .join("\n\n---\n\n");
  }, []);

  // Crear punto de guardado del contexto
  const createContextCheckpoint = useCallback(() => {
    return {
      timestamp: new Date().toISOString(),
      tokenCount: tokenState.tokensInCurrentSession,
      messageCount: conversationHistoryRef.current.length,
      history: JSON.parse(JSON.stringify(conversationHistoryRef.current)),
    };
  }, [tokenState.tokensInCurrentSession]);

  // Restaurar desde checkpoint
  const restoreFromCheckpoint = useCallback((checkpoint: any) => {
    conversationHistoryRef.current = checkpoint.history || [];
    // Recalcular estado
    const totalSessionTokens = conversationHistoryRef.current.reduce(
      (sum, msg) => sum + estimateTokens(msg.content),
      0
    );
    setTokenState((prev) => ({
      ...prev,
      tokensInCurrentSession: totalSessionTokens,
      contextPercentage: (totalSessionTokens / prev.modelTokenLimit) * 100,
    }));
  }, [estimateTokens]);

  return {
    state: tokenState,
    addMessage,
    estimateTextTokens,
    clearSession,
    getContextFormattedHistory,
    createContextCheckpoint,
    restoreFromCheckpoint,
    conversationHistory: conversationHistoryRef.current,
  };
}
