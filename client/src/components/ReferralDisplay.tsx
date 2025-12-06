import React, { useState } from "react";
import { Copy, Check, Trophy, Users } from "lucide-react";

interface ReferralStats {
  referralCode: string | null;
  successfulReferrals: number;
  referralsNeeded: number;
  premiumFromReferrals: boolean;
}

interface ReferralDisplayProps {
  stats: ReferralStats | null;
  baseUrl?: string;
}

export function ReferralDisplay({ stats, baseUrl = window.location.origin }: ReferralDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!stats) {
    return <div className="text-xs text-gray-500">Cargando información de referrals...</div>;
  }

  const referralLink = stats.referralCode ? `${baseUrl}?ref=${stats.referralCode}` : null;
  const progressPercent = (stats.successfulReferrals / stats.referralsNeeded) * 100;
  const remaining = stats.referralsNeeded - stats.successfulReferrals;

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700/50">
      {/* Encabezado */}
      <div className="flex items-center gap-2">
        <Trophy size={18} className="text-purple-600 dark:text-purple-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Sistema de Referrals</h3>
      </div>

      {/* Progreso */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Invitaciones exitosas
          </span>
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
            {stats.successfulReferrals} / {stats.referralsNeeded}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Estado Premium */}
      {stats.premiumFromReferrals ? (
        <div className="flex items-center gap-2 p-2 bg-green-100 dark:bg-green-900/30 rounded border border-green-300 dark:border-green-700">
          <Trophy size={16} className="text-green-600 dark:text-green-400" />
          <span className="text-sm font-semibold text-green-700 dark:text-green-300">
            ¡Premium desbloqueado por referrals!
          </span>
        </div>
      ) : remaining > 0 ? (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Necesitas <span className="font-bold text-purple-600 dark:text-purple-400">{remaining}</span> invitaciones más para obtener premium
        </div>
      ) : null}

      {/* Link de referral */}
      {referralCode && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Users size={14} />
            Tu link personalizado
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-gray-700 dark:text-gray-300"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center gap-2 text-sm font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copiado
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <p>✓ Solo cuentan invitaciones de usuarios registrados correctamente</p>
        <p>✓ Máximo 2 cuentas por IP</p>
        <p>✓ Premium otorgado por 3 días al alcanzar 30 invitaciones</p>
      </div>
    </div>
  );
}
