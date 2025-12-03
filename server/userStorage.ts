import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import type { Conversation, Message } from "@shared/schema";

const DATA_DIR = process.env.DATA_DIR || "./data";
const USER_DATA_DIR = path.join(DATA_DIR, "users_data");

interface UserStorageData {
  conversations: Record<string, Conversation>;
  messages: Record<string, Message>;
  lastSaved: string;
}

function ensureUserDataDir(userId: string): string {
  const userDir = path.join(USER_DATA_DIR, userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  return userDir;
}

function getUserStorageFile(userId: string): string {
  return path.join(ensureUserDataDir(userId), "data.json");
}

function loadUserData(userId: string): UserStorageData {
  try {
    const filePath = getUserStorageFile(userId);
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error(`Error loading user data for ${userId}:`, error);
  }
  return { conversations: {}, messages: {}, lastSaved: new Date().toISOString() };
}

function saveUserData(userId: string, data: UserStorageData): void {
  try {
    const filePath = getUserStorageFile(userId);
    ensureUserDataDir(userId);
    data.lastSaved = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error saving user data for ${userId}:`, error);
  }
}

export function getUserConversations(userId: string): Conversation[] {
  const data = loadUserData(userId);
  return Object.values(data.conversations).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getUserConversation(userId: string, conversationId: string): Conversation | undefined {
  const data = loadUserData(userId);
  return data.conversations[conversationId];
}

export function createUserConversation(userId: string, title: string): Conversation {
  const data = loadUserData(userId);
  const now = new Date().toISOString();
  
  const conversation: Conversation = {
    id: randomUUID(),
    title,
    createdAt: now,
    updatedAt: now,
  };

  data.conversations[conversation.id] = conversation;
  saveUserData(userId, data);
  return conversation;
}

export function updateUserConversation(userId: string, conversationId: string, updates: Partial<Conversation>): Conversation | undefined {
  const data = loadUserData(userId);
  const conversation = data.conversations[conversationId];
  
  if (!conversation) return undefined;

  const updated: Conversation = {
    ...conversation,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  data.conversations[conversationId] = updated;
  saveUserData(userId, data);
  return updated;
}

export function deleteUserConversation(userId: string, conversationId: string): boolean {
  const data = loadUserData(userId);
  
  if (!data.conversations[conversationId]) return false;

  delete data.conversations[conversationId];

  for (const [id, message] of Object.entries(data.messages)) {
    if (message.conversationId === conversationId) {
      delete data.messages[id];
    }
  }

  saveUserData(userId, data);
  return true;
}

export function deleteAllUserConversations(userId: string): void {
  const data = loadUserData(userId);
  data.conversations = {};
  data.messages = {};
  saveUserData(userId, data);
}

export function getUserMessages(userId: string, conversationId: string): Message[] {
  const data = loadUserData(userId);
  return Object.values(data.messages)
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function createUserMessage(
  userId: string, 
  conversationId: string, 
  role: "user" | "assistant", 
  content: string
): Message {
  const data = loadUserData(userId);
  
  const message: Message = {
    id: randomUUID(),
    conversationId,
    role,
    content,
    createdAt: new Date().toISOString(),
    isFavorite: false,
  };

  data.messages[message.id] = message;

  if (data.conversations[conversationId]) {
    data.conversations[conversationId].updatedAt = new Date().toISOString();
  }

  saveUserData(userId, data);
  return message;
}

export function deleteUserMessage(userId: string, messageId: string): boolean {
  const data = loadUserData(userId);
  
  if (!data.messages[messageId]) return false;

  delete data.messages[messageId];
  saveUserData(userId, data);
  return true;
}

export function getUserConversationCount(userId: string): number {
  const data = loadUserData(userId);
  return Object.keys(data.conversations).length;
}
