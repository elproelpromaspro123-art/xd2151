import { randomUUID, createHash } from "crypto";
import * as fs from "fs";
import * as path from "path";
import nodemailer from "nodemailer";

const DATA_DIR = process.env.DATA_DIR || "./data";
const USERS_FILE = path.join(DATA_DIR, "users.json");
const VERIFICATION_FILE = path.join(DATA_DIR, "verification_codes.json");
const IP_TRACKING_FILE = path.join(DATA_DIR, "ip_tracking.json");

const PREMIUM_EMAIL = "uiuxchatbot@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "uiuxchatbot@gmail.com",
    pass: "meez ijlk yelz ccdf", // contraseña de aplicación
  },
  connectionTimeout: 10000, // 10 segundos
  socketTimeout: 10000, // 10 segundos
  greetingTimeout: 10000, // 10 segundos
});

const VPN_DATACENTER_ASNS = [
  "AS14061", "AS16276", "AS24940", "AS63949", "AS20473", "AS45102", "AS9009",
  "AS60068", "AS202448", "AS204957", "AS51167", "AS41378", "AS31898"
];

interface User {
  id: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isPremium: boolean;
  googleId?: string;
  createdAt: string;
  lastLoginAt: string;
  registrationIp: string;
  registrationIpHash: string;
}

interface VerificationCode {
  code: string;
  email: string;
  expiresAt: string;
  type?: "email_verification" | "password_reset";
  attempts?: number;
}

interface IpTracking {
  ipHash: string;
  registeredUserIds: string[];
  lastAttempt: string;
  attemptCount: number;
  blocked: boolean;
  blockedUntil?: string;
}

interface UsersData {
  users: Record<string, User>;
  lastSaved: string;
}

interface VerificationData {
  codes: Record<string, VerificationCode>;
  lastSaved: string;
}

interface IpTrackingData {
  ips: Record<string, IpTracking>;
  lastSaved: string;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadUsersData(): UsersData {
  try {
    ensureDataDir();
    if (fs.existsSync(USERS_FILE)) {
      const rawData = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error("Error loading users data:", error);
  }
  return { users: {}, lastSaved: new Date().toISOString() };
}

function saveUsersData(data: UsersData): void {
  try {
    ensureDataDir();
    data.lastSaved = new Date().toISOString();
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving users data:", error);
  }
}

export function loadVerificationData(): VerificationData {
  try {
    ensureDataDir();
    if (fs.existsSync(VERIFICATION_FILE)) {
      const rawData = fs.readFileSync(VERIFICATION_FILE, "utf-8");
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error("Error loading verification data:", error);
  }
  return { codes: {}, lastSaved: new Date().toISOString() };
}

export function saveVerificationData(data: VerificationData): void {
  try {
    ensureDataDir();
    data.lastSaved = new Date().toISOString();
    fs.writeFileSync(VERIFICATION_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving verification data:", error);
  }
}

function loadIpTrackingData(): IpTrackingData {
  try {
    ensureDataDir();
    if (fs.existsSync(IP_TRACKING_FILE)) {
      const rawData = fs.readFileSync(IP_TRACKING_FILE, "utf-8");
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error("Error loading IP tracking data:", error);
  }
  return { ips: {}, lastSaved: new Date().toISOString() };
}

function saveIpTrackingData(data: IpTrackingData): void {
  try {
    ensureDataDir();
    data.lastSaved = new Date().toISOString();
    fs.writeFileSync(IP_TRACKING_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving IP tracking data:", error);
  }
}

function hashPassword(password: string): string {
  const salt = "roblox_ui_designer_secure_salt_v1";
  return createHash("sha256").update(password + salt).digest("hex");
}

function hashIp(ip: string): string {
  const salt = "ip_tracking_salt_v1_secure";
  return createHash("sha256").update(ip + salt).digest("hex");
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getClientIp(req: any): string {
  const forwarded = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];
  const cfConnectingIp = req.headers["cf-connecting-ip"];
  
  if (cfConnectingIp && typeof cfConnectingIp === "string") {
    return cfConnectingIp.split(",")[0].trim();
  }
  if (realIp && typeof realIp === "string") {
    return realIp.split(",")[0].trim();
  }
  if (forwarded && typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || "unknown";
}

export async function detectVpnOrProxy(req: any): Promise<{ isVpn: boolean; reason?: string }> {
  // Desactivada la detección de VPN porque en entornos de hosting como Replit,
  // las solicitudes siempre pasan por proxies/load balancers, lo que causa falsos positivos.
  // Headers como x-forwarded-for y via son normales en estos entornos.
  return { isVpn: false };
}

export function checkIpRestrictions(ip: string): { allowed: boolean; reason?: string } {
  const ipHash = hashIp(ip);
  const data = loadIpTrackingData();
  const tracking = data.ips[ipHash];

  if (!tracking) {
    return { allowed: true };
  }

  if (tracking.blocked) {
    if (tracking.blockedUntil) {
      const blockedUntil = new Date(tracking.blockedUntil);
      if (new Date() < blockedUntil) {
        const minutesLeft = Math.ceil((blockedUntil.getTime() - Date.now()) / 60000);
        return { 
          allowed: false, 
          reason: `IP bloqueada por actividad sospechosa. Intenta de nuevo en ${minutesLeft} minutos.` 
        };
      }
      tracking.blocked = false;
      tracking.attemptCount = 0;
      delete tracking.blockedUntil;
      saveIpTrackingData(data);
    } else {
      return { allowed: false, reason: "IP bloqueada permanentemente" };
    }
  }

  if (tracking.registeredUserIds.length >= 2) {
    return { 
      allowed: false, 
      reason: "Ya se han registrado demasiadas cuentas desde esta IP. Solo se permiten 2 cuentas por IP." 
    };
  }

  return { allowed: true };
}

export function trackIpRegistration(ip: string, userId: string): void {
  const ipHash = hashIp(ip);
  const data = loadIpTrackingData();

  if (!data.ips[ipHash]) {
    data.ips[ipHash] = {
      ipHash,
      registeredUserIds: [],
      lastAttempt: new Date().toISOString(),
      attemptCount: 0,
      blocked: false,
    };
  }

  const tracking = data.ips[ipHash];
  tracking.registeredUserIds.push(userId);
  tracking.lastAttempt = new Date().toISOString();
  saveIpTrackingData(data);
}

export function recordFailedAttempt(ip: string): void {
  const ipHash = hashIp(ip);
  const data = loadIpTrackingData();

  if (!data.ips[ipHash]) {
    data.ips[ipHash] = {
      ipHash,
      registeredUserIds: [],
      lastAttempt: new Date().toISOString(),
      attemptCount: 0,
      blocked: false,
    };
  }

  const tracking = data.ips[ipHash];
  tracking.attemptCount++;
  tracking.lastAttempt = new Date().toISOString();

  if (tracking.attemptCount >= 5) {
    tracking.blocked = true;
    tracking.blockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  }

  saveIpTrackingData(data);
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0f0f12; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1a1a1f; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a35;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #1a1a1f 0%, #0f0f12 100%);">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%); border-radius: 12px; margin: 0 auto 20px;">
              </div>
              <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 10px; font-weight: 600;">Roblox UI Designer Pro</h1>
              <p style="color: #888; font-size: 14px; margin: 0;">Verifica tu correo electronico</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Hola! Para completar tu registro, usa el siguiente codigo de verificacion:
              </p>
              <div style="background: linear-gradient(135deg, #2a2a35 0%, #1f1f25 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px; border: 1px solid #3a3a45;">
                <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ffffff;">${code}</span>
              </div>
              <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
                Este codigo expira en <strong style="color: #ffffff;">15 minutos</strong>.
              </p>
              <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0;">
                Si no solicitaste este codigo, puedes ignorar este correo.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px; background-color: #0f0f12; border-top: 1px solid #2a2a35;">
              <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
                IMPORTANTE: Si no encuentras este correo en tu bandeja de entrada, <strong>revisa tu carpeta de spam o correo no deseado</strong>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await transporter.sendMail({
      from: "uiuxchatbot@gmail.com",
      to: email,
      subject: "Verificación",
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}

export async function registerUser(
  email: string, 
  password: string, 
  ip: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const data = loadUsersData();
  
  const existingUser = Object.values(data.users).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return { success: false, error: "Este correo ya esta registrado" };
  }

  const ipRestriction = checkIpRestrictions(ip);
  if (!ipRestriction.allowed) {
    return { success: false, error: ipRestriction.reason };
  }

  const userId = randomUUID();
  const now = new Date().toISOString();
  const isPremium = email.toLowerCase() === PREMIUM_EMAIL.toLowerCase();

  const user: User = {
    id: userId,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    isEmailVerified: false,
    isPremium,
    createdAt: now,
    lastLoginAt: now,
    registrationIp: ip,
    registrationIpHash: hashIp(ip),
  };

  data.users[userId] = user;
  saveUsersData(data);
  trackIpRegistration(ip, userId);

  const code = generateVerificationCode();
  const verificationData = loadVerificationData();
  verificationData.codes[email.toLowerCase()] = {
    code,
    email: email.toLowerCase(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    type: "email_verification",
  };
  saveVerificationData(verificationData);

  const emailSent = await sendVerificationEmail(email, code);
  if (!emailSent) {
    console.error("Failed to send verification email");
  }

  return { success: true, userId };
}

export function verifyEmailCode(email: string, code: string): { success: boolean; error?: string } {
  const verificationData = loadVerificationData();
  const verification = verificationData.codes[email.toLowerCase()];

  if (!verification) {
    return { success: false, error: "No hay codigo de verificacion pendiente para este correo" };
  }

  if (new Date() > new Date(verification.expiresAt)) {
    delete verificationData.codes[email.toLowerCase()];
    saveVerificationData(verificationData);
    return { success: false, error: "El codigo ha expirado. Solicita uno nuevo." };
  }

  if (verification.code !== code) {
    return { success: false, error: "Codigo incorrecto" };
  }

  delete verificationData.codes[email.toLowerCase()];
  saveVerificationData(verificationData);

  const usersData = loadUsersData();
  const user = Object.values(usersData.users).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.isEmailVerified = true;
    saveUsersData(usersData);
  }

  return { success: true };
}

export async function resendVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
  const usersData = loadUsersData();
  const user = Object.values(usersData.users).find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return { success: false, error: "Usuario no encontrado" };
  }

  if (user.isEmailVerified) {
    return { success: false, error: "Este correo ya esta verificado" };
  }

  const code = generateVerificationCode();
  const verificationData = loadVerificationData();
  verificationData.codes[email.toLowerCase()] = {
    code,
    email: email.toLowerCase(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    type: "email_verification",
  };
  saveVerificationData(verificationData);

  const emailSent = await sendVerificationEmail(email, code);
  if (!emailSent) {
    return { success: false, error: "Error al enviar el correo. Intenta de nuevo." };
  }

  return { success: true };
}

export function loginUser(
  email: string, 
  password: string, 
  ip: string
): { success: boolean; user?: User; error?: string } {
  const data = loadUsersData();
  const user = Object.values(data.users).find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    recordFailedAttempt(ip);
    return { success: false, error: "Correo o contrasena incorrectos" };
  }

  if (user.passwordHash !== hashPassword(password)) {
    recordFailedAttempt(ip);
    return { success: false, error: "Correo o contrasena incorrectos" };
  }

  if (!user.isEmailVerified) {
    return { success: false, error: "Debes verificar tu correo antes de iniciar sesion" };
  }

  user.lastLoginAt = new Date().toISOString();
  saveUsersData(data);

  return { success: true, user };
}

export function loginWithGoogle(
  googleId: string, 
  email: string, 
  ip: string
): { success: boolean; user?: User; isNewUser?: boolean; requiresVerification?: boolean; error?: string } {
  const data = loadUsersData();
  
  let user = Object.values(data.users).find(u => u.googleId === googleId);
  
  if (!user) {
    user = Object.values(data.users).find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      user.googleId = googleId;
      user.lastLoginAt = new Date().toISOString();
      saveUsersData(data);
      
      // OBLIGATORIO: Verificar si el correo está verificado
      if (!user.isEmailVerified) {
        return { success: true, user, isNewUser: false, requiresVerification: true };
      }
      return { success: true, user, isNewUser: false };
    }

    const ipRestriction = checkIpRestrictions(ip);
    if (!ipRestriction.allowed) {
      return { success: false, error: ipRestriction.reason };
    }

    const userId = randomUUID();
    const now = new Date().toISOString();
    const isPremium = email.toLowerCase() === PREMIUM_EMAIL.toLowerCase();

    user = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash: "",
      isEmailVerified: false, // Nuevo usuario siempre requiere verificación
      isPremium,
      googleId,
      createdAt: now,
      lastLoginAt: now,
      registrationIp: ip,
      registrationIpHash: hashIp(ip),
    };

    data.users[userId] = user;
    saveUsersData(data);
    trackIpRegistration(ip, userId);

    // OBLIGATORIO: Nuevo usuario siempre requiere verificación
    return { success: true, user, isNewUser: true, requiresVerification: true };
  }

  user.lastLoginAt = new Date().toISOString();
  saveUsersData(data);
  
  // OBLIGATORIO: Verificar si el correo está verificado antes de permitir login
  if (!user.isEmailVerified) {
    return { success: true, user, isNewUser: false, requiresVerification: true };
  }
  
  // Solo permitir login si el correo está verificado
  return { success: true, user, isNewUser: false };
}

export function getUserById(userId: string): User | null {
  const data = loadUsersData();
  return data.users[userId] || null;
}

export function getUserByEmail(email: string): User | null {
  const data = loadUsersData();
  return Object.values(data.users).find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function isUserPremium(userId: string): boolean {
  const user = getUserById(userId);
  return user?.isPremium || false;
}

export function setUserPremium(userId: string, isPremium: boolean): boolean {
  const data = loadUsersData();
  const user = data.users[userId];
  if (!user) return false;
  
  user.isPremium = isPremium;
  saveUsersData(data);
  return true;
}

export function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  const data = loadUsersData();
  const user = data.users[userId];

  if (!user) {
    return { success: false, error: "Usuario no encontrado" };
  }

  if (user.googleId && !user.passwordHash) {
    return { success: false, error: "Esta cuenta usa Google para iniciar sesión. No puedes cambiar la contraseña." };
  }

  if (user.passwordHash !== hashPassword(currentPassword)) {
    return { success: false, error: "La contraseña actual es incorrecta" };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "La nueva contraseña debe tener al menos 6 caracteres" };
  }

  user.passwordHash = hashPassword(newPassword);
  saveUsersData(data);

  return { success: true };
}
