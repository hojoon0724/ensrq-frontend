import { CountUpToTarget } from "@/components/atoms";
import { SectionEmpty, SectionMeshGradient } from "@/components/sections";
import allConcerts from "@/data/serve/concerts.json";
import { Concert } from "@/types/concert";
import { extractDateFromUtc, getVenueData } from "@/utils";
import React from "react";

const duration = 3000;
const seasons = {
  number: { start: 1, end: 10 },
  year1: { start: 2016, end: 2025 },
  year2: { start: 2017, end: 2026 },
};

const currentSeasonConcertIds = [
  "s10-2025-10-27-tangled-whispers",
  "s10-2025-12-08-songbird",
  "s10-2026-01-19-goldbeaters-skin",
  "s10-2026-02-23-retrospektiv",
  "s10-2026-04-24-music-for-18-musicians",
  "s10-2026-05-22-music-for-new-bodies",
];

const currentSeasonConcertData = currentSeasonConcertIds
  .map((concertId) => allConcerts.find((concert) => concert.concertId === concertId))
  .filter((concert) => concert !== undefined) as Concert[];

export function LandingPageSection() {
  return (
    <>
      <SectionMeshGradient color1="sand" backgroundColor="sand" tone="light">
        <div className={`min-h-[50svh] flex flex-col justify-center items-center`}>
          <h1 className="flex gap-[1ch]">
            Season{" "}
            <CountUpToTarget
              startValue={seasons.number.start}
              targetValue={seasons.number.end}
              duration={duration}
              easing="ease-out"
              transition="none"
            />
          </h1>
          <h3>
            <CountUpToTarget
              startValue={seasons.year1.start}
              targetValue={seasons.year1.end}
              duration={duration}
              easing="ease-out"
              transition="none"
            />{" "}
            -{" "}
            <CountUpToTarget
              startValue={seasons.year2.start}
              targetValue={seasons.year2.end}
              duration={duration}
              easing="ease-out"
              transition="none"
            />
          </h3>
        </div>
      </SectionMeshGradient>
      <SectionEmpty themeColor="water" tone="light">
        <h1>At a glance:</h1>
        <style>
          {`
            .concerts-grid .header {
              font-weight: bold;
            }
            .concert-row {
              border-top: 1px solid rgba(0,0,0,0.04);
              display: contents; /* keep cells as grid items */
            }

          `}
        </style>

        <div
          className="concerts-grid  grid gap-x-double grid-cols-[1fr,auto] sm:grid-cols-[1fr,auto,auto,auto] items-center mb-double"
          role="table"
          aria-label="Current season concerts"
        >
          {/* header (4 grid items) */}
          <div className="header hidden sm:block sm:px-2 sm:py-1 text-left" role="columnheader">
            Title
          </div>
          <div className="header hidden sm:block sm:px-2 sm:py-1 text-center" role="columnheader">
            Date
          </div>
          <div className="header hidden sm:block sm:px-2 sm:py-1 text-right sm:text-center" role="columnheader">
            Time
          </div>
          <div
            className="header hidden sm:block sm:px-2 sm:py-1 text-left col-span-3 sm:text-right sm:col-span-1"
            role="columnheader"
          >
            Venue
          </div>

          {currentSeasonConcertData.map((concert, index) => (
            <React.Fragment key={concert.concertId}>
              <div
                className={`cell order-${1 + index * 4} sm:order-${1 + index * 4} sm:px-2 sm:py-1 text-left font-bold`}
                role="cell"
              >
                <span className="text-xl museo-slab">{concert.title}</span>
              </div>
              <div
                className={`cell order-${2 + index * 4} sm:order-${2 + index * 4} sm:px-2 sm:py-1 text-center kode-mono`}
                role="cell"
              >
                {extractDateFromUtc(concert.date)}
              </div>
              <div
                className={`cell order-${4 + index * 4} sm:order-${3 + index * 4} mb-double sm:mb-0 sm:px-2 sm:py-1 text-right sm:text-center kode-mono`}
                role="cell"
              >
                {concert.time}
              </div>
              <div
                className={`cell order-${3 + index * 4} sm:order-${4 + index * 4} mb-double sm:mb-0 sm:px-2 sm:py-1 text-left col-span-1 sm:text-right sm:col-span-1`}
                role="cell"
              >
                {concert.venueId ? getVenueData(concert.venueId)?.name : ""}
              </div>
            </React.Fragment>
          ))}
        </div>
      </SectionEmpty>
    </>
  );
}
