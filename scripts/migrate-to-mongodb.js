import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env.local and .env FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env.local") });
dotenv.config({ path: path.join(__dirname, "../.env") });

// Verify the environment variable is loaded
console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Now import the modules that depend on environment variables
import dbConnect from "../src/lib/mongodb.js";
import Composer from "../src/models/Composer.js";
import Concert from "../src/models/Concert.js";
import Musician from "../src/models/Musician.js";
import Season from "../src/models/Season.js";
import Venue from "../src/models/Venue.js";
import Work from "../src/models/Work.js";

const DATA_DIR = path.join(__dirname, "../src/data");

async function migrateComposers() {
  console.log("Migrating composers...");
  const composersDir = path.join(DATA_DIR, "composers");
  const files = fs.readdirSync(composersDir);

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(composersDir, file);
      const composerData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      try {
        await Composer.findOneAndUpdate({ composerId: composerData.composerId }, composerData, {
          upsert: true,
          new: true,
        });
        console.log(`✓ Migrated composer: ${composerData.name}`);
      } catch (error) {
        console.error(`✗ Error migrating composer ${composerData.name}:`, error.message);
      }
    }
  }
}

async function migrateWorks() {
  console.log("Migrating works...");
  const worksDir = path.join(DATA_DIR, "works");
  const files = fs.readdirSync(worksDir);

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(worksDir, file);
      const workData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      try {
        await Work.findOneAndUpdate({ workId: workData.workId }, workData, { upsert: true, new: true });
        console.log(`✓ Migrated work: ${workData.title}`);
      } catch (error) {
        console.error(`✗ Error migrating work ${workData.title}:`, error.message);
      }
    }
  }
}

async function migrateVenues() {
  console.log("Migrating venues...");
  const venuesDir = path.join(DATA_DIR, "venues");
  const files = fs.readdirSync(venuesDir);

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(venuesDir, file);
      const venueData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      try {
        await Venue.findOneAndUpdate({ venueId: venueData.venueId }, venueData, { upsert: true, new: true });
        console.log(`✓ Migrated venue: ${venueData.name}`);
      } catch (error) {
        console.error(`✗ Error migrating venue ${venueData.name}:`, error.message);
      }
    }
  }
}

async function migrateMusicians() {
  console.log("Migrating musicians...");
  const musiciansDir = path.join(DATA_DIR, "musicians");
  const files = fs.readdirSync(musiciansDir);

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(musiciansDir, file);
      const musicianData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      try {
        await Musician.findOneAndUpdate({ musicianId: musicianData.musicianId }, musicianData, {
          upsert: true,
          new: true,
        });
        console.log(`✓ Migrated musician: ${musicianData.name}`);
      } catch (error) {
        console.error(`✗ Error migrating musician ${musicianData.name}:`, error.message);
      }
    }
  }
}

async function migrateConcerts() {
  console.log("Migrating concerts...");
  const concertsDir = path.join(DATA_DIR, "concerts");
  const files = fs.readdirSync(concertsDir);

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(concertsDir, file);
      const concertData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      try {
        await Concert.findOneAndUpdate({ concertId: concertData.concertId }, concertData, { upsert: true, new: true });
        console.log(`✓ Migrated concert: ${concertData.title}`);
      } catch (error) {
        console.error(`✗ Error migrating concert ${concertData.title}:`, error.message);
      }
    }
  }
}

async function migrateSeasons() {
  console.log("Migrating seasons...");
  const seasonsFile = path.join(DATA_DIR, "seasons.json");

  if (fs.existsSync(seasonsFile)) {
    const seasonsData = JSON.parse(fs.readFileSync(seasonsFile, "utf8"));

    for (const [seasonId, concertIds] of Object.entries(seasonsData)) {
      const seasonData = {
        seasonId,
        season: seasonId,
        concerts: concertIds,
      };

      try {
        await Season.findOneAndUpdate({ seasonId }, seasonData, { upsert: true, new: true });
        console.log(`✓ Migrated season: ${seasonId}`);
      } catch (error) {
        console.error(`✗ Error migrating season ${seasonId}:`, error.message);
      }
    }
  }
}

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("✓ Connected to MongoDB");

    await migrateComposers();
    await migrateWorks();
    await migrateVenues();
    await migrateMusicians();
    await migrateConcerts();
    await migrateSeasons();

    console.log("\n🎉 Migration completed successfully!");
    console.log("Your data has been migrated from JSON files to MongoDB.");
    console.log("The application will now read from and write to MongoDB instead of local JSON files.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

migrate();
