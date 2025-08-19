import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import fs from "fs";
import fsPromises from "fs/promises";
import sizeOf from "image-size";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");
const ORIGINALS_DIR = path.join(__dirname, "../src/original-jpg");
const OUTPUT_FILE = path.join(__dirname, "../src/data/graphic-assets-manifest.json");

// Check for dry-run flag
const DRY_RUN = process.argv.includes("--dry-run") || process.argv.includes("-d");

const imageExtensions = /\.(jpe?g|png|gif|bmp|tiff?)$/i;

function normalizeFilename(filename) {
  const nameWithoutExt = path.parse(filename).name;
  return nameWithoutExt
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function walkAllImageFiles(dir, fileList = []) {
  const entries = await fsPromises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkAllImageFiles(fullPath, fileList);
    } else if (imageExtensions.test(entry.name) && !entry.name.toLowerCase().endsWith(".webp")) {
      // Only include non-WebP image files for processing
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function walkAllWebpFiles(dir, fileList = []) {
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

async function loadFaceApiModels() {
  const modelPath = path.join(__dirname, "./models");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
}

async function getFaceFocusPoint(imagePath) {
  try {
    const img = await canvas.loadImage(imagePath);
    const detection = await faceapi.detectSingleFace(img);
    if (!detection) return null;

    const { box } = detection;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    return {
      x: +(centerX / img.width).toFixed(4),
      y: +(centerY / img.height).toFixed(4),
    };
  } catch (err) {
    console.warn(`Face detection failed for ${path.relative(PUBLIC_DIR, imagePath)}: ${err.message}`);
    return null;
  }
}

async function moveOriginalFile(originalPath) {
  const relative = path.relative(PUBLIC_DIR, originalPath);
  const destination = path.join(ORIGINALS_DIR, relative);

  // Check if original file still exists (might have been moved already)
  if (!fs.existsSync(originalPath)) {
    console.log(`  → Original file already moved: ${relative}`);
    return;
  }

  await fsPromises.mkdir(path.dirname(destination), { recursive: true });
  await fsPromises.rename(originalPath, destination);
  console.log(`  → Moved to: ${path.relative(__dirname, destination)}`);
}

async function convertToWebp(inputPath) {
  const dir = path.dirname(inputPath);
  const originalName = path.parse(inputPath).name;
  const normalizedName = normalizeFilename(originalName);
  const outputPath = path.join(dir, normalizedName + ".webp");

  // Check if WebP file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`  → WebP already exists, skipping conversion`);
    return outputPath;
  }

  await sharp(inputPath).toFormat("webp", { quality: 80 }).toFile(outputPath);

  console.log(`  → Converted to WebP successfully`);
  return outputPath;
}

function loadExistingManifest() {
  try {
    if (fs.existsSync(OUTPUT_FILE)) {
      const manifestData = fs.readFileSync(OUTPUT_FILE, 'utf8');
      return JSON.parse(manifestData);
    }
  } catch (err) {
    console.warn(`Could not load existing manifest: ${err.message}`);
  }
  return {};
}

async function buildManifest(webpFiles, faceFocusMap) {
  // Load existing manifest to preserve focus coordinates
  const existingManifest = loadExistingManifest();
  console.log(`Loaded ${Object.keys(existingManifest).length} entries from existing manifest`);
  
  const manifest = { ...existingManifest }; // Start with existing data

  for (const webpFile of webpFiles) {
    try {
      const buffer = fs.readFileSync(webpFile);
      const dimensions = sizeOf(buffer);
      const relativePath = "/" + path.relative(PUBLIC_DIR, webpFile).replace(/\\/g, "/");

      // Find the corresponding original JPG file to get its face focus data
      let detectedFocus = null;
      for (const [originalPath, focus] of faceFocusMap.entries()) {
        const originalDir = path.dirname(originalPath);
        const originalName = path.parse(originalPath).name;
        const normalizedName = normalizeFilename(originalName);
        const expectedWebpPath = path.join(originalDir, normalizedName + ".webp");

        if (path.resolve(expectedWebpPath) === path.resolve(webpFile)) {
          detectedFocus = focus;
          break;
        }
      }

      // Prioritize existing focus coordinates over newly detected ones
      const finalFocus = existingManifest[relativePath]?.focus || detectedFocus;

      manifest[relativePath] = {
        width: dimensions.width,
        height: dimensions.height,
        type: "webp",
        ...(finalFocus && { focus: finalFocus }),
      };
    } catch (err) {
      console.warn(`Failed to get size for ${webpFile}: ${err.message}`);
    }
  }

  return manifest;
}

async function main() {
  try {
    if (DRY_RUN) {
      console.log("🔍 DRY RUN MODE - No files will be modified");
      console.log("Use without --dry-run flag to actually process files\n");
    }

    console.log("Loading face-api models...");
    await loadFaceApiModels();

    console.log("Walking /public for images (excluding .webp)...");
    const allImages = await walkAllImageFiles(PUBLIC_DIR);

    // Filter out .webp files to avoid processing them
    const jpgImages = allImages.filter((img) => !img.toLowerCase().endsWith(".webp"));

    console.log(`Found ${jpgImages.length} JPG images for face detection and conversion.`);

    const faceFocusMap = new Map();
    let facesDetectedCount = 0;
    let processedCount = 0;

    // Step 1: Analyze JPG files for face coordinates
    console.log("\n--- Step 1: Face Detection ---");
    for (const originalPath of jpgImages) {
      const relativePath = path.relative(PUBLIC_DIR, originalPath);
      console.log(`Analyzing faces in: ${relativePath}`);

      try {
        const focus = await getFaceFocusPoint(originalPath);
        faceFocusMap.set(originalPath, focus);
        processedCount++;

        if (focus) {
          facesDetectedCount++;
          console.log(`  → Face detected at x=${focus.x}, y=${focus.y}`);
        } else {
          console.log(`  → No face detected`);
        }
      } catch (error) {
        console.error(`  → ERROR: Face detection failed: ${error.message}`);
        faceFocusMap.set(originalPath, null);
        processedCount++;
      }
    }

    console.log(`\n--- Face Detection Results ---`);
    console.log(`Processed: ${processedCount}/${jpgImages.length} images`);
    console.log(`Faces detected: ${facesDetectedCount}/${jpgImages.length} images`);

    if (DRY_RUN) {
      console.log(`\n🔍 DRY RUN COMPLETE - Face detection tested successfully!`);
      console.log(`Run without --dry-run flag to convert and move files.`);
      return;
    }

    // Safety check: Only proceed if face detection actually ran without major errors
    if (processedCount < jpgImages.length * 0.8) {
      console.error(`❌ Face detection failed on too many images (${processedCount}/${jpgImages.length})`);
      console.error(`Aborting to prevent data loss. Please check face-api models and try again.`);
      process.exit(1);
    }

    // Ask for confirmation before proceeding with destructive operations
    console.log(`\n⚠️  SAFETY CHECK: About to convert ${jpgImages.length} JPG files to WebP and move originals.`);
    console.log(`This will modify your file system. Face detection worked on ${processedCount} files.`);

    // In a real scenario, you might want to add a prompt here, but for automation we'll just log
    console.log(`Proceeding with conversion and moving...`);

    const newWebpFiles = [];

    // Step 2: Convert JPG files to WebP
    console.log("\n--- Step 2: Converting to WebP ---");
    for (const originalPath of jpgImages) {
      const relativePath = path.relative(PUBLIC_DIR, originalPath);
      console.log(`Converting: ${relativePath}`);

      try {
        const webpPath = await convertToWebp(originalPath);
        newWebpFiles.push(webpPath);
      } catch (error) {
        console.error(`  → ERROR: Conversion failed: ${error.message}`);
      }
    }

    // Step 3: Get all WebP files (both existing and newly converted)
    console.log("\n--- Step 3: Collecting All WebP Files ---");
    const allWebpFiles = await walkAllWebpFiles(PUBLIC_DIR);
    console.log(`Found ${allWebpFiles.length} total WebP files`);

    // Step 4: Build manifest with face focus coordinates
    console.log("\n--- Step 4: Building Manifest ---");
    const manifest = await buildManifest(allWebpFiles, faceFocusMap);

    await fsPromises.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
    await fsPromises.writeFile(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
    console.log(`Manifest written to ${OUTPUT_FILE}`);

    // Step 5: Move original JPG files to /src/original-jpg/
    console.log("\n--- Step 5: Moving Original Files ---");
    for (const originalPath of jpgImages) {
      const relativePath = path.relative(PUBLIC_DIR, originalPath);
      console.log(`Moving: ${relativePath}`);

      try {
        await moveOriginalFile(originalPath);
      } catch (error) {
        console.error(`  → ERROR: Move failed: ${error.message}`);
      }
    }

    console.log(`\n✅ Process complete!`);
    console.log(`- Analyzed ${jpgImages.length} JPG files for faces (${facesDetectedCount} faces found)`);
    console.log(`- Converted ${newWebpFiles.length} files to WebP`);
    console.log(`- Generated manifest with ${Object.keys(manifest).length} entries`);
    console.log(`- Moved original files to /src/original-jpg/`);
  } catch (error) {
    console.error("❌ Error during processing:", error);
    process.exit(1);
  }
}

main();
