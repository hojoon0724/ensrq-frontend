import fs from "fs";
import path from "path";

const inputJson = "./src/data/concerts-all-data.json";
const outputJson = "./src/data/concerts-all-data-updated.json";

const composerDir = "./src/data/composers";

const composers = fs
  .readdirSync(composerDir)
  .filter((file) => file.endsWith(".json"))
  .reduce((acc, file) => {
    const filePath = path.join(composerDir, file);
    const composerData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const composerName = path.basename(file, ".json");
    acc[composerName] = composerData;
    return acc;
  }, {});

const seasonsArray = JSON.parse(fs.readFileSync(inputJson, "utf8"));

function populateComposerData(composerId) {
  return composers[composerId];
}

// this works - program arr goes in, new program arr comes out with more data
function populateComposerDataInProgramArray(programArray) {
  let updatedProgramArray = [];
  programArray.map((work) => {
    const composerId = work.composerId;
    const updatedWork = { ...work, composer: populateComposerData(composerId) };
    updatedProgramArray.push(updatedWork);
  });
  return updatedProgramArray;
}

// const testProgramArray = seasonsArray[0].concerts[0].program;
// populateComposerDataInProgramArray(testProgramArray);

function updateConcertObjProgram(concertObj) {
  const updatedConcertObj = { ...concertObj };

  // Skip if no program exists
  if (!concertObj.program || !Array.isArray(concertObj.program)) {
    return updatedConcertObj;
  }

  updatedConcertObj.program = populateComposerDataInProgramArray(
    concertObj.program,
  );
  console.log(updatedConcertObj);
  return updatedConcertObj;
}

// const testConcertObj = seasonsArray[0].concerts[0];
// const updatedConcertObj = updateConcertObjProgram(testConcertObj);

function updateSeasonConcerts(season) {
  const updatedSeason = { ...season };
  updatedSeason.concerts = updatedSeason.concerts.map((concert) =>
    updateConcertObjProgram(concert),
  );
  console.dir(updatedSeason, { depth: null });
  return updatedSeason;
}

// const testSeason = seasonsArray[0];
// updateSeasonConcerts(testSeason);

function updateAllSeasons(seasonsArray) {
  const updatedSeasonsArray = seasonsArray.map((season) =>
    updateSeasonConcerts(season),
  );
  console.log(updatedSeasonsArray);
  return updatedSeasonsArray;
}

const updatedData = updateAllSeasons(seasonsArray);

// write the updated data to a new JSON file
fs.writeFileSync(outputJson, JSON.stringify(updatedData, null, 0), "utf8");
