// Script to generate a manifest of all image files in /public with their dimensions
import fs from "fs";
import sizeOf from "image-size";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");
const OUTPUT_FILE = path.join(__dirname, "../src/data/graphic-assets-manifest.json");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function isImageFile(filePath) {
  return IMAGE_EXTENSIONS.includes(path.extname(filePath).toLowerCase());
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (isImageFile(fullPath)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function getRelativePublicPath(absPath) {
  return `/${path.relative(PUBLIC_DIR, absPath).replace(/\\/g, "/")}`;
}

function buildManifest(imageFiles) {
  const manifest = {};
  for (const file of imageFiles) {
    try {
      const buffer = fs.readFileSync(file);
      const dimensions = sizeOf(buffer);
      const fileExtension = path.extname(file).toLowerCase().substring(1); // Remove the dot
      manifest[getRelativePublicPath(file)] = {
        width: dimensions.width,
        height: dimensions.height,
        type: fileExtension === "jpg" ? "jpeg" : fileExtension, // Normalize jpg to jpeg
      };
    } catch (err) {
      console.warn(`Could not get size for ${file}: ${err.message}`);
    }
  }
  return manifest;
}
function main() {
  const imageFiles = walkDir(PUBLIC_DIR);
  const manifest = buildManifest(imageFiles);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`Manifest written to ${OUTPUT_FILE}`);
}

main();
