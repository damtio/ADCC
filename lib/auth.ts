import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not configured");
  return createHmac("sha256", password).update("bjj-adcc-admin").digest("hex");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return false;

  try {
    const expected = getSessionToken();
    const sessionBuf = Buffer.from(session);
    const expectedBuf = Buffer.from(expected);
    if (sessionBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(sessionBuf, expectedBuf);
  } catch {
    return false;
  }
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  try {
    const inputBuf = Buffer.from(password);
    const expectedBuf = Buffer.from(adminPassword);
    if (inputBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(inputBuf, expectedBuf);
  } catch {
    return false;
  }
}
