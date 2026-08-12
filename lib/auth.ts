import "server-only";

import { createHash, createHmac, randomUUID, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24;

function sessionSecrets(): string[] {
  const current =
    process.env.ADMIN_SESSION_SECRET ||
    createHash("sha256")
      .update(`${process.env.ADMIN_PASSWORD ?? ""}:admin-session`)
      .digest("hex");
  return [current, process.env.ADMIN_SESSION_SECRET_PREVIOUS].filter(
    (value): value is string => Boolean(value),
  );
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  if (!session) return false;

  try {
    const [payload, signature] = session.split(".");
    if (!payload || !signature) return false;
    const validSignature = sessionSecrets().some((secret) =>
      safeEqual(signature, sign(payload, secret)),
    );
    if (!validSignature) return false;
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      exp?: number;
    };
    return typeof parsed.exp === "number" && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export async function createSession(): Promise<void> {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Date.now() + COOKIE_MAX_AGE * 1000,
      nonce: randomUUID(),
    }),
  ).toString("base64url");
  const token = `${payload}.${sign(payload, sessionSecrets()[0])}`;
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/admin",
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/admin",
  });
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(password, expected!);
}
