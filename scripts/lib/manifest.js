import fs from "fs";
import fsPromises from "fs/promises";
import sizeOf from "image-size";
import path from "path";
import { CONFIG } from "../config.js";

export function loadExistingManifest() {
  try {
    if (fs.existsSync(CONFIG.manifestFile)) {
      const data = fs.readFileSync(CONFIG.manifestFile, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn(`Could not load manifest: ${err.message}`);
  }
  return {};
}

export async function writeManifest(manifest) {
  if (!CONFIG.dryRun) {
    await fsPromises.mkdir(path.dirname(CONFIG.manifestFile), { recursive: true });
    await fsPromises.writeFile(CONFIG.manifestFile, JSON.stringify(manifest, null, 2));
  }
  console.log(`Manifest written: ${CONFIG.manifestFile}`);
}

export function buildManifest(webpFiles, faceFocusMap = new Map()) {
  const existing = loadExistingManifest();
  const manifest = { ...existing };

  for (const file of webpFiles) {
    try {
      const buffer = fs.readFileSync(file);
      const dimensions = sizeOf(buffer);
      const relativePath = "/" + path.relative(CONFIG.publicDir, file).replace(/\\/g, "/");
      const detectedFocus = faceFocusMap.get(file) || null;

      const finalFocus = existing[relativePath]?.focus || detectedFocus;

      manifest[relativePath] = {
        width: dimensions.width,
        height: dimensions.height,
        type: "webp",
        ...(finalFocus && { focus: finalFocus }),
      };
    } catch (err) {
      console.warn(`Failed to read size for ${file}: ${err.message}`);
    }
  }

  return manifest;
}
