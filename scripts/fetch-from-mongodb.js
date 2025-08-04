#!/usr/bin/env node

/**
 * ENSRQ Download Collection Script
 *
 * This script downloads data from a specific MongoDB collection and saves it as JSON files.
 * It creates a timestamped folder in /downloaded/ and saves individual collection data
 * as JSON files, excluding MongoDB metadata fields.
 *
 * Usage:
 *   node scripts/download-collection.js <collectionName>
 *   node scripts/download-collection.js composers
 *   node scripts/download-collection.js venues
 *   node scripts/download-collection.js musicians
 *   node scripts/download-collection.js works
 *   node scripts/download-collection.js concerts
 *   node scripts/download-collection.js seasons
 *   node scripts/download-collection.js instruments
 *   node scripts/download-collection.js all
 *
 * Requirements:
 * - MongoDB instance running
 * - MONGODB_URI environment variable set
 * - mongoose and dotenv packages installed
 */

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env.local") });
dotenv.config({ path: path.join(__dirname, "../.env") });

// Verify the environment variable is loaded
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing");

// Import MongoDB connection and models after environment setup
async function initializeModules() {
  const { default: dbConnect } = await import("../src/lib/mongodb.js");
  const { Composer, Concert, Musician, Season, Venue, Work, Instrument } = await import("../src/models/index.js");

  return { dbConnect, Composer, Concert, Musician, Season, Venue, Work, Instrument };
}

// Downloaded folder path
const DOWNLOADED_DIR = path.join(__dirname, "../src/data/download");

// Collection mapping
const COLLECTION_MAPPING = {
  composers: { model: "Composer", file: "composers.json", icon: "📚" },
  venues: { model: "Venue", file: "venues.json", icon: "🏛️" },
  musicians: { model: "Musician", file: "musicians.json", icon: "🎵" },
  works: { model: "Work", file: "works.json", icon: "🎼" },
  concerts: { model: "Concert", file: "concerts.json", icon: "🎭" },
  seasons: { model: "Season", file: "seasons.json", icon: "📅" },
  instruments: { model: "Instrument", file: "instruments.json", icon: "🎺" },
};

// Fields to exclude from the exported data (MongoDB metadata)
const EXCLUDED_FIELDS = ["_id", "__v", "createdAt", "updatedAt"];

/**
 * Creates a timestamped folder for downloads
 * @returns {string} Path to the timestamped folder
 */
function createTimestampedFolder() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const timestamp = `${year}-${month}-${day}__${hours}${minutes}${seconds}`;
  const timestampedPath = path.join(DOWNLOADED_DIR, timestamp);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(timestampedPath)) {
    fs.mkdirSync(timestampedPath, { recursive: true });
  }

  return timestampedPath;
}

/**
 * Removes MongoDB metadata fields from an object
 * @param {Object} obj - The object to clean
 * @returns {Object} The object without metadata fields
 */
function removeMetadataFields(obj) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  // Convert mongoose document to plain object if needed
  const plainObj = obj.toObject ? obj.toObject() : obj;

  // Create a new object without excluded fields
  const cleaned = {};
  for (const [key, value] of Object.entries(plainObj)) {
    if (!EXCLUDED_FIELDS.includes(key)) {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Writes data to a JSON file
 * @param {string} filePath - Path where to save the file
 * @param {Array|Object} data - Data to save
 * @param {string} collectionName - Name of the collection for logging
 */
function writeJsonFile(filePath, data, collectionName) {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonContent, "utf8");
    console.log(`✅ Saved ${data.length || 1} ${collectionName} records to ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error writing ${collectionName} to file:`, error.message);
    throw error;
  }
}

/**
 * Downloads data from a specific collection and saves it as JSON
 * @param {string} collectionName - Name of the collection to download
 * @param {Object} models - MongoDB models object
 * @param {string} outputDir - Directory where to save the files
 */
async function downloadCollection(collectionName, models, outputDir) {
  const collectionInfo = COLLECTION_MAPPING[collectionName];

  if (!collectionInfo) {
    throw new Error(
      `Unknown collection: ${collectionName}. Available collections: ${Object.keys(COLLECTION_MAPPING).join(", ")}`
    );
  }

  const { model, file, icon } = collectionInfo;
  const Model = models[model];

  console.log(`${icon} Downloading ${collectionName}...`);

  try {
    // Fetch all documents from the collection
    const documents = await Model.find({}).lean(); // Using lean() for better performance with plain objects

    if (!documents || documents.length === 0) {
      console.log(`⚠️  No data found in ${collectionName} collection`);
      return {
        collection: collectionName,
        count: 0,
        success: true,
      };
    }

    // Remove metadata fields from each document
    const cleanedData = documents.map(removeMetadataFields);

    // Save to JSON file
    const outputPath = path.join(outputDir, file);
    writeJsonFile(outputPath, cleanedData, collectionName);

    return {
      collection: collectionName,
      count: cleanedData.length,
      success: true,
      outputPath,
    };
  } catch (error) {
    console.error(`❌ Error downloading ${collectionName}:`, error.message);
    throw error;
  }
}

/**
 * Downloads all collections
 * @param {Object} models - MongoDB models object
 * @param {string} outputDir - Directory where to save the files
 */
async function downloadAllCollections(models, outputDir) {
  const results = [];
  const collectionNames = Object.keys(COLLECTION_MAPPING);

  console.log(`📦 Downloading all ${collectionNames.length} collections...\n`);

  for (const collectionName of collectionNames) {
    try {
      const result = await downloadCollection(collectionName, models, outputDir);
      results.push(result);
    } catch (error) {
      console.error(`❌ Failed to download ${collectionName}:`, error.message);
      results.push({
        collection: collectionName,
        count: 0,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Main function to download collection(s)
 */
async function main() {
  const collectionName = process.argv[2];

  if (!collectionName) {
    console.error("❌ Please specify a collection name or 'all'");
    console.log("Usage: node scripts/download-collection.js <collectionName>");
    console.log("Available collections:", Object.keys(COLLECTION_MAPPING).join(", "), "all");
    process.exit(1);
  }

  if (collectionName !== "all" && !COLLECTION_MAPPING[collectionName]) {
    console.error(`❌ Unknown collection: ${collectionName}`);
    console.log("Available collections:", Object.keys(COLLECTION_MAPPING).join(", "), "all");
    process.exit(1);
  }

  console.log(
    `🚀 Starting download of ${collectionName === "all" ? "all collections" : collectionName} from MongoDB...\n`
  );

  try {
    // Initialize modules
    const { dbConnect, Composer, Concert, Musician, Season, Venue, Work, Instrument } = await initializeModules();

    // Connect to MongoDB
    await dbConnect();
    console.log("✅ Connected to MongoDB\n");

    // Create timestamped output directory
    const outputDir = createTimestampedFolder();
    console.log(`📁 Created output directory: ${path.basename(outputDir)}\n`);

    const models = {
      Composer,
      Concert,
      Musician,
      Season,
      Venue,
      Work,
      Instrument,
    };

    let results;
    if (collectionName === "all") {
      // Download all collections
      results = await downloadAllCollections(models, outputDir);
    } else {
      // Download specific collection
      const result = await downloadCollection(collectionName, models, outputDir);
      results = [result];
    }

    // Print summary
    console.log("\n📊 Download Summary:");
    console.log(`  Output directory: ${path.basename(outputDir)}`);

    let totalRecords = 0;
    let successfulCollections = 0;

    results.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      console.log(`  ${status} ${result.collection}: ${result.count} records`);

      if (result.success) {
        totalRecords += result.count;
        successfulCollections++;
      } else if (result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });

    console.log(`\n📈 Total: ${totalRecords} records from ${successfulCollections}/${results.length} collections`);
    console.log(`📂 Files saved to: ${outputDir}`);

    if (successfulCollections === results.length) {
      console.log(`\n✅ Download completed successfully!`);
    } else {
      console.log(`\n⚠️  Download completed with some errors.`);
    }
  } catch (error) {
    console.error("❌ Error during download process:", error.message);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    if (global.mongoose?.conn) {
      await global.mongoose.conn.disconnect();
      console.log("\n🔌 Disconnected from MongoDB");
    }
    process.exit(0);
  }
}

/**
 * Export functions for use in other scripts
 */
export { COLLECTION_MAPPING, downloadAllCollections, downloadCollection };

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("❌ Unhandled error:", error);
    process.exit(1);
  });
}
