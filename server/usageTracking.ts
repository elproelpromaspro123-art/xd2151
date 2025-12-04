import * as fs from "fs";
import * as path from "path";

const DATA_DIR = process.env.DATA_DIR || "./data";
const USAGE_FILE = path.join(DATA_DIR, "usage_tracking.json");

interface UserUsage {
    robloxMessageCount: number;
    generalMessageCount: number;
    webSearchCount: number;
    weekStartDate: string;
    lastUpdated: string;
}

interface UsageData {
    users: Record<string, UserUsage>;
    lastSaved: string;
}

function ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function getWeekStartDate(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek;
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString();
}

function shouldResetUsage(weekStartDate: string): boolean {
    const storedStart = new Date(weekStartDate);
    const currentWeekStart = new Date(getWeekStartDate());
    return currentWeekStart > storedStart;
}

function loadUsageData(): UsageData {
    try {
        ensureDataDir();
        if (fs.existsSync(USAGE_FILE)) {
            const rawData = fs.readFileSync(USAGE_FILE, "utf-8");
            return JSON.parse(rawData);
        }
    } catch (error) {
        console.error("Error loading usage data:", error);
    }
    return { users: {}, lastSaved: new Date().toISOString() };
}

function saveUsageData(data: UsageData): void {
    try {
        ensureDataDir();
        data.lastSaved = new Date().toISOString();
        fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
        console.error("Error saving usage data:", error);
    }
}

function getDefaultUsage(): UserUsage {
    return {
        robloxMessageCount: 0,
        generalMessageCount: 0,
        webSearchCount: 0,
        weekStartDate: getWeekStartDate(),
        lastUpdated: new Date().toISOString(),
    };
}

export function getUserUsage(userId: string): UserUsage {
    const data = loadUsageData();
    let usage = data.users[userId];

    if (!usage) {
        usage = getDefaultUsage();
        data.users[userId] = usage;
        saveUsageData(data);
        return usage;
    }

    // Verificar si se debe reiniciar (nueva semana)
    if (shouldResetUsage(usage.weekStartDate)) {
        usage = getDefaultUsage();
        data.users[userId] = usage;
        saveUsageData(data);
    }

    return usage;
}

export function incrementMessageCount(userId: string, mode: "roblox" | "general"): void {
    const data = loadUsageData();
    let usage = data.users[userId];

    if (!usage) {
        usage = getDefaultUsage();
    }

    // Verificar reinicio semanal
    if (shouldResetUsage(usage.weekStartDate)) {
        usage = getDefaultUsage();
    }

    if (mode === "roblox") {
        usage.robloxMessageCount++;
    } else {
        usage.generalMessageCount++;
    }

    usage.lastUpdated = new Date().toISOString();
    data.users[userId] = usage;
    saveUsageData(data);
}

export function incrementWebSearchCount(userId: string): void {
    const data = loadUsageData();
    let usage = data.users[userId];

    if (!usage) {
        usage = getDefaultUsage();
    }

    if (shouldResetUsage(usage.weekStartDate)) {
        usage = getDefaultUsage();
    }

    usage.webSearchCount++;
    usage.lastUpdated = new Date().toISOString();
    data.users[userId] = usage;
    saveUsageData(data);
}

export function canSendMessage(userId: string, mode: "roblox" | "general"): boolean {
    const usage = getUserUsage(userId);
    const limit = 10; // 10 mensajes por modo en plan free

    if (mode === "roblox") {
        return usage.robloxMessageCount < limit;
    } else {
        return usage.generalMessageCount < limit;
    }
}

export function canUseWebSearch(userId: string): boolean {
    const usage = getUserUsage(userId);
    return usage.webSearchCount < 5; // 5 búsquedas web en plan free
}

export function getMessagesRemaining(userId: string, mode: "roblox" | "general"): number {
    const usage = getUserUsage(userId);
    const limit = 10;

    if (mode === "roblox") {
        return Math.max(0, limit - usage.robloxMessageCount);
    } else {
        return Math.max(0, limit - usage.generalMessageCount);
    }
}

export function getWebSearchesRemaining(userId: string): number {
    const usage = getUserUsage(userId);
    return Math.max(0, 5 - usage.webSearchCount);
}
