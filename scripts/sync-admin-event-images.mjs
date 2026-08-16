import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const upload = process.argv.includes("--upload");
const outputDir = path.resolve("data/admin-event-images-source");
const bucket = "event-images";
const excludedGenericSlugs = new Set([
  "adcc-polish-cup-2026",
  "fall-open-2026",
  "iii-bjj-colored-belts-championships",
  "sigma-league-viii-2026",
  "winter-open-2026",
]);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function metaImage(html, baseUrl) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const key of ["og:image", "twitter:image", "twitter:image:src"]) {
    for (const tag of tags) {
      const property = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1];
      if (property?.toLowerCase() !== key) continue;
      const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
      if (content) return new URL(decodeHtml(content), baseUrl).href;
    }
  }
  return null;
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 WolnaMata event image verifier" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

await fs.mkdir(outputDir, { recursive: true });

const { data: events, error } = await supabase
  .from("events")
  .select("id,slug,title,registration_url")
  .is("user_id", null)
  .is("image_url", null)
  .not("registration_url", "is", null)
  .order("date");
if (error) throw error;

const results = [];
for (const event of events) {
  const result = { slug: event.slug, title: event.title, status: "skipped" };
  try {
    if (excludedGenericSlugs.has(event.slug)) {
      throw new Error("generic source placeholder rejected during visual review");
    }
    const pageResponse = await fetch(event.registration_url, {
      headers: { "user-agent": "Mozilla/5.0 WolnaMata event image verifier" },
      redirect: "follow",
    });
    if (!pageResponse.ok) throw new Error(`page HTTP ${pageResponse.status}`);
    const html = await pageResponse.text();
    const imageUrl = metaImage(html, pageResponse.url);
    if (!imageUrl) throw new Error("no social preview image");

    const input = await fetchBuffer(imageUrl);
    const metadata = await sharp(input, { failOn: "error" }).metadata();
    if (!metadata.width || !metadata.height || metadata.width < 120 || metadata.height < 68) {
      throw new Error(`image too small: ${metadata.width}x${metadata.height}`);
    }

    const output = await sharp(input, { failOn: "error" })
      .rotate()
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
    const localPath = path.join(outputDir, `${event.slug}.webp`);
    await fs.writeFile(localPath, output);

    result.status = "downloaded";
    result.source_image_url = imageUrl;
    result.width = metadata.width;
    result.height = metadata.height;
    result.local_path = path.relative(process.cwd(), localPath).replaceAll("\\", "/");

    if (upload) {
      const objectPath = `admin/researched-${event.slug}.webp`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(objectPath, output, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: true,
        });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      const { error: updateError } = await supabase
        .from("events")
        .update({ image_url: data.publicUrl })
        .eq("id", event.id)
        .is("user_id", null)
        .is("image_url", null);
      if (updateError) throw updateError;
      result.status = "uploaded";
      result.public_url = data.publicUrl;
    }
  } catch (caught) {
    result.status = "error";
    result.error = caught instanceof Error ? caught.message : String(caught);
  }
  results.push(result);
  console.log(`${result.status}: ${event.slug}${result.error ? ` (${result.error})` : ""}`);
}

await fs.writeFile(
  path.join(outputDir, upload ? "upload-report.json" : "download-report.json"),
  `${JSON.stringify(results, null, 2)}\n`,
);
