import fs from "fs/promises";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src/data");

const composersAllJson = path.join(dataDirectory, "composers-all-data.json");
const composersDirectory = path.join(dataDirectory, "composers");

const concertsAllJson = path.join(dataDirectory, "concerts-all-data.json");
const concertsDirectory = path.join(dataDirectory, "concerts");

const musiciansAllJson = path.join(dataDirectory, "musicians-all-data.json");
const musiciansDirectory = path.join(dataDirectory, "musicians");

const venuesAllJson = path.join(dataDirectory, "venues-all-data.json");
const venuesDirectory = path.join(dataDirectory, "venues");

const worksAllJson = path.join(dataDirectory, "works-all-data.json");
const worksDirectory = path.join(dataDirectory, "works");

// pick what data to work on
const type = "concerts";

// read AllJson file
const allJsonData = JSON.parse(
  await fs.readFile(eval(`${type}AllJson`), "utf-8"),
);

const destinationDirectory = path.join(process.cwd(), "src/data", type);

// Object.keys(allJsonData).forEach((element) => {
//   const concertData = allJsonData[element];
//   const season = concertData.seasonId;
//   Object.keys(concertData.concerts).forEach((concert) => {
//     console.log(`${season} - ${concertData.concerts[concert].title}`);
//   });
// });


console.log(allJsonData[1].seasonId.toString().padStart(2, "0"));
console.log(allJsonData[1].concerts[0].date);
