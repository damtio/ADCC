import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const outputDir = path.resolve("data/martialmatch-content");
const bucket = "event-images";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

function decodeEntities(value) {
  const decoded = value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
  return decoded.includes("&amp;") ? decodeEntities(decoded) : decoded;
}

function extractCommunique(html) {
  const match = html.match(
    /<div class="content is-breaking-words-anywhere">([\s\S]*?)<\/div>\s*<\/div>\s*<\/article>/i,
  );
  if (!match) return null;

  const text = decodeEntities(
    match[1]
      .replace(/<script\b[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li\b[^>]*>/gi, "\n• ")
      .replace(/<\/(?:p|li|h1|h2|h3|h4|h5|h6|ul|ol|pre|blockquote)>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  );

  const lines = text
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const selected = [lines[0]];
  let pricingLinesRemaining = 0;
  for (const [index, line] of lines.slice(1).entries()) {
    if (/\b(?:IBAN|BIC|SWIFT|beneficjent|odbiorca|tytuł przelewu|numer konta|konto bankowe)\b/i.test(line)) continue;
    if (/\b\d{2}(?:\s*\d{4}){5,}\b/.test(line)) continue;
    if (/Zwycięzcy kategorii|pula nagród|miejsce - \d+\s*(?:zł|PLN|EUR)/i.test(line)) continue;
    if (/^(?:kategorie wagowe|nagrody|dane do przelewu|harmonogram|prawo do startu)/i.test(line)) {
      pricingLinesRemaining = 0;
      continue;
    }

    const isCoreFact = /^(?:data|termin|miejsce|adres|organizator|formuła|zasady|lokalizacja|start zawodów|rozpoczęcie zawodów|termin rejestracji|rejestracja|kontakt|koszt udziału|opłata startowa)/i.test(line);
    const startsPricing = /(?:opłat|koszt rejestracji|termin rejestracji)/i.test(line);
    const isPricingDetail = pricingLinesRemaining > 0 && /(?:\d+\s*(?:zł|PLN)|pierwszy termin|drugi termin|trzeci termin|I termin|II termin|III termin|od \d|do \d)/i.test(line);
    const isShortIntro = index < 4 && line.length < 240;

    if (isCoreFact || startsPricing || isPricingDetail || isShortIntro) {
      selected.push(line);
      if (startsPricing) pricingLinesRemaining = 8;
    }
    if (pricingLinesRemaining > 0) pricingLinesRemaining -= 1;
    if (selected.join("\n").length >= 1200) break;
  }

  const summary = [...new Set(selected)].join("\n").slice(0, 1400).trim();
  return summary.length >= 40 ? summary : null;
}

function extractCupEdition(value) {
  const match = value?.match(/\bcup\s*[–—:-]?\s*(\d+)\b/i);
  return match ? Number(match[1]) : null;
}

function extractChampionshipEdition(value) {
  const match = value?.match(/\bchampionships?\s*(\d+)\b/i);
  return match ? Number(match[1]) : null;
}

function backgroundUrl(html) {
  const value = html.match(/url\(['"]?(https:\/\/static\.martialmatch\.com\/images\/p\/bkg_[^'"\)]+)['"]?\)/i)?.[1];
  return value ? decodeEntities(value) : null;
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 WolnaMata content sync" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

await fs.mkdir(outputDir, { recursive: true });
const { data: events, error } = await supabase
  .from("events")
  .select("id,slug,title,date,description,image_url,registration_url")
  .is("user_id", null)
  .eq("category", "Tournament")
  .like("registration_url", "%martialmatch.com%")
  .order("date");
if (error) throw error;

const report = [];
for (const event of events) {
  const item = { slug: event.slug, title: event.title };
  try {
    const response = await fetch(event.registration_url, {
      headers: { "user-agent": "Mozilla/5.0 WolnaMata content sync" },
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`page HTTP ${response.status}`);
    const html = await response.text();
    let description = extractCommunique(html);
    const mentionedYears = description?.match(/\b20\d{2}\b/g) ?? [];
    const eventYear = event.date.slice(0, 4);
    if (mentionedYears.length > 0 && !mentionedYears.includes(eventYear)) {
      description = null;
      item.description_rejected = `source mentions ${[...new Set(mentionedYears)].join(", ")} instead of ${eventYear}`;
    }
    const titleEdition = extractCupEdition(event.title);
    const sourceEdition = extractCupEdition(description) ?? extractChampionshipEdition(description);
    if (description && titleEdition && sourceEdition && titleEdition !== sourceEdition) {
      description = null;
      item.description_rejected = `source describes cup edition ${sourceEdition} instead of ${titleEdition}`;
    }
    item.description = description;

    // A stale event page is not a trustworthy source for either copy or artwork.
    const sourceImageUrl = item.description_rejected ? null : backgroundUrl(html);
    item.source_image_url = sourceImageUrl;
    let improvedImageUrl = null;
    if (sourceImageUrl) {
      const source = await fetchBuffer(sourceImageUrl);
      const sourceMetadata = await sharp(source, { failOn: "error" }).metadata();
      let existingPixels = 0;
      if (event.image_url) {
        try {
          const existing = await fetchBuffer(event.image_url);
          const existingMetadata = await sharp(existing, { failOn: "error" }).metadata();
          existingPixels = (existingMetadata.width ?? 0) * (existingMetadata.height ?? 0);
          item.existing_dimensions = `${existingMetadata.width}x${existingMetadata.height}`;
        } catch {
          item.existing_dimensions = "unavailable";
        }
      }
      const sourcePixels = (sourceMetadata.width ?? 0) * (sourceMetadata.height ?? 0);
      item.source_dimensions = `${sourceMetadata.width}x${sourceMetadata.height}`;
      if (sourcePixels > existingPixels * 1.25 && sourcePixels >= 300_000) {
        const output = await sharp(source, { failOn: "error" })
          .rotate()
          .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 86, effort: 4 })
          .toBuffer();
        const localPath = path.join(outputDir, `${event.slug}.webp`);
        await fs.writeFile(localPath, output);
        item.local_path = path.relative(process.cwd(), localPath).replaceAll("\\", "/");

        if (apply) {
          const objectPath = `admin/martialmatch-full-${event.slug}.webp`;
          const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, output, {
            contentType: "image/webp",
            cacheControl: "31536000",
            upsert: true,
          });
          if (uploadError) throw uploadError;
          improvedImageUrl = supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl;
        }
      }
    }

    if (apply && (description || improvedImageUrl)) {
      const changes = {};
      if (description) changes.description = description;
      if (improvedImageUrl) changes.image_url = improvedImageUrl;
      const { error: updateError } = await supabase.from("events").update(changes).eq("id", event.id).is("user_id", null);
      if (updateError) throw updateError;
      item.applied = Object.keys(changes);
    }
    item.status = "ok";
  } catch (caught) {
    item.status = "error";
    item.error = caught instanceof Error ? caught.message : String(caught);
  }
  report.push(item);
  console.log(`${item.status}: ${event.slug}${item.local_path ? " (better image)" : ""}`);
}

await fs.writeFile(
  path.join(outputDir, apply ? "apply-report.json" : "research-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
