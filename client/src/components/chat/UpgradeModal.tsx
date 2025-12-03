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
  weekStartDate: string;
  isPremium?: boolean;
}

interface UpgradeModalProps {
  usage: UsageInfo | null;
  children?: React.ReactNode;
  chatMode?: "roblox" | "general";
}

function getNextResetDate(weekStartDate: string): string {
  const start = new Date(weekStartDate);
  const nextSunday = new Date(start);
  nextSunday.setDate(start.getDate() + 7);
  
  const now = new Date();
  const diff = nextSunday.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} día${days > 1 ? 's' : ''} y ${hours} hora${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hora${hours > 1 ? 's' : ''}`;
}

export function UpgradeModal({ usage, children, chatMode = "roblox" }: UpgradeModalProps) {
  const isPremium = usage?.isPremium || false;
  const aiUsed = usage?.aiUsageCount || 0;
  const aiLimit = usage?.limits.aiUsagePerWeek || 50;
  const webUsed = usage?.webSearchCount || 0;
  const webLimit = usage?.limits.webSearchPerWeek || 5;
  const chatsUsed = usage?.conversationCount || 0;
  const chatsLimit = usage?.limits.maxChats || 5;
  const messagesUsedRoblox = usage?.robloxMessageCount || 0;
  const messagesUsedGeneral = usage?.generalMessageCount || 0;
  
  const resetIn = usage?.weekStartDate ? getNextResetDate(usage.weekStartDate) : "7 días";
  const isUnlimited = aiLimit === -1;

  const [countdown, setCountdown] = useState<string>(resetIn);

  useEffect(() => {
    if (!usage?.weekStartDate) return;
    const update = () => {
      const start = new Date(usage.weekStartDate);
      const target = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      const diff = Math.max(0, target.getTime() - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24) ) / (1000 * 60 * 60));
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
          <Button variant="outline" size="sm" className={`gap-2 animated-border transition-colors ${
            chatMode === 'general'
              ? 'border-indigo-300/30 text-indigo-600 hover:bg-indigo-50'
              : ''
          }`}>
            <Sparkles className="h-4 w-4" />
            {isPremium ? "Premium" : "Mejorar"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[650px] border-border max-h-[90vh] overflow-y-auto transition-colors ${
        chatMode === 'general'
          ? 'bg-gradient-to-b from-white/95 to-indigo-50/40 border-indigo-200/30'
          : 'bg-background'
      }`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 text-xl transition-colors ${
            chatMode === 'general'
              ? 'text-indigo-900'
              : ''
          }`}>
            <Sparkles className={`h-5 w-5 ${chatMode === 'general' ? 'text-indigo-600' : 'text-primary'}`} />
            {chatMode === 'general' ? 'Planes de Asistente Pro' : 'Planes de Roblox UI Designer'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {!isPremium && (
            <div className="mb-6 p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Reinicio en: <strong className="text-foreground">{countdown}</strong>
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      Uso de IA
                    </span>
                    <span className={aiUsed >= aiLimit ? "text-destructive" : "text-muted-foreground"}>
                      {aiUsed} / {aiLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${aiUsed >= aiLimit ? 'bg-destructive' : 'bg-primary'}`}
                      style={{ width: `${Math.min((aiUsed / aiLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-blue-500" />
                      Búsquedas web
                    </span>
                    <span className={webUsed >= webLimit ? "text-destructive" : "text-muted-foreground"}>
                      {webUsed} / {webLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${webUsed >= webLimit ? 'bg-destructive' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min((webUsed / webLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-green-500" />
                      Chats guardados
                    </span>
                    <span className={chatsUsed >= chatsLimit ? "text-destructive" : "text-muted-foreground"}>
                      {chatsUsed} / {chatsLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${chatsUsed >= chatsLimit ? 'bg-destructive' : 'bg-green-500'}`}
                      style={{ width: `${Math.min((chatsUsed / chatsLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="mt-3 border-t pt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1.5">
                      <Gamepad2 className="h-3.5 w-3.5 text-violet-500" />
                      Mensajes (Roblox)
                    </span>
                    <span className={messagesUsedRoblox >= (usage?.messageLimits?.roblox ?? 20) ? "text-destructive" : "text-muted-foreground"}>
                      {messagesUsedRoblox} / {(usage?.messageLimits?.roblox ?? 20)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5 text-cyan-500" />
                      Mensajes (General)
                    </span>
                    <span className={messagesUsedGeneral >= (usage?.messageLimits?.general ?? 30) ? "text-destructive" : "text-muted-foreground"}>
                      {messagesUsedGeneral} / {(usage?.messageLimits?.general ?? 30)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isPremium && (
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <span className="font-semibold text-foreground">Tienes Premium activo</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Disfruta de uso ilimitado, Grok 4.1 Fast con imágenes y reasoning.
              </p>
            </div>
          )}
          
          <div className="grid gap-4 md:grid-cols-2">
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
                  <span>50 usos de IA por semana</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>5 búsquedas web por semana</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Máximo 5 chats guardados</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Modelo KAT-Coder Pro (solo texto)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Modelo DeepSeek R1T2 (Programación)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Reinicio de límites cada domingo</span>
                </li>
              </ul>
            </div>
            
            <div className={`relative p-5 rounded-xl border-2 ${isPremium ? 'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/20' : 'border-border bg-card'}`}>
              <div className={`absolute -top-3 left-4 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded flex items-center gap-1`}>
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
                  <span>Uso ilimitado de IA</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Búsquedas web ilimitadas</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Chats ilimitados</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span>Grok 4.1 Fast</span>
                      <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-500 rounded text-[10px] font-medium">REASONING</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Texto, imágenes y razonamiento</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span>Gemini 2.0 Flash Exp</span>
                      <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-500 rounded text-[10px] font-medium">NUEVO</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Texto e imágenes, modelo experimental</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span>Amazon Nova 2 Lite</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Texto e imágenes, uso general</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Brain className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Modo Reasoning "Grandes Ligas"</span>
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
