import "server-only";

import { randomUUID } from "crypto";
import sharp from "sharp";
import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "event-images";
const MAX_INPUT_SIZE = 5 * 1024 * 1024;
const MAX_INPUT_DIMENSION = 8_000;
const MAX_OUTPUT_DIMENSION = 1_920;
const WEBP_QUALITY = 82;

type ImageOwner =
  { kind: "user"; userId: string } | { kind: "admin" } | { kind: "submission" };

function imagePrefix(owner: ImageOwner): string {
  if (owner.kind === "user") {
    if (!/^[0-9a-f-]{36}$/i.test(owner.userId)) {
      throw new Error("Invalid image owner.");
    }
    return `users/${owner.userId}`;
  }
  return owner.kind === "admin" ? "admin" : "submissions";
}

export function hasSupportedImageSignature(buffer: Buffer): boolean {
  const isJpeg =
    buffer.length >= 3 &&
    buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  const isPng =
    buffer.length >= 8 &&
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp =
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";
  return isJpeg || isPng || isWebp;
}

export function isAllowedEventImageUrl(value: string): boolean {
  if (!value) return false;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return false;

  try {
    const url = new URL(value);
    const expected = new URL(baseUrl);
    return (
      url.protocol === "https:" &&
      url.origin === expected.origin &&
      url.pathname.startsWith(`/storage/v1/object/public/${BUCKET}/`)
    );
  } catch {
    return false;
  }
}

export function preserveEventImageUrl(
  value: FormDataEntryValue | null,
): string | null {
  const url = typeof value === "string" ? value.trim() : "";
  if (!url) return null;
  if (!isAllowedEventImageUrl(url)) {
    throw new Error("Invalid existing image URL.");
  }
  return url;
}

export async function deleteEventImageObject(
  supabase: SupabaseClient,
  value: string,
): Promise<void> {
  if (!isAllowedEventImageUrl(value)) return;

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const pathname = new URL(value).pathname;
  const markerIndex = pathname.indexOf(marker);
  if (markerIndex < 0) return;

  const objectPath = decodeURIComponent(
    pathname.slice(markerIndex + marker.length),
  );
  if (!objectPath || objectPath.includes("..")) return;

  const { error } = await supabase.storage.from(BUCKET).remove([objectPath]);
  if (error) throw new Error("Could not remove the previous image.");
}

export async function uploadEventImage(
  supabase: SupabaseClient,
  file: File,
  owner: ImageOwner,
): Promise<string> {
  if (file.size <= 0 || file.size > MAX_INPUT_SIZE) {
    throw new Error("Image must be smaller than 5 MB.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  if (!hasSupportedImageSignature(input)) {
    throw new Error("Only valid JPEG, PNG and WebP images are allowed.");
  }

  let metadata: sharp.Metadata;
  try {
    metadata = await sharp(input, {
      failOn: "error",
      limitInputPixels: 64_000_000,
    }).metadata();
  } catch {
    throw new Error("The uploaded image is corrupted or unsupported.");
  }

  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width > MAX_INPUT_DIMENSION ||
    metadata.height > MAX_INPUT_DIMENSION
  ) {
    throw new Error("Image dimensions must not exceed 8000 × 8000 px.");
  }

  const output = await sharp(input, {
    failOn: "error",
    limitInputPixels: 64_000_000,
  })
    .rotate()
    .resize({
      width: MAX_OUTPUT_DIMENSION,
      height: MAX_OUTPUT_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  const path = `${imagePrefix(owner)}/${randomUUID()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, output, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) throw new Error("Could not upload the image. Please try again.");

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
