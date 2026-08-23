import fs from "node:fs/promises";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

function decodeHtml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&ndash;", "–")
    .replaceAll("&mdash;", "—")
    .replaceAll("&amp;", "&")
    .replaceAll("&#160;", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function priceContexts(html) {
  const blocks = html
    .replace(/<\/(?:li|p|div|td|tr|br)>/gi, "\n")
    .split("\n");
  const contexts = [];
  for (const block of blocks) {
    const text = decodeHtml(block);
    if (!/(?:\d[\d ]*(?:[,.]\d{1,2})?)\s*(?:zł|PLN)/i.test(text)) continue;
    if (text.length > 500) continue;
    contexts.push(text);
  }
  return [...new Set(contexts)];
}

const { data: events, error } = await supabase
  .from("events")
  .select("id,slug,title,registration_url,price")
  .is("user_id", null)
  .like("registration_url", "%martialmatch.com%")
  .is("price", null)
  .order("date");
if (error) throw error;

const report = [];
for (const event of events) {
  try {
    const response = await fetch(event.registration_url, {
      headers: { "user-agent": "Mozilla/5.0 WolnaMata price research" },
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contexts = priceContexts(await response.text());
    report.push({ ...event, contexts });
    console.log(`ok: ${event.slug} (${contexts.length} contexts)`);
  } catch (caught) {
    report.push({
      ...event,
      contexts: [],
      error: caught instanceof Error ? caught.message : String(caught),
    });
    console.log(`error: ${event.slug}`);
  }
}

await fs.writeFile(
  "data/martialmatch-price-research.json",
  `${JSON.stringify(report, null, 2)}\n`,
);
