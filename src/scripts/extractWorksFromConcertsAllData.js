import fs from "fs";
import path from "path";

const inputPath = "../data/concerts-all-data.json";
const outputDir = "../data/works";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const normalizeTitle = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with -
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing dashes

const serializeWork = (programItem) => {
  const { title, year, duration, composerId } = programItem;
  const instrumentation = [];

  const instrumentMap = {};

  programItem.instrumentation.forEach((inst) => {
    const name = inst.instrument.toLowerCase();
    instrumentMap[name] = (instrumentMap[name] || 0) + (inst.count || 1);
  });

  for (const [instrument, count] of Object.entries(instrumentMap)) {
    const entry = { instrument };
    if (count > 1) entry.count = count;
    instrumentation.push(entry);
  }

  const workId = `${composerId}-${normalizeTitle(title)}`;

  return {
    workId,
    title,
    year,
    duration,
    instrumentation,
    composerId,
  };
};

const seen = new Set();

const seasonsData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
seasonsData.forEach((season) => {
  season.concerts.forEach((concert) => {
    // Handle regular concerts with program array
    if (concert.program && Array.isArray(concert.program)) {
      concert.program.forEach((programItem) => {
        const work = serializeWork(programItem);

        if (seen.has(work.workId)) return;
        seen.add(work.workId);

        const fileName = `${work.workId}.json`;
        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(work, null, 2));
        console.log(`✓ Saved: ${fileName}`);
      });
    }

    // Handle festivals with programs array
    if (concert.programs && Array.isArray(concert.programs)) {
      concert.programs.forEach((programSet) => {
        const programItems = programSet.program || programSet.pieces || [];
        if (Array.isArray(programItems)) {
          programItems.forEach((programItem) => {
            const work = serializeWork(programItem);

            if (seen.has(work.workId)) return;
            seen.add(work.workId);

            const fileName = `${work.workId}.json`;
            const filePath = path.join(outputDir, fileName);
            fs.writeFileSync(filePath, JSON.stringify(work, null, 2));
            console.log(`✓ Saved: ${fileName}`);
          });
        }
      });
    }
  });
});
