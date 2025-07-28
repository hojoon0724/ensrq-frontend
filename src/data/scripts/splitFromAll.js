import fs from "fs";
import path from "path";

import normalizeString from "../../utils/normalizeString.js";
import writeToDisk from "../../utils/writeToDisk.js";

const allDataJson = "src/data/all-data.json";

const composersDir = "src/data/composers";
const concertsDir = "src/data/concerts";
const musiciansDir = "src/data/musicians";
const venuesDir = "src/data/venues";
const worksDir = "src/data/works";

const allData = JSON.parse(fs.readFileSync(path.resolve(allDataJson), "utf-8"));

// const seasonNumber =
//     allData[0].seasonId;
// const seasonYear =
//     allData[0].season;
// const concertsArray =
//     allData[0].concerts;
// const concertTitle =
//     allData[0].concerts[0].title;
// const concertDate =
//     allData[0].concerts[0].date;
// const concertStreamingPassword =
//     allData[0].concerts[0].streamingPageAccessPassword;
// const concertProgramArray =
//     allData[0].concerts[0].program;
// const workTitle =
//     allData[0].concerts[0].program[0].title;
// const workYear =
//     allData[0].concerts[0].program[0].year;
// const workDuration =
//     allData[0].concerts[0].program[0].duration;
// const workComposer =
//     allData[0].concerts[0].program[0].composer;
// const workInstrumentationArray =
//     allData[0].concerts[0].program[0].instrumentation;
// const workInstrumentationItem =
//     allData[0].concerts[0].program[0].instrumentation[0];
// const workInstrumentationInstrument =
//     allData[0].concerts[0].program[0].instrumentation[0].instrument;
// const workInstrumentationMusiciansArray =
//     allData[0].concerts[0].program[0].instrumentation[0].musicians;

function extractWork(work) {
  const composerId = work.composer ? work.composer.composerId : "";
  const workId = `${composerId}-${normalizeString(work.title)}`;
  const updatedWork = {
    workId: workId,
    composerId: composerId,
    title: work.title,
    year: work.year,
    duration: work.duration,
    movements: work.movements ? work.movements : [],
    instrumentation: work.instrumentation.map((instrumentationItem) => {
      const instrument = instrumentationItem.instrument;
      const count = instrumentationItem.count ? instrumentationItem.count : 1;
      return {
        instrument: instrument,
        count: count,
      };
    }),
  };
  return updatedWork;
}

function getAllConcerts(allData) {
  allData.map((season) => {
    const seasonId = season.seasonId;
    season.concerts.map((concert) => {
      const concertId = `${seasonId}-${concert.date}-${normalizeString(concert.title)}`;
      // write venue data
      console.log(concert.venue);
      writeToDisk(`${venuesDir}/${concert.venue.venueId}.json`, concert.venue);

      if (!concert.program || concert.program.length === 0) {
        return;
      } else if (concert.program.title !== "") {
        concert.program.map((work) => {
          if (!work.composer || !work.title) {
            return;
          }
          const workId = `${work.composer ? work.composer.composerId : ""}-${normalizeString(work.title)}`;
          const updatedWork = extractWork(work);
          const composerId = work.composer ? work.composer.composerId : "";
          const composerData = work.composer ? work.composer : {};
          writeToDisk(`${composersDir}/${composerId}.json`, composerData);
          writeToDisk(`${worksDir}/${workId}.json`, updatedWork);
        });
        console.log(concertId);
      }

      const updatedConcert = {
        concertId: concertId,
        title: concert.title,
        subtitle: concert.subtitle ? concert.subtitle : "",
        description: concert.description ? concert.description : "",
        date: concert.date,
        ticketsLinks: concert.ticketsLinks ? concert.ticketsLinks : [],

        venueId: concert.venue ? concert.venue.venueId : "",
        streamingPageAccessPassword: concert.streamingPageAccessPassword ? concert.streamingPageAccessPassword : "",
        sponsors: concert.sponsors ? concert.sponsors : [],
        program: concert.program.map((work) => {
          const workId = `${work.composer ? work.composer.composerId : ""}-${normalizeString(work.title)}`;
          return {
            workId: workId,
            is_premiere: work.is_premiere ? work.is_premiere : false,
            is_commission: work.is_commission ? work.is_commission : false,
          };
        }),
        performers: concert.program.map((work) => {
          const workId = `${work.composer ? work.composer.composerId : ""}-${normalizeString(work.title)}`;
          const instrumentsObj = {};

          work.instrumentation.forEach((instrumentationItem) => {
            instrumentsObj[instrumentationItem.instrument] = instrumentationItem.musicians
              ? instrumentationItem.musicians.map((musician) => {
                  const musicianId = normalizeString(musician);
                  writeToDisk(`${musiciansDir}/${musicianId}.json`, {
                    musicianId: musicianId,
                    name: musician,
                  });
                  return normalizeString(musician);
                })
              : [];
          });

          return {
            [workId]: instrumentsObj,
          };
        }),
      };
      writeToDisk(`${concertsDir}/${concertId}.json`, updatedConcert);
    });
  });
}

getAllConcerts(allData);
