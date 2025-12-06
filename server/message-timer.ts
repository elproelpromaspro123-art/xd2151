const userMessageResets = new Map<string, { nextResetTime: number }>();

export function getMessageResetInfo(userId: string): {
  nextResetTime: number;
  hasReset: boolean;
  hoursUntilReset: number;
} | null {
  const now = Date.now();
  const resetData = userMessageResets.get(userId) || {
    nextResetTime: now + 3 * 24 * 60 * 60 * 1000, // 3 days
  };

  userMessageResets.set(userId, resetData);

  const hasReset = now >= resetData.nextResetTime;
  const hoursUntilReset = Math.max(
    0,
    Math.ceil((resetData.nextResetTime - now) / (60 * 60 * 1000))
  );

  return {
    nextResetTime: resetData.nextResetTime,
    hasReset,
    hoursUntilReset,
  };
}
