import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const conversations = pgTable("conversations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  conversationId: varchar("conversation_id", { length: 36 }).notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id", { length: 36 }).primaryKey(),
  theme: text("theme").default("dark-white").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usageLimits = pgTable("usage_limits", {
  id: varchar("id", { length: 36 }).primaryKey(),
  visitorId: varchar("visitor_id", { length: 64 }).notNull(),
  aiUsageCount: integer("ai_usage_count").default(0).notNull(),
  webSearchCount: integer("web_search_count").default(0).notNull(),
  weekStartDate: timestamp("week_start_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  createdAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type InsertMessage = z.infer<typeof insertMessageSchema>;

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface UserPreferences {
  id: string;
  theme: "dark-white" | "cyberpunk" | "neon" | "minimal";
  createdAt: string;
  updatedAt: string;
}

export interface UsageLimits {
  id: string;
  visitorId: string;
  aiUsageCount: number;
  webSearchCount: number;
  robloxMessageCount?: number;
  generalMessageCount?: number;
  weekStartDate: string;
  createdAt: string;
  updatedAt: string;
}

export const PLAN_LIMITS = {
  free: {
    aiUsagePerWeek: 50,
    webSearchPerWeek: 5,
    maxChats: 5,
  },
  premium: {
    aiUsagePerWeek: -1,
    webSearchPerWeek: -1,
    maxChats: -1,
  },
};

export interface AIModel {
  key: string;
  id: string;
  name: string;
  description: string;
  supportsImages: boolean;
  supportsReasoning: boolean;
  isPremiumOnly: boolean;
  maxTokens: number;
  avgTokensPerSecond: number;
  available: boolean;
  category?: "programming" | "general";
  isRateLimited?: boolean;
  remainingTime?: number; // En milisegundos hasta que esté disponible
  resetTime?: number; // Unix timestamp cuando estará disponible
}

export const chatRequestSchema = z.object({
  conversationId: z.string().optional().nullable(),
  message: z.string().min(1),
  useWebSearch: z.boolean().optional(),
  model: z.string().optional(),
  useReasoning: z.boolean().optional(),
  imageBase64: z.string().nullable().optional(),
  chatMode: z.enum(["roblox", "general"]).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const themeSchema = z.enum(["dark-white", "cyberpunk", "neon", "minimal"]);
export type Theme = z.infer<typeof themeSchema>;

export type ChatMode = "roblox" | "general";
