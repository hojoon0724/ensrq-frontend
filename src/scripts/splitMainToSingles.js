import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const whatData = "concerts";

// Read the main concerts data file
const dataPath = path.join(__dirname, `../data/${whatData}-all-data.json`);
const outputDir = path.join(__dirname, `../data/${whatData}`);

function createConcertId(seasonId, date, title) {
  const formattedSeasonId = seasonId.toString().padStart(2, "0");
  const formattedTitle = title
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[^a-z0-9\s]/g, "") // Remove remaining special characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
  return `s${formattedSeasonId}-${date}-${formattedTitle}`;
}

async function splitConcertsToSingles() {
  try {
    // Read the main concerts data file
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Split each concert into individual files
    let createdCount = 0;
    for (const season of data) {
      for (const concert of season.concerts) {
        const concertId = createConcertId(
          season.seasonId,
          concert.date,
          concert.title,
        );
        const outputPath = path.join(outputDir, `${concertId}.json`);

        // Create the individual concert object with concertId
        const concertData = {
          concertId,
          ...concert,
        };

        // Write the individual concert file
        fs.writeFileSync(
          outputPath,
          JSON.stringify(concertData, null, 2),
          "utf8",
        );
        createdCount++;

        console.log(`Created: ${outputPath}`);
      }
    }

    console.log(
      `\nSuccessfully created ${createdCount} ${whatData} files in ${outputDir}`,
    );
  } catch (error) {
    console.error("Error splitting concerts data:", error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  splitConcertsToSingles();
}

export { splitConcertsToSingles };
