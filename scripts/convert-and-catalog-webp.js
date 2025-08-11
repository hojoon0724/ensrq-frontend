// Combined script to convert images to WebP and generate a manifest of WebP files with their dimensions
import fs from "fs";
import fsPromises from "fs/promises";
import sizeOf from "image-size";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");
const OUTPUT_FILE = path.join(__dirname, "../src/data/photo-manifest.json");

// Directories to process for image conversion
const baseDirs = [path.resolve("./public/photos/"), path.resolve("./public/graphics/")];

function normalizeFilename(filename) {
  // Get the name without extension
  const nameWithoutExt = path.parse(filename).name;

  return nameWithoutExt
    .toLowerCase() // Convert to lowercase
    .replace(/_/g, "-") // Replace underscores with hyphens
    .replace(/[^a-z0-9-]/g, "-") // Replace any non-alphanumeric, non-hyphen characters with hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading and trailing hyphens
}

async function processDirectory(inputDir, outputDir = inputDir) {
  try {
    // Ensure output directory exists
    await fsPromises.mkdir(outputDir, { recursive: true });

    // Read all files and directories in input directory
    const entries = await fsPromises.readdir(inputDir, { withFileTypes: true });

    for (const entry of entries) {
      const inputPath = path.join(inputDir, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        const subOutputDir = path.join(outputDir, entry.name);
        await processDirectory(inputPath, subOutputDir);
      } else if (entry.isFile()) {
        // Check if it's an image file (support multiple formats)
        const imageExtensions = /\.(jpe?g|png|gif|bmp|tiff?)$/i;

        if (imageExtensions.test(entry.name)) {
          const normalizedName = normalizeFilename(entry.name);
          const outputFileName = `${normalizedName}.webp`;
          const outputPath = path.join(outputDir, outputFileName);

          try {
            await sharp(inputPath)
              .toFormat("webp", { quality: 80 }) // You can adjust quality (0-100)
              .toFile(outputPath);
            console.log(
              `Converted: ${path.relative(process.cwd(), inputPath)} → ${path.relative(process.cwd(), outputPath)}`
            );
          } catch (err) {
            console.error(`Error converting ${entry.name}:`, err.message);
          }
        } else if (path.extname(entry.name).toLowerCase() === ".webp") {
          console.log(`Skipping: ${entry.name} (already WebP)`);
        }
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${inputDir}:`, err.message);
  }
}

async function convertAllImagesToWebp() {
  console.log("Starting image conversion to WebP...\n");

  for (const baseDir of baseDirs) {
    console.log(`Processing directory: ${baseDir}`);

    try {
      // Check if directory exists
      await fsPromises.access(baseDir);
      await processDirectory(baseDir);
    } catch (err) {
      console.log(`Directory ${baseDir} does not exist, skipping... (${err.message})`);
    }

    console.log(`Completed processing: ${baseDir}\n`);
  }

  console.log("Image conversion complete!\n");
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (isWebpFile(fullPath)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function isWebpFile(filePath) {
  return path.extname(filePath).toLowerCase() === ".webp";
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
      manifest[getRelativePublicPath(file)] = {
        width: dimensions.width,
        height: dimensions.height,
        type: "webp",
      };
    } catch (err) {
      console.warn(`Could not get size for ${file}: ${err.message}`);
    }
  }
  return manifest;
}

function createWebpManifest() {
  console.log("Creating WebP manifest...\n");

  const webpFiles = walkDir(PUBLIC_DIR);
  const manifest = buildManifest(webpFiles);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`Manifest written to ${OUTPUT_FILE}`);
  console.log(`Cataloged ${Object.keys(manifest).length} WebP files`);
}

async function main() {
  try {
    // Step 1: Convert all images to WebP
    await convertAllImagesToWebp();

    // Step 2: Create manifest of WebP files
    createWebpManifest();

    console.log("\n✅ Process complete! All images converted to WebP and manifest created.");
  } catch (error) {
    console.error("❌ Error during processing:", error.message);
    process.exit(1);
  }
}

main();
