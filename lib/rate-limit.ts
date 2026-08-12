import "server-only";

import { createHmac } from "crypto";
import { headers } from "next/headers";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

function secret(): string {
  return (
    process.env.RATE_LIMIT_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "development-only-rate-limit-secret"
  );
}

function digest(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export async function requestFingerprint(): Promise<{
  ip: string;
  agent: string;
}> {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-nf-client-connection-ip") ||
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  return {
    ip: digest(`ip:${ip}`),
    agent: digest(`ua:${requestHeaders.get("user-agent") || "unknown"}`),
  };
}

export function privateFingerprint(kind: string, value: string): string {
  return digest(`${kind}:${value.trim().toLowerCase()}`);
}

export async function consumeRateLimit(
  action: string,
  subjectHash: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return false;
  const bucketKey = digest(`${action}:${subjectHash}`);
  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_action: action,
    p_bucket_key: bucketKey,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  // Permit requests during a staggered deploy before migration 012 is applied.
  if (error?.code === "PGRST202" || error?.code === "42883") return true;
  if (error) return false;
  return data === true;
}
