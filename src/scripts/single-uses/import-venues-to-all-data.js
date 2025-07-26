import fs from "fs";
import path from "path";

const inputJson = "./src/data/concerts-all-data.json";
const outputJson = "./src/data/concerts-all-data-updated.json";

const venuesDir = "./src/data/venues";

const venues = fs
  .readdirSync(venuesDir)
  .filter((file) => file.endsWith(".json"))
  .reduce((acc, file) => {
    const filePath = path.join(venuesDir, file);
    const venueData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const venueName = path.basename(file, ".json");
    acc[venueName] = venueData;
    return acc;
  }, {});

const seasonsArray = JSON.parse(fs.readFileSync(inputJson, "utf8"));

// this works - program arr goes in, new program arr comes out with more data
function addConcertVenue(concertObj) {
  const updatedConcertObj = { ...concertObj };

  if (!concertObj.venueId || !venues[concertObj.venueId]) {
    return updatedConcertObj;
  }

  updatedConcertObj.venue = venues[concertObj.venueId];
  return updatedConcertObj;
}

function updateSeasonConcerts(season) {
  const updatedSeason = { ...season };
  updatedSeason.concerts = updatedSeason.concerts.map((concert) =>
    addConcertVenue(concert),
  );
  console.dir(updatedSeason, { depth: null });
  return updatedSeason;
}

const testSeason = seasonsArray[0];
updateSeasonConcerts(testSeason);

function updateAllSeasons(seasonsArray) {
  const updatedSeasonsArray = seasonsArray.map((season) =>
    updateSeasonConcerts(season),
  );
  console.log(updatedSeasonsArray);
  return updatedSeasonsArray;
}
const updatedData = updateAllSeasons(seasonsArray);
console.dir(updatedData, { depth: null });

// // write the updated data to a new JSON file
fs.writeFileSync(outputJson, JSON.stringify(updatedData, null, 0), "utf8");
