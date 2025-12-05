import { useState } from "react";
import { Plus, MessageSquare, Trash2, X, Menu, ChevronLeft, MoreHorizontal, Edit3 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  chatMode?: "roblox" | "general";
  isCollapsed?: boolean;
  onCollapseToggle?: () => void;
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
  chatMode = "roblox",
  isCollapsed = false,
  onCollapseToggle,
}: ChatSidebarProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [conversationToRename, setConversationToRename] = useState<Conversation | null>(null);
  const [newTitle, setNewTitle] = useState("");

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

  const handleRenameClick = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToRename(conversation);
    setNewTitle(conversation.title);
    setRenameDialogOpen(true);
  };

  const handleConfirmRename = async () => {
    if (!conversationToRename || !newTitle.trim()) return;

    try {
      await fetch(`/api/conversations/${conversationToRename.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      // Refresh conversations
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error("Error renaming conversation:", error);
    }

    setRenameDialogOpen(false);
    setConversationToRename(null);
    setNewTitle("");
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const groupConversationsByDate = (convos: Conversation[]) => {
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const thisWeek: Conversation[] = [];
    const older: Conversation[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    convos.forEach(convo => {
      const date = new Date(convo.updatedAt);
      if (date >= todayStart) {
        today.push(convo);
      } else if (date >= yesterdayStart) {
        yesterday.push(convo);
      } else if (date >= weekStart) {
        thisWeek.push(convo);
      } else {
        older.push(convo);
      }
    });

    return { today, yesterday, thisWeek, older };
  };

  const grouped = groupConversationsByDate(conversations);

  const renderConversationGroup = (title: string, convos: Conversation[]) => {
    if (convos.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${
          chatMode === "general" ? "text-slate-400" : "text-zinc-500"
        }`}>
          {title}
        </h3>
        <div className="space-y-0.5">
          {convos.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`group flex items-center gap-2 px-3 py-2 mx-1 rounded-lg cursor-pointer transition-all duration-150 ${
                currentConversationId === conversation.id
                  ? chatMode === "general"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-primary/20 text-white"
                  : chatMode === "general"
                    ? "text-slate-700 hover:bg-slate-100"
                    : "text-zinc-300 hover:bg-zinc-800/60"
              }`}
            >
              <MessageSquare className={`h-4 w-4 flex-shrink-0 ${
                currentConversationId === conversation.id
                  ? chatMode === "general" ? "text-blue-600" : "text-primary"
                  : chatMode === "general" ? "text-slate-400" : "text-zinc-500"
              }`} />
              <span className="flex-1 truncate text-sm font-medium">
                {conversation.title}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ${
                      chatMode === "general" 
                        ? "text-slate-400 hover:text-slate-600" 
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameClick(conversation, e as any);
                    }}
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-2" />
                    Editar nombre
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(conversation.id, e as any);
                    }}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Collapsed sidebar
  if (isCollapsed) {
    return (
      <div className={`hidden lg:flex flex-col h-full w-16 border-r transition-all duration-300 ${
        chatMode === "general"
          ? "bg-background/80 border-border/60"
          : "bg-zinc-900 border-zinc-800/50"
      }`}>
        <div className="p-2 flex flex-col items-center gap-2">
          <Button
            onClick={onNewChat}
            size="icon"
            className={`h-10 w-10 rounded-xl ${
              chatMode === "general"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {conversations.slice(0, 10).map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`mx-2 mb-1 p-2 rounded-lg cursor-pointer transition-colors ${
                currentConversationId === conversation.id
                  ? chatMode === "general"
                    ? "bg-blue-100"
                    : "bg-primary/20"
                  : chatMode === "general"
                    ? "hover:bg-slate-100"
                    : "hover:bg-zinc-800/60"
              }`}
              title={conversation.title}
            >
              <MessageSquare className={`h-5 w-5 mx-auto ${
                currentConversationId === conversation.id
                  ? chatMode === "general" ? "text-blue-600" : "text-primary"
                  : chatMode === "general" ? "text-slate-400" : "text-zinc-500"
              }`} />
            </div>
          ))}
        </div>

        <div className="p-2 flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapseToggle}
            className={`h-10 w-10 ${
              chatMode === "general" ? "text-slate-500 hover:text-slate-700" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <ChevronLeft className="h-5 w-5 rotate-180" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={`fixed top-3 left-3 z-50 lg:hidden h-10 w-10 rounded-xl shadow-lg ${
          chatMode === "general"
            ? "bg-white text-slate-700 border border-slate-200"
            : "bg-zinc-800 text-zinc-300 border border-zinc-700"
        }`}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            chatMode === "general"
              ? "bg-background/95 backdrop-blur-xl border-r border-border/60"
              : "bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800/50"
          }`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${
          chatMode === "general" ? "border-slate-200/60" : "border-zinc-800/50"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-semibold ${
              chatMode === "general" ? "text-slate-900" : "text-white"
            }`}>
              Conversaciones
            </h2>
            {onCollapseToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCollapseToggle}
                className={`hidden lg:flex h-7 w-7 ${
                  chatMode === "general" ? "text-slate-500 hover:text-slate-700" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            onClick={onNewChat}
            className={`w-full gap-2 h-10 rounded-xl font-medium ${
              chatMode === "general"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            <Plus className="h-4 w-4" />
            Nueva conversación
          </Button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                chatMode === "general" ? "bg-slate-100" : "bg-zinc-800"
              }`}>
                <MessageSquare className={`h-6 w-6 ${
                  chatMode === "general" ? "text-slate-400" : "text-zinc-500"
                }`} />
              </div>
              <p className={`text-sm font-medium mb-1 ${
                chatMode === "general" ? "text-slate-700" : "text-zinc-300"
              }`}>
                Sin conversaciones
              </p>
              <p className={`text-xs ${
                chatMode === "general" ? "text-slate-500" : "text-zinc-500"
              }`}>
                Inicia una nueva para comenzar
              </p>
            </div>
          ) : (
            <>
              {renderConversationGroup("Hoy", grouped.today)}
              {renderConversationGroup("Ayer", grouped.yesterday)}
              {renderConversationGroup("Esta semana", grouped.thisWeek)}
              {renderConversationGroup("Anteriores", grouped.older)}
            </>
          )}
        </div>

        {/* Footer */}
        {conversations.length > 0 && (
          <div className={`p-3 border-t ${
            chatMode === "general" ? "border-slate-200/60" : "border-zinc-800/50"
          }`}>
            <Button
              variant="ghost"
              onClick={() => setDeleteAllDialogOpen(true)}
              className={`w-full gap-2 h-9 text-xs font-medium ${
                chatMode === "general"
                  ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
                  : "text-zinc-500 hover:text-red-400 hover:bg-red-950/30"
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar todas
            </Button>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-30 lg:hidden ${
            chatMode === "general" ? "bg-black/20" : "bg-black/50"
          }`}
          onClick={onToggle}
        />
      )}

      {/* Delete single dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className={chatMode === "general" ? "" : "bg-zinc-900 border-zinc-800"}>
          <AlertDialogHeader>
            <AlertDialogTitle className={chatMode === "general" ? "" : "text-white"}>
              Eliminar conversación
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La conversación será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={chatMode === "general" ? "" : "bg-zinc-800 text-zinc-300 border-zinc-700"}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete all dialog */}
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent className={chatMode === "general" ? "" : "bg-zinc-900 border-zinc-800"}>
          <AlertDialogHeader>
            <AlertDialogTitle className={chatMode === "general" ? "" : "text-white"}>
              Eliminar todas las conversaciones
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todas tus conversaciones permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={chatMode === "general" ? "" : "bg-zinc-800 text-zinc-300 border-zinc-700"}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteAll}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar todas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className={chatMode === "general" ? "" : "bg-zinc-900 border-zinc-800"}>
          <DialogHeader>
            <DialogTitle className={chatMode === "general" ? "" : "text-white"}>
              Renombrar conversación
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="title" className={chatMode === "general" ? "" : "text-zinc-300"}>
              Nuevo nombre
            </Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ingresa el nuevo nombre..."
              className={`mt-2 ${chatMode === "general" ? "" : "bg-zinc-800 border-zinc-700 text-white"}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirmRename();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
              className={chatMode === "general" ? "" : "bg-zinc-800 text-zinc-300 border-zinc-700"}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmRename}
              disabled={!newTitle.trim()}
              className={chatMode === "general" ? "" : "bg-primary hover:bg-primary/90"}
            >
              Renombrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
