#!/usr/bin/env node

/**
 * ENSRQ Database Verification Script
 *
 * This script verifies that the MongoDB database was populated correctly
 * by checking document counts and sampling some data.
 */

import "dotenv/config";
import dbConnect from "../../lib/mongodb.js";
import { Composer, Concert, Musician, Season, Venue, Work } from "../../models/index.js";

async function verifyDatabase() {
  console.log("🔍 Verifying ENSRQ database population...\n");

  try {
    // Connect to MongoDB
    await dbConnect();
    console.log("✅ Connected to MongoDB\n");

    // Check document counts
    const counts = {
      composers: await Composer.countDocuments(),
      venues: await Venue.countDocuments(),
      musicians: await Musician.countDocuments(),
      works: await Work.countDocuments(),
      seasons: await Season.countDocuments(),
      concerts: await Concert.countDocuments(),
    };

    console.log("📊 Document counts:");
    Object.entries(counts).forEach(([collection, count]) => {
      console.log(`  ${collection}: ${count} documents`);
    });
    console.log("");

    // Sample some data
    console.log("🎭 Sample data:");

    // Sample composer
    const sampleComposer = await Composer.findOne().lean();
    if (sampleComposer) {
      console.log(`  Composer: ${sampleComposer.name} (${sampleComposer.nationality})`);
    }

    // Sample venue
    const sampleVenue = await Venue.findOne().lean();
    if (sampleVenue) {
      console.log(`  Venue: ${sampleVenue.name}`);
    }

    // Sample concert
    const sampleConcert = await Concert.findOne().lean();
    if (sampleConcert) {
      console.log(`  Concert: ${sampleConcert.title} (${sampleConcert.date.toISOString().split("T")[0]})`);
    }

    // Sample work
    const sampleWork = await Work.findOne().lean();
    if (sampleWork) {
      console.log(`  Work: ${sampleWork.title} by ${sampleWork.composerId}`);
    }

    // Sample musician
    const sampleMusician = await Musician.findOne().lean();
    if (sampleMusician) {
      console.log(`  Musician: ${sampleMusician.name}`);
    }

    // Sample season
    const sampleSeason = await Season.findOne().lean();
    if (sampleSeason) {
      console.log(`  Season: ${sampleSeason.seasonId} (${sampleSeason.concerts.length} concerts)`);
    }

    console.log("\n✅ Database verification completed!");
  } catch (error) {
    console.error("❌ Error during verification:", error.message);
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

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyDatabase().catch((error) => {
    console.error("❌ Unhandled error:", error);
    process.exit(1);
  });
}

export default verifyDatabase;
