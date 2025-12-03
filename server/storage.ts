import { randomUUID, createHash } from "crypto";
import * as fs from "fs";
import * as path from "path";
import type {
  Conversation,
  InsertConversation,
  Message,
  InsertMessage,
  UsageLimits,
} from "@shared/schema";

const DATA_DIR = process.env.DATA_DIR || "./data";
const STORAGE_FILE = path.join(DATA_DIR, "storage.json");
const USAGE_EXPIRY_DAYS = 7;
const USAGE_RESET_MS = 3 * 24 * 60 * 60 * 1000; // 3 days rolling window

interface StorageData {
  conversations: Record<string, Conversation>;
  messages: Record<string, Message>;
  usageLimits: Record<string, UsageLimits & { fingerprint: string }>;
  premiumUsers: Record<string, { visitorId: string; activatedAt: string; expiresAt: string }>;
  lastSaved: string;
}

export interface IStorage {
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation | undefined>;
  deleteConversation(id: string): Promise<boolean>;
  deleteAllConversations(): Promise<void>;

  getMessages(conversationId: string): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessage(id: string): Promise<boolean>;
  deleteMessagesByConversation(conversationId: string): Promise<void>;
  
  getFavoriteMessages(): Promise<Message[]>;
  toggleMessageFavorite(messageId: string, isFavorite: boolean): Promise<Message | undefined>;
  
  searchMessages(query: string): Promise<Message[]>;
  searchConversations(query: string): Promise<Conversation[]>;

  getUsageLimits(visitorId: string, fingerprint: string): Promise<UsageLimits>;
  incrementAiUsage(visitorId: string, fingerprint: string): Promise<UsageLimits>;
  incrementWebSearchUsage(visitorId: string, fingerprint: string): Promise<UsageLimits>;
  resetWeeklyLimitsIfNeeded(visitorId: string): Promise<UsageLimits>;
  getConversationCount(): Promise<number>;
  
  isPremiumUser(visitorId: string): Promise<boolean>;
  setPremiumUser(visitorId: string, durationDays: number): Promise<void>;
}

function getWeekStartDate(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek;
  const weekStart = new Date(now);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

function isNewWeek(weekStartDate: string): boolean {
  const storedDate = new Date(weekStartDate);
  const currentWeekStart = getWeekStartDate();
  return storedDate.getTime() < currentWeekStart.getTime();
}

export function generateFingerprint(visitorId: string, userAgent?: string): string {
  const data = `${visitorId}-${userAgent || ''}-secure_salt_v3_anti_hack`;
  return createHash('sha256').update(data).digest('hex').substring(0, 16);
}

function verifyFingerprint(storedFingerprint: string, fingerprint: string): boolean {
  return storedFingerprint === fingerprint;
}

export class FileStorage implements IStorage {
  private data: StorageData;
  private saveTimeout: NodeJS.Timeout | null = null;
  private initialized: boolean = false;

  constructor() {
    this.data = {
      conversations: {},
      messages: {},
      usageLimits: {},
      premiumUsers: {},
      lastSaved: new Date().toISOString(),
    };
    this.loadData();
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): void {
    try {
      this.ensureDataDir();
      if (fs.existsSync(STORAGE_FILE)) {
        const rawData = fs.readFileSync(STORAGE_FILE, 'utf-8');
        const parsed = JSON.parse(rawData);
        this.data = {
          conversations: parsed.conversations || {},
          messages: parsed.messages || {},
          usageLimits: parsed.usageLimits || {},
          premiumUsers: parsed.premiumUsers || {},
          lastSaved: parsed.lastSaved || new Date().toISOString(),
        };
        this.cleanupExpiredData();
      }
      this.initialized = true;
    } catch (error) {
      console.error("Error loading storage data:", error);
      this.initialized = true;
    }
  }

  private cleanupExpiredData(): void {
    const now = new Date();
    const expiryThreshold = new Date(now.getTime() - USAGE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    let hasChanges = false;

    for (const [key, limits] of Object.entries(this.data.usageLimits)) {
      const weekStart = new Date(limits.weekStartDate);
      if (weekStart < expiryThreshold) {
        delete this.data.usageLimits[key];
        hasChanges = true;
      }
    }

    for (const [key, premium] of Object.entries(this.data.premiumUsers)) {
      if (new Date(premium.expiresAt) < now) {
        delete this.data.premiumUsers[key];
        hasChanges = true;
      }
    }

    const expiredConversationIds: string[] = [];
    for (const [id, conversation] of Object.entries(this.data.conversations)) {
      const updatedAt = new Date(conversation.updatedAt);
      if (updatedAt < expiryThreshold) {
        expiredConversationIds.push(id);
        delete this.data.conversations[id];
        hasChanges = true;
      }
    }

    for (const [id, message] of Object.entries(this.data.messages)) {
      const messageDate = new Date(message.createdAt);
      if (messageDate < expiryThreshold || expiredConversationIds.includes(message.conversationId)) {
        delete this.data.messages[id];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      console.log(`[FileStorage] Cleaned up expired data: ${expiredConversationIds.length} conversations, checked messages and usage limits`);
      this.saveDataNow();
    }
  }

  private saveDataNow(): void {
    try {
      this.ensureDataDir();
      this.data.lastSaved = new Date().toISOString();
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.error("Error saving storage data:", error);
    }
  }

  private saveData(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      try {
        this.ensureDataDir();
        this.data.lastSaved = new Date().toISOString();
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
      } catch (error) {
        console.error("Error saving storage data:", error);
      }
    }, 100);
  }

  async getConversationCount(): Promise<number> {
    return Object.keys(this.data.conversations).length;
  }

  async isPremiumUser(visitorId: string): Promise<boolean> {
    const premium = this.data.premiumUsers[visitorId];
    if (!premium) return false;
    return new Date(premium.expiresAt) > new Date();
  }

  async setPremiumUser(visitorId: string, durationDays: number): Promise<void> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    this.data.premiumUsers[visitorId] = {
      visitorId,
      activatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
    this.saveData();
  }

  async getUsageLimits(visitorId: string, fingerprint: string): Promise<UsageLimits> {
    let limits = this.data.usageLimits[visitorId];
    
    if (!limits) {
      limits = {
        id: randomUUID(),
        visitorId,
        aiUsageCount: 0,
        robloxMessageCount: 0,
        generalMessageCount: 0,
        webSearchCount: 0,
        weekStartDate: getWeekStartDate().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fingerprint: fingerprint,
      };
      this.data.usageLimits[visitorId] = limits;
      this.saveData();
    }

    if (!verifyFingerprint(limits.fingerprint, fingerprint)) {
      const { fingerprint: _, ...limitsWithoutFingerprint } = limits;
      return limitsWithoutFingerprint;
    }

    // Reset after a rolling 7-day period
    const storedDate = new Date(limits.weekStartDate);
    if (Date.now() - storedDate.getTime() >= USAGE_RESET_MS) {
      limits = {
        ...limits,
        aiUsageCount: 0,
        webSearchCount: 0,
        robloxMessageCount: 0,
        generalMessageCount: 0,
        weekStartDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.data.usageLimits[visitorId] = limits;
      this.saveData();
    }

    const { fingerprint: _, ...limitsWithoutFingerprint } = limits;
    return limitsWithoutFingerprint;
  }

  async incrementAiUsage(visitorId: string, fingerprint: string): Promise<UsageLimits> {
    const limits = await this.getUsageLimits(visitorId, fingerprint);
    const storedLimits = this.data.usageLimits[visitorId];
    
    if (!storedLimits || !verifyFingerprint(storedLimits.fingerprint, fingerprint)) {
      return limits;
    }

    const updated = {
      ...storedLimits,
      aiUsageCount: storedLimits.aiUsageCount + 1,
      updatedAt: new Date().toISOString(),
    };
    this.data.usageLimits[visitorId] = updated;
    this.saveData();
    
    const { fingerprint: _, ...limitsWithoutFingerprint } = updated;
    return limitsWithoutFingerprint;
  }

  async incrementMessageCount(visitorId: string, fingerprint: string, mode: 'roblox' | 'general'): Promise<UsageLimits> {
    const limits = await this.getUsageLimits(visitorId, fingerprint);
    const storedLimits = this.data.usageLimits[visitorId];

    if (!storedLimits || !verifyFingerprint(storedLimits.fingerprint, fingerprint)) {
      return limits;
    }

    const updated = {
      ...storedLimits,
      robloxMessageCount: (storedLimits.robloxMessageCount || 0) + (mode === 'roblox' ? 1 : 0),
      generalMessageCount: (storedLimits.generalMessageCount || 0) + (mode === 'general' ? 1 : 0),
      updatedAt: new Date().toISOString(),
    };

    this.data.usageLimits[visitorId] = updated;
    this.saveData();

    const { fingerprint: _, ...limitsWithoutFingerprint } = updated;
    return limitsWithoutFingerprint;
  }

  async incrementWebSearchUsage(visitorId: string, fingerprint: string): Promise<UsageLimits> {
    const limits = await this.getUsageLimits(visitorId, fingerprint);
    const storedLimits = this.data.usageLimits[visitorId];
    
    if (!storedLimits || !verifyFingerprint(storedLimits.fingerprint, fingerprint)) {
      return limits;
    }

    const updated = {
      ...storedLimits,
      webSearchCount: storedLimits.webSearchCount + 1,
      updatedAt: new Date().toISOString(),
    };
    this.data.usageLimits[visitorId] = updated;
    this.saveData();
    
    const { fingerprint: _, ...limitsWithoutFingerprint } = updated;
    return limitsWithoutFingerprint;
  }

  async resetWeeklyLimitsIfNeeded(visitorId: string): Promise<UsageLimits> {
    const fingerprint = this.data.usageLimits[visitorId]?.fingerprint || '';
    return this.getUsageLimits(visitorId, fingerprint);
  }
  
  async getFavoriteMessages(): Promise<Message[]> {
    return Object.values(this.data.messages).filter(m => m.isFavorite);
  }
  
  async toggleMessageFavorite(messageId: string, isFavorite: boolean): Promise<Message | undefined> {
    const message = this.data.messages[messageId];
    if (!message) return undefined;
    
    const updated: Message = { ...message, isFavorite };
    this.data.messages[messageId] = updated;
    this.saveData();
    return updated;
  }
  
  async searchMessages(query: string): Promise<Message[]> {
    const lowerQuery = query.toLowerCase();
    return Object.values(this.data.messages).filter(m => 
      m.content.toLowerCase().includes(lowerQuery)
    );
  }
  
  async searchConversations(query: string): Promise<Conversation[]> {
    const lowerQuery = query.toLowerCase();
    return Object.values(this.data.conversations).filter(c =>
      c.title.toLowerCase().includes(lowerQuery)
    );
  }

  async getConversations(): Promise<Conversation[]> {
    return Object.values(this.data.conversations).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.data.conversations[id];
  }

  async createConversation(data: InsertConversation): Promise<Conversation> {
    const now = new Date().toISOString();
    const conversation: Conversation = {
      id: data.id || randomUUID(),
      title: data.title,
      createdAt: now,
      updatedAt: now,
    };
    this.data.conversations[conversation.id] = conversation;
    this.saveData();
    return conversation;
  }

  async updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation | undefined> {
    const existing = this.data.conversations[id];
    if (!existing) return undefined;

    const updated: Conversation = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.data.conversations[id] = updated;
    this.saveData();
    return updated;
  }

  async deleteConversation(id: string): Promise<boolean> {
    await this.deleteMessagesByConversation(id);
    const existed = id in this.data.conversations;
    delete this.data.conversations[id];
    if (existed) this.saveData();
    return existed;
  }

  async deleteAllConversations(): Promise<void> {
    this.data.conversations = {};
    this.data.messages = {};
    this.saveData();
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return Object.values(this.data.messages)
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.data.messages[id];
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const message: Message = {
      id: data.id || randomUUID(),
      conversationId: data.conversationId,
      role: data.role as "user" | "assistant",
      content: data.content,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };
    this.data.messages[message.id] = message;
    this.saveData();

    await this.updateConversation(data.conversationId, {});

    return message;
  }

  async deleteMessage(id: string): Promise<boolean> {
    const existed = id in this.data.messages;
    delete this.data.messages[id];
    if (existed) this.saveData();
    return existed;
  }

  async deleteMessagesByConversation(conversationId: string): Promise<void> {
    for (const [id, message] of Object.entries(this.data.messages)) {
      if (message.conversationId === conversationId) {
        delete this.data.messages[id];
      }
    }
    this.saveData();
  }
}

export const storage = new FileStorage();
