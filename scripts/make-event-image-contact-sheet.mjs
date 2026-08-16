import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve(process.argv[2] || "data/admin-event-images-source");
const files = fs.readdirSync(dir).filter((name) => name.endsWith(".webp"));
const width = 300;
const height = 210;
const columns = 5;
const rows = Math.ceil(files.length / columns);
const composites = [];

for (const [index, file] of files.entries()) {
  const left = (index % columns) * width;
  const top = Math.floor(index / columns) * height;
  const image = await sharp(path.join(dir, file))
    .resize(width, height - 35, { fit: "contain", background: "#18181b" })
    .png()
    .toBuffer();
  const safeLabel = file.slice(0, 38).replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  const label = Buffer.from(
    `<svg width="${width}" height="35"><rect width="100%" height="100%" fill="#111"/><text x="8" y="22" fill="white" font-size="11" font-family="Arial">${safeLabel}</text></svg>`,
  );
  composites.push({ input: image, left, top });
  composites.push({ input: label, left, top: top + height - 35 });
}

await sharp({
  create: {
    width: columns * width,
    height: rows * height,
    channels: 3,
    background: "#18181b",
  },
})
  .composite(composites)
  .jpeg({ quality: 88 })
  .toFile(path.join(dir, "contact-sheet.jpg"));

console.log(`Created contact sheet for ${files.length} images.`);
