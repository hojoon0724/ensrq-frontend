import path from "path";
import { CONFIG } from "./config.js";
import { addAvailablePhotos } from "./lib/add-available-photos.js";
import { checkForMissingFiles } from "./lib/check-missing-files.js";
import { convertToWebp } from "./lib/conversion.js";
import { getFaceFocusPoint, loadFaceApiModels } from "./lib/face-detection.js";
import { moveOriginalFile, normalizeFilename, walkAllImages, walkAllWebpFiles } from "./lib/file-utils.js";
import { buildManifest, writeManifest } from "./lib/manifest.js";

async function main() {
  console.log(CONFIG.dryRun ? "🔍 DRY RUN MODE" : "⚡ Running full image pipeline");

  // Step 1: Load face-api models if needed
  if (CONFIG.detectFaces) {
    console.log("Loading face-api models...");
    await loadFaceApiModels();
  }

  // Step 2: Find all images (JPG/PNG) for processing
  console.log("Finding all images...");
  const jpgImages = await walkAllImages(CONFIG.publicDir);
  const faceFocusMap = new Map();

  // Step 3: Detect faces before conversion
  if (CONFIG.detectFaces) {
    console.log("Running face detection...");
    for (const img of jpgImages) {
      const focus = await getFaceFocusPoint(img);

      // Map focus to the future WebP path
      const dir = path.dirname(img);
      const originalName = path.parse(img).name;
      const normalizedName = normalizeFilename(originalName);
      const webpPath = path.join(dir, normalizedName + ".webp");

      faceFocusMap.set(webpPath, focus);
    }
  }

  // Step 4: Convert all JPG/PNG images to WebP
  console.log("Converting images to WebP...");
  const webpFiles = [];
  for (const img of jpgImages) {
    const webpPath = await convertToWebp(img);
    webpFiles.push(webpPath);
  }

  // Step 5: Collect all WebP files in the public directory
  console.log("Collecting all WebP files...");
  const allWebpFiles = await walkAllWebpFiles(CONFIG.publicDir);

  // Step 6: Build the manifest using detected focus coordinates
  console.log("Building manifest...");
  const manifest = buildManifest(allWebpFiles, faceFocusMap);

  // Step 7: Check for missing files and mark them in the manifest
  console.log("Checking for missing files...");
  const updatedManifest = await checkForMissingFiles(manifest, CONFIG.publicDir);
  await writeManifest(updatedManifest);

  // Step 8: Add available photos to composer and musician JSON files
  console.log("Adding available photos to JSON files...");
  await addAvailablePhotos();

  // Step 9: Move original files to /src/original-jpg/
  console.log("Moving original files...");
  for (const img of jpgImages) {
    await moveOriginalFile(img);
  }

  console.log("\n✅ Pipeline complete!");
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
