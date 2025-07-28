#!/usr/bin/env node

/**
 * ENSRQ MongoDB Population Script
 *
 * This script populates the MongoDB database with ENSRQ data from JSON files.
 * It reads data from the following sources:
 * - /composers/*.json → composers collection
 * - /venues/*.json → venues collection
 * - /musicians/*.json → musicians collection
 * - /works/*.json → works collection
 * - /concerts/*.json → concerts collection
 * - /seasons.json → seasons collection
 *
 * Usage: npm run populate-db
 *
 * Requirements:
 * - MongoDB instance running
 * - MONGODB_URI environment variable set
 * - mongoose and dotenv packages installed
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dbConnect from "../../lib/mongodb.js";
import { Composer, Concert, Musician, Season, Venue, Work } from "../../models/index.js";

// ES6 module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base data directory
const DATA_DIR = path.join(__dirname, "..");

/**
 * Reads all JSON files from a directory
 * @param {string} dirPath - Directory path
 * @returns {Array} Array of parsed JSON objects
 */
function readJsonFiles(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    return jsonFiles
      .map((file) => {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, "utf8");
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.error(`Error parsing JSON file ${file}:`, parseError.message);
          return null;
        }
      })
      .filter(Boolean); // Remove null entries from failed parses
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
    return [];
  }
}

/**
 * Populates composers collection
 */
async function populateComposers() {
  console.log("🎼 Populating composers...");

  const composersDir = path.join(DATA_DIR, "composers");
  const composersData = readJsonFiles(composersDir);

  if (composersData.length === 0) {
    console.log("No composer data found");
    return;
  }

  try {
    // Clear existing composers
    await Composer.deleteMany({});
    console.log("Cleared existing composers");

    // Insert new composers
    const result = await Composer.insertMany(composersData, { ordered: false });
    console.log(`✅ Inserted ${result.length} composers`);
  } catch (error) {
    console.error("Error populating composers:", error.message);
    // Continue with other collections even if this fails
  }
}

/**
 * Populates venues collection
 */
async function populateVenues() {
  console.log("🏛️ Populating venues...");

  const venuesDir = path.join(DATA_DIR, "venues");
  const venuesData = readJsonFiles(venuesDir);

  if (venuesData.length === 0) {
    console.log("No venue data found");
    return;
  }

  try {
    // Clear existing venues
    await Venue.deleteMany({});
    console.log("Cleared existing venues");

    // Insert new venues
    const result = await Venue.insertMany(venuesData, { ordered: false });
    console.log(`✅ Inserted ${result.length} venues`);
  } catch (error) {
    console.error("Error populating venues:", error.message);
  }
}

/**
 * Populates musicians collection
 */
async function populateMusicians() {
  console.log("🎵 Populating musicians...");

  const musiciansDir = path.join(DATA_DIR, "musicians");
  const musiciansData = readJsonFiles(musiciansDir);

  if (musiciansData.length === 0) {
    console.log("No musician data found");
    return;
  }

  try {
    // Clear existing musicians
    await Musician.deleteMany({});
    console.log("Cleared existing musicians");

    // Insert new musicians
    const result = await Musician.insertMany(musiciansData, { ordered: false });
    console.log(`✅ Inserted ${result.length} musicians`);
  } catch (error) {
    console.error("Error populating musicians:", error.message);
  }
}

/**
 * Populates works collection
 */
async function populateWorks() {
  console.log("🎶 Populating works...");

  const worksDir = path.join(DATA_DIR, "works");
  const worksData = readJsonFiles(worksDir);

  if (worksData.length === 0) {
    console.log("No work data found");
    return;
  }

  try {
    // Clear existing works
    await Work.deleteMany({});
    console.log("Cleared existing works");

    // Insert new works
    const result = await Work.insertMany(worksData, { ordered: false });
    console.log(`✅ Inserted ${result.length} works`);
  } catch (error) {
    console.error("Error populating works:", error.message);
  }
}

/**
 * Populates seasons collection
 */
async function populateSeasons() {
  console.log("📅 Populating seasons...");

  const seasonsFilePath = path.join(DATA_DIR, "seasons.json");

  try {
    const seasonsContent = fs.readFileSync(seasonsFilePath, "utf8");
    const seasonsData = JSON.parse(seasonsContent);

    // Clear existing seasons
    await Season.deleteMany({});
    console.log("Cleared existing seasons");

    // Transform seasons data into individual season documents
    const seasonDocuments = Object.entries(seasonsData).map(([seasonId, concertIds]) => ({
      seasonId,
      season: seasonId, // Add the required 'season' field
      concerts: concertIds, // Use 'concerts' instead of 'concertIds' to match schema
    }));

    // Insert new seasons
    const result = await Season.insertMany(seasonDocuments, { ordered: false });
    console.log(`✅ Inserted ${result.length} seasons`);
  } catch (error) {
    console.error("Error populating seasons:", error.message);
  }
}

/**
 * Populates concerts collection
 */
async function populateConcerts() {
  console.log("🎪 Populating concerts...");

  const concertsDir = path.join(DATA_DIR, "concerts");
  const concertsData = readJsonFiles(concertsDir);

  if (concertsData.length === 0) {
    console.log("No concert data found");
    return;
  }

  try {
    // Clear existing concerts
    await Concert.deleteMany({});
    console.log("Cleared existing concerts");

    // Process concerts to ensure proper data format
    const processedConcerts = concertsData.map((concert) => {
      // Convert date string to Date object if it's a string
      if (typeof concert.date === "string") {
        concert.date = new Date(concert.date);
      }

      // Extract season ID from concert ID (e.g., "s01-2016-10-10-locals" -> "s01")
      if (concert.concertId) {
        const seasonMatch = concert.concertId.match(/^(s\d+)/);
        if (seasonMatch) {
          concert.seasonId = seasonMatch[1];
        }
      }

      // Transform ticketsLinks from array to object format expected by schema
      if (Array.isArray(concert.ticketsLinks)) {
        concert.ticketsLinks = {
          singleLive: {},
          singleStreaming: {},
          seasonPass: {},
        };
      }

      // Transform performers to match schema
      // Current format: [{"workId": {}}]
      // Expected format: [{workId: "workId", instruments: []}]
      if (concert.performers && Array.isArray(concert.performers)) {
        concert.performers = concert.performers.map((performer) => {
          // Handle the case where performer is an object with workId as key
          if (typeof performer === "object" && !performer.workId) {
            const workId = Object.keys(performer)[0];
            return {
              workId: workId,
              instruments: [], // Empty instruments array for now
            };
          }
          return performer; // Keep as-is if already in correct format
        });
      }

      // Sanitize program items to ensure boolean values for is_premiere and is_commission
      if (concert.program && Array.isArray(concert.program)) {
        concert.program = concert.program.map((item) => {
          // Convert string commission info to boolean
          if (typeof item.is_commission === "string") {
            const originalCommissionInfo = item.is_commission;
            item.is_commission = originalCommissionInfo.toLowerCase().includes("commission");
            // Store the original string value in notes if not already present
            if (!item.notes && originalCommissionInfo) {
              item.notes = originalCommissionInfo; // Store original commission info
            }
          }
          // Convert string premiere info to boolean
          if (typeof item.is_premiere === "string") {
            const originalPremiereInfo = item.is_premiere;
            item.is_premiere = originalPremiereInfo.toLowerCase().includes("premiere");
            // Store the original string value in notes if not already present
            if (!item.notes && originalPremiereInfo) {
              item.notes = originalPremiereInfo; // Store original premiere info
            }
          }
          return item;
        });
      }

      return concert;
    });

    // Insert new concerts with error handling for individual documents
    let insertedCount = 0;
    let errors = [];

    for (const concert of processedConcerts) {
      try {
        await Concert.create(concert);
        insertedCount++;
      } catch (error) {
        errors.push({
          concertId: concert.concertId,
          error: error.message,
        });
      }
    }

    console.log(`✅ Inserted ${insertedCount} concerts`);
    if (errors.length > 0) {
      console.log(`⚠️  Failed to insert ${errors.length} concerts:`);
      errors.forEach(({ concertId, error }) => {
        console.log(`  - ${concertId}: ${error}`);
      });
    }
  } catch (error) {
    console.error("Error populating concerts:", error.message);
  }
}

/**
 * Main function to populate all collections
 */
async function populateDatabase() {
  console.log("🚀 Starting MongoDB population for ENSRQ database...\n");

  try {
    // Connect to MongoDB
    await dbConnect();
    console.log("✅ Connected to MongoDB\n");

    // Populate collections in order (dependencies first)
    await populateComposers();
    console.log("");

    await populateVenues();
    console.log("");

    await populateMusicians();
    console.log("");

    await populateWorks();
    console.log("");

    await populateSeasons();
    console.log("");

    await populateConcerts();
    console.log("");

    console.log("🎉 Database population completed successfully!");

    // Display summary
    const counts = {
      composers: await Composer.countDocuments(),
      venues: await Venue.countDocuments(),
      musicians: await Musician.countDocuments(),
      works: await Work.countDocuments(),
      seasons: await Season.countDocuments(),
      concerts: await Concert.countDocuments(),
    };

    console.log("\n📊 Final counts:");
    Object.entries(counts).forEach(([collection, count]) => {
      console.log(`  ${collection}: ${count} documents`);
    });
  } catch (error) {
    console.error("❌ Error during database population:", error.message);
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
 * Handle script execution
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  // Script is being run directly
  populateDatabase().catch((error) => {
    console.error("❌ Unhandled error:", error);
    process.exit(1);
  });
}

export default populateDatabase;
