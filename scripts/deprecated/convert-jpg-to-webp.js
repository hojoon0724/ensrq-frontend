import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

// You can modify these directories to target specific folders
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
    await fs.mkdir(outputDir, { recursive: true });

    // Read all files and directories in input directory
    const entries = await fs.readdir(inputDir, { withFileTypes: true });

    for (const entry of entries) {
      const inputPath = path.join(inputDir, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        const subOutputDir = path.join(outputDir, entry.name);
        await processDirectory(inputPath, subOutputDir);
      } else if (entry.isFile()) {
        // Check if it's an image file (support multiple formats)
        const imageExtensions = /\.(jpe?g|png|gif|bmp|tiff?|webp)$/i;

        if (imageExtensions.test(entry.name)) {
          // Skip if already a webp file
          if (path.extname(entry.name).toLowerCase() === ".webp") {
            console.log(`Skipping: ${entry.name} (already WebP)`);
            continue;
          }

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
      await fs.access(baseDir);
      await processDirectory(baseDir);
    } catch (err) {
      console.log(`Directory ${baseDir} does not exist, skipping... (${err.message})`);
    }

    console.log(`Completed processing: ${baseDir}\n`);
  }

  console.log("Image conversion complete!");
}

convertAllImagesToWebp();
