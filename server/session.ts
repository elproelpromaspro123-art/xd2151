import { randomUUID, createHash } from "crypto";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = process.env.DATA_DIR || "./data";
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  userAgent?: string;
  ip?: string;
}

interface SessionsData {
  sessions: Record<string, Session>;
  lastSaved: string;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadSessionsData(): SessionsData {
  try {
    ensureDataDir();
    if (fs.existsSync(SESSIONS_FILE)) {
      const rawData = fs.readFileSync(SESSIONS_FILE, "utf-8");
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error("Error loading sessions data:", error);
  }
  return { sessions: {}, lastSaved: new Date().toISOString() };
}

function saveSessionsData(data: SessionsData): void {
  try {
    ensureDataDir();
    data.lastSaved = new Date().toISOString();
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving sessions data:", error);
  }
}

function generateToken(): string {
  return randomUUID() + "-" + createHash("sha256").update(Date.now().toString() + Math.random()).digest("hex").substring(0, 32);
}

export function createSession(userId: string, userAgent?: string, ip?: string): Session {
  const data = loadSessionsData();
  
  const now = new Date();
  const session: Session = {
    id: randomUUID(),
    userId,
    token: generateToken(),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_DURATION).toISOString(),
    userAgent,
    ip,
  };

  data.sessions[session.token] = session;
  saveSessionsData(data);

  cleanupExpiredSessions();

  return session;
}

export function getSessionByToken(token: string): Session | null {
  const data = loadSessionsData();
  const session = data.sessions[token];

  if (!session) {
    return null;
  }

  if (new Date() > new Date(session.expiresAt)) {
    delete data.sessions[token];
    saveSessionsData(data);
    return null;
  }

  return session;
}

export function deleteSession(token: string): boolean {
  const data = loadSessionsData();
  
  if (data.sessions[token]) {
    delete data.sessions[token];
    saveSessionsData(data);
    return true;
  }

  return false;
}

export function deleteUserSessions(userId: string): void {
  const data = loadSessionsData();
  
  for (const [token, session] of Object.entries(data.sessions)) {
    if (session.userId === userId) {
      delete data.sessions[token];
    }
  }

  saveSessionsData(data);
}

function cleanupExpiredSessions(): void {
  const data = loadSessionsData();
  const now = new Date();
  let hasChanges = false;

  for (const [token, session] of Object.entries(data.sessions)) {
    if (new Date(session.expiresAt) < now) {
      delete data.sessions[token];
      hasChanges = true;
    }
  }

  if (hasChanges) {
    saveSessionsData(data);
  }
}

export function refreshSession(token: string): Session | null {
  const data = loadSessionsData();
  const session = data.sessions[token];

  if (!session) {
    return null;
  }

  if (new Date() > new Date(session.expiresAt)) {
    delete data.sessions[token];
    saveSessionsData(data);
    return null;
  }

  session.expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();
  saveSessionsData(data);

  return session;
}
