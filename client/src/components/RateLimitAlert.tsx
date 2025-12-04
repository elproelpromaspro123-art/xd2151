/**
 * Componente para mostrar alertas de rate limit con countdown en tiempo real
 */

import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useRateLimitStream, type RateLimitInfo } from '@/hooks/useRateLimitStream';

interface RateLimitAlertProps {
    modelKey: string;
    modelName: string;
    onAvailable?: () => void;
}

export function RateLimitAlert({ modelKey, modelName, onAvailable }: RateLimitAlertProps) {
    const [displayInfo, setDisplayInfo] = useState<RateLimitInfo | null>(null);
    const { limitInfo, isConnected, error: streamError } = useRateLimitStream({
        modelKey,
        onUpdate: (info) => {
            if (Array.isArray(info)) {
                // Si viene un array, buscar la info de nuestro modelo
                const modelInfo = info.find(i => i.modelKey === modelKey);
                if (modelInfo) {
                    setDisplayInfo(modelInfo);
                    if (modelInfo.available) {
                        onAvailable?.();
                    }
                }
            } else {
                // Info individual
                setDisplayInfo(info);
                if (info.available) {
                    onAvailable?.();
                }
            }
        },
    });

    // Sincronizar con limitInfo del hook
    useEffect(() => {
        if (limitInfo) {
            if (Array.isArray(limitInfo)) {
                const modelInfo = limitInfo.find(i => i.modelKey === modelKey);
                if (modelInfo) {
                    setDisplayInfo(modelInfo);
                }
            } else if (!Array.isArray(limitInfo)) {
                setDisplayInfo(limitInfo);
            }
        }
    }, [limitInfo, modelKey]);

    if (!displayInfo || displayInfo.available) {
        return null;
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-1">
                        {modelName} no disponible
                    </h3>
                    <p className="text-sm text-red-700 mb-2">
                        {displayInfo.reason || 'El modelo ha alcanzado su límite de uso.'}
                    </p>

                    {/* Countdown principal */}
                    <div className="bg-white rounded px-3 py-2 inline-block border border-red-200">
                        <p className="text-sm font-mono font-semibold text-red-800">
                            Se reinicia en: <span className="text-base">{displayInfo.formattedTime}</span>
                        </p>
                    </div>

                    {/* Información detallada de headers si está disponible */}
                    {displayInfo.headers && (
                        <div className="mt-3 text-xs text-red-600 space-y-1 border-t border-red-200 pt-2">
                            {displayInfo.headers.remaining.requests !== undefined && (
                                <p>
                                    Requests restantes: {displayInfo.headers.remaining.requests}
                                </p>
                            )}
                            {displayInfo.headers.remaining.tokens !== undefined && (
                                <p>
                                    Tokens restantes: {displayInfo.headers.remaining.tokens}
                                </p>
                            )}
                            {displayInfo.headers.reset.requests && (
                                <p>
                                    Reset requests: {displayInfo.headers.reset.requests}
                                </p>
                            )}
                            {displayInfo.headers.reset.tokens && (
                                <p>
                                    Reset tokens: {displayInfo.headers.reset.tokens}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Estado de conexión */}
                    {!isConnected && (
                        <p className="text-xs text-amber-600 mt-2">
                            {streamError ? `Conexión: ${streamError}` : 'Reconectando...'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
