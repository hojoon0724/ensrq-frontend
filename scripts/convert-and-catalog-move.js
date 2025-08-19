// Combined script to convert images to WebP and generate a manifest of WebP files with their dimensions
import fs from "fs";
import fsPromises from "fs/promises";
import sizeOf from "image-size";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");
const ORIGINALS_DIR = path.join(__dirname, "../src/original-jpg");
const OUTPUT_FILE = path.join(__dirname, "../src/data/graphic-assets-manifest.json");

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

async function processDirectory(inputDir, outputDir = inputDir, convertedFiles = []) {
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
        await processDirectory(inputPath, subOutputDir, convertedFiles);
      } else if (entry.isFile()) {
        // Check if it's an image file (support multiple formats)
        const imageExtensions = /\.(jpe?g|png|gif|bmp|tiff?)$/i;

        if (imageExtensions.test(entry.name) && !entry.name.toLowerCase().endsWith(".webp")) {
          const normalizedName = normalizeFilename(entry.name);
          const outputFileName = `${normalizedName}.webp`;
          const outputPath = path.join(outputDir, outputFileName);

          // Check if WebP file already exists
          if (fs.existsSync(outputPath)) {
            console.log(`Skipping: ${entry.name} (WebP already exists)`);
            // Still track this as a converted file for potential moving
            convertedFiles.push(inputPath);
          } else {
            try {
              await sharp(inputPath)
                .toFormat("webp", { quality: 80 }) // You can adjust quality (0-100)
                .toFile(outputPath);
              console.log(
                `Converted: ${path.relative(process.cwd(), inputPath)} → ${path.relative(process.cwd(), outputPath)}`
              );
              // Track the original file for moving
              convertedFiles.push(inputPath);
            } catch (err) {
              console.error(`Error converting ${entry.name}:`, err.message);
            }
          }
        } else if (path.extname(entry.name).toLowerCase() === ".webp") {
          console.log(`Skipping: ${entry.name} (already WebP)`);
        }
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${inputDir}:`, err.message);
  }

  return convertedFiles;
}

async function convertAllImagesToWebp() {
  console.log("Starting image conversion to WebP...\n");

  const allConvertedFiles = [];

  for (const baseDir of baseDirs) {
    console.log(`Processing directory: ${baseDir}`);

    try {
      // Check if directory exists
      await fsPromises.access(baseDir);
      const convertedFiles = await processDirectory(baseDir);
      allConvertedFiles.push(...convertedFiles);
    } catch (err) {
      console.log(`Directory ${baseDir} does not exist, skipping... (${err.message})`);
    }

    console.log(`Completed processing: ${baseDir}\n`);
  }

  console.log("Image conversion complete!\n");
  return allConvertedFiles;
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

function buildManifest(imageFiles) {
  // Load existing manifest to preserve focus coordinates
  const existingManifest = loadExistingManifest();
  console.log(`Loaded ${Object.keys(existingManifest).length} entries from existing manifest`);
  
  const manifest = { ...existingManifest }; // Start with existing data
  
  for (const file of imageFiles) {
    try {
      const buffer = fs.readFileSync(file);
      const dimensions = sizeOf(buffer);
      const relativePath = getRelativePublicPath(file);
      
      // Merge new data with existing entry (preserving focus if it exists)
      manifest[relativePath] = {
        width: dimensions.width,
        height: dimensions.height,
        type: "webp",
        ...(existingManifest[relativePath]?.focus && { focus: existingManifest[relativePath].focus })
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
    const convertedFiles = await convertAllImagesToWebp();

    // Step 2: Create manifest of WebP files
    createWebpManifest();

    // Step 3: Move original files to /src/original-jpg/
    if (convertedFiles.length > 0) {
      console.log("\n--- Step 3: Moving Original Files ---");
      for (const originalPath of convertedFiles) {
        const relativePath = path.relative(PUBLIC_DIR, originalPath);
        console.log(`Moving: ${relativePath}`);

        try {
          await moveOriginalFile(originalPath);
        } catch (error) {
          console.error(`  → ERROR: Move failed: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Process complete!`);
    console.log(`- Converted ${convertedFiles.length} files to WebP`);
    console.log(`- Generated manifest with WebP files`);
    if (convertedFiles.length > 0) {
      console.log(`- Moved ${convertedFiles.length} original files to /src/original-jpg/`);
    }
  } catch (error) {
    console.error("❌ Error during processing:", error.message);
    process.exit(1);
  }
}

main();
