import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { CONFIG } from "../config.js";

export function normalizeFilename(filename) {
  const nameWithoutExt = path.parse(filename).name;
  return nameWithoutExt
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function walkAllImages(dir, exts = /\.(jpe?g|png|gif|bmp|tiff?)$/i, fileList = []) {
  const entries = await fsPromises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkAllImages(fullPath, exts, fileList);
    } else if (exts.test(entry.name) && !entry.name.toLowerCase().endsWith(".webp")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export async function walkAllWebpFiles(dir, fileList = []) {
  const entries = await fsPromises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkAllWebpFiles(fullPath, fileList);
    } else if (entry.name.toLowerCase().endsWith(".webp")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export async function moveOriginalFile(originalPath) {
  const relative = path.relative(CONFIG.publicDir, originalPath);
  const destination = path.join(CONFIG.originalsDir, relative);

  if (!fs.existsSync(originalPath)) {
    console.log(`  → Original file already moved: ${relative}`);
    return;
  }

  if (!CONFIG.dryRun) {
    await fsPromises.mkdir(path.dirname(destination), { recursive: true });
    await fsPromises.rename(originalPath, destination);
  }
  console.log(`  → Moved: ${relative} → /src/original-jpg/${relative}`);
}
