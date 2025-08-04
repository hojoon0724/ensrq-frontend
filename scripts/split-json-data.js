import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for each JSON file and their ID fields
const fileConfigs = {
  "composers.json": "composerId",
  "concerts.json": "concertId",
  "instruments.json": "instrumentId",
  "musicians.json": "musicianId",
  "seasons.json": "seasonId",
  "venues.json": "venueId",
  "works.json": "workId",
};

const sourceDir = path.join(__dirname, "..", "src", "data", "serve");
const outputBaseDir = path.join(__dirname, "..", "src", "data", "split");

function splitJsonFile(filename, idField) {
  const sourceFilePath = path.join(sourceDir, filename);
  const collectionName = path.basename(filename, ".json");
  const outputDir = path.join(outputBaseDir, collectionName);

  console.log(`Processing ${filename}...`);

  // Read the source JSON file
  if (!fs.existsSync(sourceFilePath)) {
    console.error(`Source file not found: ${sourceFilePath}`);
    return;
  }

  let data;
  try {
    const fileContent = fs.readFileSync(sourceFilePath, "utf8");
    data = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading or parsing ${filename}:`, error.message);
    return;
  }

  if (!Array.isArray(data)) {
    console.error(`${filename} does not contain an array`);
    return;
  }

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}`);
  }

  // Split into individual files
  let successCount = 0;
  let errorCount = 0;

  data.forEach((item, index) => {
    const id = item[idField];

    if (!id) {
      console.warn(`Item at index ${index} in ${filename} missing ${idField}`);
      errorCount++;
      return;
    }

    const outputFilePath = path.join(outputDir, `${id}.json`);

    try {
      fs.writeFileSync(outputFilePath, JSON.stringify(item, null, 2));
      successCount++;
    } catch (error) {
      console.error(`Error writing file ${outputFilePath}:`, error.message);
      errorCount++;
    }
  });

  console.log(`✅ ${filename}: ${successCount} files created, ${errorCount} errors`);
}

function main() {
  console.log("Starting JSON file splitting...");
  console.log(`Source directory: ${sourceDir}`);
  console.log(`Output directory: ${outputBaseDir}`);
  console.log("");

  // Create base output directory
  if (!fs.existsSync(outputBaseDir)) {
    fs.mkdirSync(outputBaseDir, { recursive: true });
  }

  // Process each configured file
  Object.entries(fileConfigs).forEach(([filename, idField]) => {
    splitJsonFile(filename, idField);
  });

  console.log("");
  console.log("JSON splitting completed!");
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, splitJsonFile };
