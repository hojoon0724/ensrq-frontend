import path from "path";
import { CONFIG } from "./config.js";
import { addAvailablePhotos } from "./lib/add-available-photos.js";
import { checkForMissingFiles } from "./lib/check-missing-files.js";
import { convertToWebp } from "./lib/conversion.js";
import { getFaceFocusPoint, loadFaceApiModels } from "./lib/face-detection.js";
import { moveOriginalFile, normalizeFilename, walkAllImages, walkAllWebpFiles } from "./lib/file-utils.js";
import { buildManifest, writeManifest } from "./lib/manifest.js";

// Helper function to filter files that are only in subdirectories
function filterSubdirectoryFiles(files, publicDir) {
  return files.filter((file) => {
    const relativePath = path.relative(publicDir, file);
    const pathParts = relativePath.split(path.sep);
    // Only include files that are at least 2 levels deep (folder/file.ext)
    return pathParts.length >= 2;
  });
}

async function main() {
  console.log(CONFIG.dryRun ? "🔍 DRY RUN MODE" : "⚡ Running full image pipeline");
  console.log("📁 Processing only files in subdirectories of /public/");

  // Step 1: Load face-api models if needed
  if (CONFIG.detectFaces) {
    console.log("Loading face-api models...");
    await loadFaceApiModels();
  }

  // Step 2: Find all images (JPG/PNG) for processing, but only in subdirectories
  console.log("Finding all images in subdirectories...");
  const allJpgImages = await walkAllImages(CONFIG.publicDir);
  const jpgImages = filterSubdirectoryFiles(allJpgImages, CONFIG.publicDir);
  console.log(
    `Found ${jpgImages.length} images in subdirectories (${allJpgImages.length - jpgImages.length} root files excluded)`
  );

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
  const convertedWebpFiles = [];
  for (const img of jpgImages) {
    const webpPath = await convertToWebp(img);
    convertedWebpFiles.push(webpPath);
  }

  // Step 5: Collect all WebP files in the public directory, but only from subdirectories
  console.log("Collecting all WebP files...");
  const allWebpFiles = await walkAllWebpFiles(CONFIG.publicDir);
  const webpFiles = filterSubdirectoryFiles(allWebpFiles, CONFIG.publicDir);
  console.log(`Found ${webpFiles.length} WebP files in subdirectories`);

  // Step 6: Build the manifest using detected focus coordinates
  console.log("Building manifest...");
  const manifest = buildManifest(webpFiles, faceFocusMap);

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
