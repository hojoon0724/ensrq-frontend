import sharp from "sharp";
import fs from "fs";
import path from "path";
import { normalizeFilename } from "./file-utils.js";
import { CONFIG } from "../config.js";

export async function convertToWebp(inputPath) {
  const dir = path.dirname(inputPath);
  const originalName = path.parse(inputPath).name;
  const normalizedName = normalizeFilename(originalName);
  const outputPath = path.join(dir, normalizedName + ".webp");

  if (fs.existsSync(outputPath)) {
    console.log(`  → WebP exists, skipping: ${path.relative(CONFIG.publicDir, outputPath)}`);
    return outputPath;
  }

  if (!CONFIG.dryRun) {
    await sharp(inputPath).toFormat("webp", { quality: CONFIG.webpQuality }).toFile(outputPath);
  }

  console.log(`  → Converted: ${path.relative(CONFIG.publicDir, inputPath)} → ${normalizedName}.webp`);
  return outputPath;
}
