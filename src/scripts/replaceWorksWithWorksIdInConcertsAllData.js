import fs from "fs";
import path from "path";

const inputPath = "../data/concerts-all-data.json";
const outputPath = "../data/concerts-all-data.updated.json";
const worksDir = "../data/works";

// Normalize title into file-friendly ID
const normalizeTitle = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Build work ID from item
const getWorkId = (item) => {
  if (!item?.title || !item?.composerId) return null;
  return `${item.composerId}-${normalizeTitle(item.title)}`;
};

// Load the individual work JSON from disk
const loadWork = (workId) => {
  const filePath = path.join(worksDir, `${workId}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } else {
    console.warn(`⚠️ Work file not found: ${workId}`);
    return null;
  }
};

// Merge base work data with concert-specific musicians
const mergeWorkData = (concertItem, workData) => {
  const instrumentation = [];

  const musicianMap = {};
  for (const inst of concertItem.instrumentation || []) {
    musicianMap[inst.instrument.toLowerCase()] = inst.musicians || [];
  }

  for (const inst of workData.instrumentation) {
    const entry = { instrument: inst.instrument };
    if (inst.count) entry.count = inst.count;

    const musicians = musicianMap[inst.instrument.toLowerCase()];
    if (musicians && musicians.length) {
      entry.musicians = musicians;
    } else {
      entry.musicians = [];
    }

    instrumentation.push(entry);
  }

  return {
    workId: workData.workId,
    instrumentation,
  };
};

// Load and process the full concert data
const concertsData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

concertsData.forEach((season) => {
  season.concerts.forEach((concert) => {
    const updateProgramBlock = (programBlock) => {
      programBlock.forEach((item, index) => {
        const workId = getWorkId(item);
        if (!workId) {
          console.warn("Skipping item with missing title or composerId:", item);
          return;
        }

        const work = loadWork(workId);
        if (!work) return;

        programBlock[index] = mergeWorkData(item, work);
      });
    };

    // For normal concerts
    if (concert.program && Array.isArray(concert.program)) {
      updateProgramBlock(concert.program);
    }

    // For festivals with nested program sets
    if (concert.programs && Array.isArray(concert.programs)) {
      concert.programs.forEach((programSet) => {
        const block = programSet.program || programSet.pieces || [];
        if (Array.isArray(block)) {
          updateProgramBlock(block);
        }
      });
    }
  });
});

// Save to new file
fs.writeFileSync(outputPath, JSON.stringify(concertsData, null, 2));
console.log(`✅ Updated concert data written to ${outputPath}`);
