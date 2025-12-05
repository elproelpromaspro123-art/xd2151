import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, Crown, Zap, MessageSquare, Globe, Clock, Image, Brain, Gamepad2, MessageCircle } from "lucide-react";

interface UsageInfo {
  aiUsageCount: number;
  webSearchCount: number;
  conversationCount: number;
  limits: {
    aiUsagePerWeek: number;
    webSearchPerWeek: number;
    maxChats: number;
  };
  messageLimits?: {
    roblox: number;
    general: number;
  };
  weekStartDate: string;
  isPremium?: boolean;
  robloxMessageCount?: number;
  generalMessageCount?: number;
}

interface UpgradeModalProps {
  usage: UsageInfo | null;
  children?: React.ReactNode;
  chatMode?: "roblox" | "general";
}

export function UpgradeModal({ usage, children, chatMode = "roblox" }: UpgradeModalProps) {
  const isPremium = usage?.isPremium || false;
  const webUsed = usage?.webSearchCount || 0;
  const webLimit = 5;
  const messagesUsedRoblox = usage?.robloxMessageCount || 0;
  const messagesUsedGeneral = usage?.generalMessageCount || 0;
  const robloxLimit = 10;
  const generalLimit = 10;

  const [countdown, setCountdown] = useState<string>("7d 0h 0m 0s");

  useEffect(() => {
    if (!usage?.weekStartDate) return;
    
    const update = () => {
      const start = new Date(usage.weekStartDate);
      const target = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      const diff = Math.max(0, target.getTime() - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };
    
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [usage?.weekStartDate]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            {isPremium ? "Premium" : "Mejorar"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] border-border max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Planes Disponibles
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {/* Usage section for free users */}
          {!isPremium && (
            <div className="mb-6 p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Reinicio en: <strong className="text-foreground font-mono">{countdown}</strong>
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Roblox messages */}
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="flex items-center gap-1.5">
                      <Gamepad2 className="h-3.5 w-3.5 text-violet-500" />
                      Mensajes Roblox
                    </span>
                    <span className={messagesUsedRoblox >= robloxLimit ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {messagesUsedRoblox}/{robloxLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${messagesUsedRoblox >= robloxLimit ? 'bg-destructive' : 'bg-violet-500'}`}
                      style={{ width: `${Math.min((messagesUsedRoblox / robloxLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* General messages */}
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5 text-blue-500" />
                      Mensajes General
                    </span>
                    <span className={messagesUsedGeneral >= generalLimit ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {messagesUsedGeneral}/{generalLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${messagesUsedGeneral >= generalLimit ? 'bg-destructive' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min((messagesUsedGeneral / generalLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Web searches */}
                <div className="p-3 rounded-lg bg-muted/30 col-span-2">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-emerald-500" />
                      Búsquedas Web
                    </span>
                    <span className={webUsed >= webLimit ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {webUsed}/{webLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${webUsed >= webLimit ? 'bg-destructive' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min((webUsed / webLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Premium active notice */}
          {isPremium && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <span className="font-semibold">¡Tienes Premium activo!</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Disfruta de uso ilimitado con todos los modelos premium.
              </p>
            </div>
          )}
          
          {/* Plans grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Free Plan */}
            <div className={`relative p-5 rounded-xl border-2 ${!isPremium ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
              {!isPremium && (
                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                  ACTUAL
                </div>
              )}
              <h3 className="text-lg font-semibold mb-1">Plan Gratis</h3>
              <p className="text-2xl font-bold mb-4">$0<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
              
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>10 mensajes/semana (Roblox)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>10 mensajes/semana (General)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>5 búsquedas web por semana</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span>Qwen 3 Coder</span>
                    </div>
                    <span className="text-xs text-muted-foreground">90% capacidad (235K contexto)</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span>Llama 3.3 70B</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Rápido y multilingüe (128K contexto)</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Reset cada 24 horas</span>
                </li>
              </ul>
            </div>
            
            {/* Premium Plan */}
            <div className={`relative p-5 rounded-xl border-2 ${isPremium ? 'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/20' : 'border-border bg-card'}`}>
              <div className="absolute -top-3 left-4 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded flex items-center gap-1">
                <Crown className="h-3 w-3" />
                {isPremium ? 'ACTIVO' : 'PREMIUM'}
              </div>
              <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                Plan Premium
                <Crown className="h-4 w-4 text-yellow-500" />
              </h3>
              <p className="text-2xl font-bold mb-4">
                <span className="text-amber-500">Próximamente</span>
              </p>
              
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Mensajes ilimitados</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Búsquedas web ilimitadas</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span>⭐ Gemini 2.5 Pro</span>
                      <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded text-[9px] font-medium">IMG</span>
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-500 rounded text-[9px] font-medium">R1</span>
                    </div>
                    <span className="text-xs text-muted-foreground">95% capacidad (995K contexto + 62K salida)</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span>✨ Gemini 2.5 Flash</span>
                      <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded text-[9px] font-medium">IMG</span>
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-500 rounded text-[9px] font-medium">R1</span>
                    </div>
                    <span className="text-xs text-muted-foreground">95% capacidad (995K contexto + 62K salida)</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span>GPT OSS 120B</span>
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-500 rounded text-[9px] font-medium">R1</span>
                    </div>
                    <span className="text-xs text-muted-foreground">95% capacidad (124K contexto + output)</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span>Qwen 3 32B</span>
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-500 rounded text-[9px] font-medium">R1</span>
                    </div>
                    <span className="text-xs text-muted-foreground">95% capacidad (124K contexto + output)</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>DeepSeek R1T2, Gemma 3 27B y otros</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Reset cada 24 horas</span>
                </li>
              </ul>
              
              {!isPremium && (
                <Button disabled className="w-full mt-4" variant="secondary">
                  Próximamente
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
