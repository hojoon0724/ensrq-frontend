import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to data directories
const DATA_DIR = path.join(__dirname, "..", "data");
const COMPOSERS_DIR = path.join(DATA_DIR, "composers");
const WORKS_DIR = path.join(DATA_DIR, "works");
const MUSICIANS_DIR = path.join(DATA_DIR, "musicians");
const CONCERTS_FILE = path.join(DATA_DIR, "concerts-all-data.json");
const VENUES_FILE = path.join(DATA_DIR, "venues-all-data.json");
const SEASONS_FILE = path.join(DATA_DIR, "seasons.json");

// Output file
const OUTPUT_FILE = path.join(DATA_DIR, "consolidated-all-data.json");

/**
 * Read all JSON files from a directory and return an object with file content
 * @param {string} dirPath - Path to directory
 * @returns {Object} Object with filename (without extension) as key and parsed JSON as value
 */
function readJsonFiles(dirPath) {
  const files = {};

  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory ${dirPath} does not exist`);
    return files;
  }

  const fileList = fs.readdirSync(dirPath);

  fileList.forEach((filename) => {
    if (filename.endsWith(".json")) {
      const filePath = path.join(dirPath, filename);
      const fileId = filename.replace(".json", "");

      try {
        const content = fs.readFileSync(filePath, "utf8");
        files[fileId] = JSON.parse(content);
      } catch (error) {
        console.error(`Error reading ${filename}:`, error.message);
      }
    }
  });

  return files;
}

/**
 * Read a single JSON file
 * @param {string} filePath - Path to JSON file
 * @returns {Object|null} Parsed JSON content or null if error
 */
function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} does not exist`);
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Consolidate all data into a single comprehensive structure
 */
function consolidateAllData() {
  console.log("Starting data consolidation...");

  // Read all individual data files
  const composers = readJsonFiles(COMPOSERS_DIR);
  const works = readJsonFiles(WORKS_DIR);
  const musicians = readJsonFiles(MUSICIANS_DIR);
  const concerts = readJsonFile(CONCERTS_FILE);
  const venues = readJsonFile(VENUES_FILE);
  const seasons = readJsonFile(SEASONS_FILE);

  console.log(`Found ${Object.keys(composers).length} composers`);
  console.log(`Found ${Object.keys(works).length} works`);
  console.log(`Found ${Object.keys(musicians).length} musicians`);
  console.log(`Found ${concerts ? concerts.length : 0} seasons with concerts`);
  console.log(`Found ${venues ? Object.keys(venues).length : 0} venues`);

  // Create consolidated structure
  const consolidated = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalComposers: Object.keys(composers).length,
      totalWorks: Object.keys(works).length,
      totalMusicians: Object.keys(musicians).length,
      totalVenues: venues ? Object.keys(venues).length : 0,
      totalSeasons: concerts ? concerts.length : 0,
    },
    composers: composers,
    works: works,
    musicians: musicians,
    venues: venues || {},
    seasons: seasons || {},
    concerts: enhanceConcertsData(
      concerts,
      composers,
      works,
      venues,
      musicians,
    ),
  };

  return consolidated;
}

/**
 * Enhance concerts data by replacing IDs with full objects
 * @param {Array} concerts - Concert data array
 * @param {Object} composers - Composers lookup object
 * @param {Object} works - Works lookup object
 * @param {Object} venues - Venues lookup object
 * @param {Object} musicians - Musicians lookup object
 * @returns {Array} Enhanced concerts data
 */
function enhanceConcertsData(concerts, composers, works, venues, musicians) {
  if (!concerts || !Array.isArray(concerts)) {
    return [];
  }

  return concerts.map((season) => ({
    ...season,
    concerts: season.concerts.map((concert) => ({
      ...concert,
      // Enhance venue information
      venue: venues[concert.venue] || {
        id: concert.venue,
        name: concert.venue,
        address: "Unknown",
      },
      // Enhance program information
      program: (concert.program || []).map((programItem) => {
        const work = works[programItem.workId];
        const composer = work ? composers[work.composerId] : null;

        return {
          ...programItem,
          // Include full work details
          workDetails: work || {
            workId: programItem.workId,
            title: "Unknown Work",
            year: null,
            duration: null,
            instrumentation: [],
            composerId: "unknown",
          },
          // Include full composer details
          composerDetails: composer || {
            id: work ? work.composerId : "unknown",
            name: "Unknown Composer",
            nationality: "Unknown",
            born: null,
          },
          // Enhance instrumentation with musician details
          instrumentation: (programItem.instrumentation || []).map((inst) => ({
            ...inst,
            musicians: inst.musicians
              ? inst.musicians.map(
                  (musicianId) =>
                    musicians[musicianId] || {
                      id: musicianId,
                      name: musicianId,
                      photo: null,
                    },
                )
              : [],
          })),
        };
      }),
      // Handle festival programs if they exist
      programs: concert.programs
        ? concert.programs.map((program) => ({
            ...program,
            program: (program.program || []).map((programItem) => {
              const work = works[programItem.workId];
              const composer = work ? composers[work.composerId] : null;

              return {
                ...programItem,
                workDetails: work || {
                  workId: programItem.workId,
                  title: "Unknown Work",
                  year: null,
                  duration: null,
                  instrumentation: [],
                  composerId: "unknown",
                },
                composerDetails: composer || {
                  id: work ? work.composerId : "unknown",
                  name: "Unknown Composer",
                  nationality: "Unknown",
                  born: null,
                },
                instrumentation: (programItem.instrumentation || []).map(
                  (inst) => ({
                    ...inst,
                    musicians: inst.musicians
                      ? inst.musicians.map(
                          (musicianId) =>
                            musicians[musicianId] || {
                              id: musicianId,
                              name: musicianId,
                              photo: null,
                            },
                        )
                      : [],
                  }),
                ),
              };
            }),
            pieces: (program.pieces || []).map((piece) => {
              const work = works[piece.workId];
              const composer = work ? composers[work.composerId] : null;

              return {
                ...piece,
                workDetails: work || {
                  workId: piece.workId,
                  title: "Unknown Work",
                  year: null,
                  duration: null,
                  instrumentation: [],
                  composerId: "unknown",
                },
                composerDetails: composer || {
                  id: work ? work.composerId : "unknown",
                  name: "Unknown Composer",
                  nationality: "Unknown",
                  born: null,
                },
                instrumentation: (piece.instrumentation || []).map((inst) => ({
                  ...inst,
                  musicians: inst.musicians
                    ? inst.musicians.map(
                        (musicianId) =>
                          musicians[musicianId] || {
                            id: musicianId,
                            name: musicianId,
                            photo: null,
                          },
                      )
                    : [],
                })),
              };
            }),
          }))
        : undefined,
    })),
  }));
}

/**
 * Write consolidated data to output file
 * @param {Object} data - Consolidated data object
 */
function writeConsolidatedData(data) {
  try {
    const jsonOutput = JSON.stringify(data, null, 2);
    fs.writeFileSync(OUTPUT_FILE, jsonOutput, "utf8");
    console.log(`✅ Consolidated data written to: ${OUTPUT_FILE}`);
    console.log(
      `📊 File size: ${(jsonOutput.length / 1024 / 1024).toFixed(2)} MB`,
    );
  } catch (error) {
    console.error("❌ Error writing consolidated data:", error.message);
    process.exit(1);
  }
}

/**
 * Main execution function
 */
function main() {
  console.log("🚀 enSRQ Data Consolidation Script");
  console.log("=====================================");

  try {
    const consolidatedData = consolidateAllData();
    writeConsolidatedData(consolidatedData);

    console.log("\n✨ Consolidation completed successfully!");
    console.log("\nConsolidated data includes:");
    console.log(
      `  - ${consolidatedData.metadata.totalComposers} composers with full details`,
    );
    console.log(
      `  - ${consolidatedData.metadata.totalWorks} works with full details`,
    );
    console.log(
      `  - ${consolidatedData.metadata.totalMusicians} musicians with full details`,
    );
    console.log(
      `  - ${consolidatedData.metadata.totalVenues} venues with full details`,
    );
    console.log(
      `  - ${consolidatedData.metadata.totalSeasons} seasons with enhanced concert data`,
    );
    console.log("\nEach concert now includes:");
    console.log("  - Full composer information for each work");
    console.log("  - Complete work details (title, year, duration, etc.)");
    console.log("  - Venue information with addresses");
    console.log("  - Musician details where available");
  } catch (error) {
    console.error("❌ Consolidation failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { consolidateAllData, enhanceConcertsData, readJsonFile, readJsonFiles };
