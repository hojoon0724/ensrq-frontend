import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONSOLIDATED_FILE = path.join(
  __dirname,
  "..",
  "data",
  "consolidated-all-data.json",
);

/**
 * Example script showing how to use the consolidated data
 */
function demonstrateConsolidatedData() {
  console.log("📖 Consolidated Data Usage Examples");
  console.log("===================================\n");

  // Read the consolidated data
  const data = JSON.parse(fs.readFileSync(CONSOLIDATED_FILE, "utf8"));

  console.log(`📊 Data Summary:`);
  console.log(`  - Generated: ${data.metadata.generatedAt}`);
  console.log(`  - Composers: ${data.metadata.totalComposers}`);
  console.log(`  - Works: ${data.metadata.totalWorks}`);
  console.log(`  - Venues: ${data.metadata.totalVenues}`);
  console.log(`  - Seasons: ${data.metadata.totalSeasons}\n`);

  // 1. Find all works by a specific composer
  console.log("🎼 Example 1: Find all works by Jerod Tate");
  const jerodTateWorks = Object.values(data.works).filter(
    (work) => work.composerId === "jerod-tate",
  );
  jerodTateWorks.forEach((work) => {
    console.log(`  - ${work.title} (${work.year})`);
  });
  console.log();

  // 2. Find all concerts in 2025-2026 season
  console.log("🎭 Example 2: All concerts in 2025-2026 season");
  const season2025 = data.concerts.find(
    (season) => season.season === "2025-2026",
  );
  if (season2025) {
    season2025.concerts.forEach((concert) => {
      console.log(
        `  - ${concert.title} on ${concert.date} at ${concert.venue.name}`,
      );
    });
  }
  console.log();

  // 3. Find all works featuring guitar
  console.log("🎸 Example 3: All works featuring guitar");
  const guitarWorks = Object.values(data.works).filter((work) =>
    work.instrumentation.some((inst) =>
      inst.instrument.toLowerCase().includes("guitar"),
    ),
  );
  guitarWorks.forEach((work) => {
    const composer = data.composers[work.composerId];
    console.log(
      `  - ${work.title} by ${composer?.name || "Unknown"} (${work.year})`,
    );
  });
  console.log();

  // 4. Concert with full details example (Tangled Whispers)
  console.log("🎪 Example 4: Complete concert details (Tangled Whispers)");
  const tangledWhispers = season2025?.concerts.find(
    (concert) => concert.title === "Tangled Whispers",
  );

  if (tangledWhispers) {
    console.log(`  Concert: ${tangledWhispers.title}`);
    console.log(`  Date: ${tangledWhispers.date}`);
    console.log(`  Venue: ${tangledWhispers.venue.name}`);
    console.log(`  Address: ${tangledWhispers.venue.address}`);
    console.log(`  Program:`);

    tangledWhispers.program.forEach((item, index) => {
      console.log(
        `    ${index + 1}. ${item.workDetails.title} (${item.workDetails.year})`,
      );
      console.log(
        `       by ${item.composerDetails.name} (${item.composerDetails.nationality})`,
      );
      console.log(`       Duration: ${item.workDetails.duration}`);
      console.log(
        `       Instrumentation: ${item.workDetails.instrumentation
          .map((inst) =>
            inst.count ? `${inst.instrument} (${inst.count})` : inst.instrument,
          )
          .join(", ")}`,
      );
    });
  }
  console.log();

  // 5. Venue usage statistics
  console.log("🏛️  Example 5: Venue usage across all seasons");
  const venueUsage = {};
  data.concerts.forEach((season) => {
    season.concerts.forEach((concert) => {
      const venueName = concert.venue.name;
      venueUsage[venueName] = (venueUsage[venueName] || 0) + 1;
    });
  });

  Object.entries(venueUsage)
    .sort(([, a], [, b]) => b - a)
    .forEach(([venue, count]) => {
      console.log(`  - ${venue}: ${count} concerts`);
    });
  console.log();

  // 6. Composer nationality distribution
  console.log("🌍 Example 6: Composer nationalities");
  const nationalities = {};
  Object.values(data.composers).forEach((composer) => {
    const nationality = composer.nationality || "Unknown";
    nationalities[nationality] = (nationalities[nationality] || 0) + 1;
  });

  Object.entries(nationalities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .forEach(([nationality, count]) => {
      console.log(`  - ${nationality}: ${count} composers`);
    });

  console.log(
    "\n✨ The consolidated data provides complete, denormalized information",
  );
  console.log("   for easy querying and batch maintenance!");
}

// Run the demonstration
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateConsolidatedData();
}

export { demonstrateConsolidatedData };
