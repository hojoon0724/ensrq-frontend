import { CONFIG } from "./config.js";
import { walkAllImages, walkAllWebpFiles, moveOriginalFile, normalizeFilename } from "./lib/file-utils.js";
import { convertToWebp } from "./lib/conversion.js";
import { buildManifest, writeManifest } from "./lib/manifest.js";
import { loadFaceApiModels, getFaceFocusPoint } from "./lib/face-detection.js";

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
  await writeManifest(manifest);

  // Step 7: Move original files to /src/original-jpg/
  console.log("Moving original files...");
  for (const img of jpgImages) {
    await moveOriginalFile(img);
  }

  console.log("\n✅ Pipeline complete!");
}

main().catch(err => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
