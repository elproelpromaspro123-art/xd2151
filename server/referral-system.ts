const userReferrals = new Map<string, { code: string; referredCount: number; totalRewards: number }>();

export function getReferralStats(userId: string): {
  referralCode: string;
  referredCount: number;
  totalRewards: number;
} {
  const stats = userReferrals.get(userId) || {
    code: generateReferralCode(userId),
    referredCount: 0,
    totalRewards: 0,
  };

  userReferrals.set(userId, stats);

  return {
    referralCode: stats.code,
    referredCount: stats.referredCount,
    totalRewards: stats.totalRewards,
  };
}

function generateReferralCode(userId: string): string {
  return `REF_${userId.slice(0, 8).toUpperCase()}`;
}
