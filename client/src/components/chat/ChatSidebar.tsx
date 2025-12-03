import { useState } from "react";
import { Plus, MessageSquare, Trash2, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Conversation } from "@shared/schema";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onDeleteAllConversations: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onDeleteAllConversations,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      onDeleteConversation(conversationToDelete);
      setConversationToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleConfirmDeleteAll = () => {
    onDeleteAllConversations();
    setDeleteAllDialogOpen(false);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden animated-border"
        data-testid="button-toggle-sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-sidebar-border">
          <Button
            onClick={onNewChat}
            className="w-full gap-2 animated-border-strong"
            data-testid="button-new-chat"
          >
            <Plus className="h-4 w-4" />
            Nueva conversación
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay conversaciones aún
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Inicia una nueva conversación para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-1 px-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all animated-border ${
                    currentConversationId === conversation.id
                      ? "bg-sidebar-accent animated-border-strong"
                      : "hover:bg-sidebar-accent/50"
                  }`}
                  data-testid={`conversation-item-${conversation.id}`}
                >
                  <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(conversation.updatedAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteClick(conversation.id, e)}
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`button-delete-conversation-${conversation.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {conversations.length > 0 && (
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={() => setDeleteAllDialogOpen(true)}
              className="w-full gap-2 text-muted-foreground hover:text-destructive animated-border"
              data-testid="button-delete-all-conversations"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar todas
            </Button>
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="animated-border-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar conversación</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La conversación y todos sus mensajes serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent className="animated-border-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar todas las conversaciones</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Todas las conversaciones y sus mensajes serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-all">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-all"
            >
              Eliminar todas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
