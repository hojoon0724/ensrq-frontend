import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the main composers data file
const composersDataPath = path.join(
  __dirname,
  "../data/composers-all-data.json",
);
const outputDir = path.join(__dirname, "../data/composers");

function splitComposersToSingles() {
  try {
    // Read the main composers data file
    const composersData = JSON.parse(
      fs.readFileSync(composersDataPath, "utf8"),
    );

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Split each composer into individual files
    let createdCount = 0;
    for (const [composerKey, composerData] of Object.entries(composersData)) {
      const outputPath = path.join(outputDir, `${composerKey}.json`);

      // Write the individual composer file
      fs.writeFileSync(
        outputPath,
        JSON.stringify(composerData, null, 2),
        "utf8",
      );
      createdCount++;

      console.log(`Created: ${outputPath}`);
    }

    console.log(
      `\nSuccessfully created ${createdCount} composer files in ${outputDir}`,
    );
  } catch (error) {
    console.error("Error splitting composers data:", error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  splitComposersToSingles();
}

export { splitComposersToSingles };
