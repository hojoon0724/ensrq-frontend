import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const inputDir = path.resolve("./public/photos/flip-game-photos");
const outputDir = path.resolve("./public/photos/flip-game-photos/webp");

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

async function convertJpgToWebp() {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Read all files in input directory
  const files = await fs.readdir(inputDir);

  // Filter jpg/jpeg files
  const jpgFiles = files.filter((file) => /\.(jpe?g)$/i.test(file));

  for (const file of jpgFiles) {
    const inputPath = path.join(inputDir, file);
    const normalizedName = normalizeFilename(file);
    const outputFileName = `${normalizedName}.webp`;
    const outputPath = path.join(outputDir, outputFileName);

    try {
      await sharp(inputPath).toFormat("webp").toFile(outputPath);
      console.log(`Converted: ${file} → ${outputFileName}`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
}

convertJpgToWebp();
