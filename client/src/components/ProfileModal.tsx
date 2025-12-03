import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, Loader2, Moon, Sun, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/lib/auth";
import type { User as UserType } from "@/lib/auth";

interface ProfileModalProps {
  user: UserType;
  children: React.ReactNode;
  onUserUpdate?: (user: UserType) => void;
}

function getActualTheme(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("theme");
  if (stored === "light") return false;
  if (stored === "dark") return true;
  return document.documentElement.classList.contains("dark");
}

export function ProfileModal({ user, children, onUserUpdate }: ProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(getActualTheme);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setIsDarkMode(getActualTheme());
    }
  }, [open]);

  const handleThemeChange = (dark: boolean) => {
    setIsDarkMode(dark);
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new CustomEvent("themechange", { detail: { dark } }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = getToken();
    if (!token) {
      toast({
        title: "Sesión expirada",
        description: "Por favor, inicia sesión nuevamente",
        variant: "destructive",
      });
      setOpen(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al cambiar contraseña");
      }

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mi Cuenta
          </DialogTitle>
          <DialogDescription className="sr-only">
            Gestiona tu perfil, cambia tu contraseña y configura el tema de la aplicación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Correo electrónico</Label>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm">{user.email}</span>
              {user.isEmailVerified && (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <Check className="h-3 w-3" />
                  Verificado
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Estado de la cuenta</Label>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              {user.isPremium ? (
                <span className="flex items-center gap-2 text-sm text-amber-500 font-medium">
                  <span className="px-2 py-0.5 bg-amber-500/10 rounded">Premium</span>
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Plan Gratuito</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-primary" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
              <Label htmlFor="theme-toggle" className="text-sm cursor-pointer">
                Modo {isDarkMode ? "Oscuro" : "Claro"}
              </Label>
            </div>
            <Switch
              id="theme-toggle"
              checked={isDarkMode}
              onCheckedChange={handleThemeChange}
            />
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Cambiar Contraseña
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="currentPassword" className="text-xs text-muted-foreground">
                  Contraseña actual
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="newPassword" className="text-xs text-muted-foreground">
                  Nueva contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmNewPassword" className="text-xs text-muted-foreground">
                  Confirmar nueva contraseña
                </Label>
                <Input
                  id="confirmNewPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !currentPassword || !newPassword || !confirmNewPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cambiando...
                  </>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
