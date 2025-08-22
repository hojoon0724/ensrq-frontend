import { Button, CountUpToTarget, FitText, FitTextWithPadding } from "@/components/atoms";
import { CarouselItem } from "@/components/molecules";
import { Carousel } from "@/components/organisms";
import { SectionEmpty, SectionMeshGradient } from "@/components/sections";
import allConcerts from "@/data/serve/concerts.json";
import { Concert } from "@/types/concert";
import { extractDateFromUtc, getVenueData, removeSeasonNumberFromConcertId } from "@/utils";
import Link from "next/link";

const duration = 2000;
const delay = 300;
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

const concertColorThemes: Record<string, string> = {
  "s10-2025-10-27-tangled-whispers": "water",
  "s10-2025-12-08-songbird": "sky",
  "s10-2026-01-19-goldbeaters-skin": "sand",
  "s10-2026-02-23-retrospektiv": "sand",
  "s10-2026-04-24-music-for-18-musicians": "sky",
  "s10-2026-05-22-music-for-new-bodies": "water",
};

const currentSeasonConcertData = currentSeasonConcertIds
  .map((concertId) => allConcerts.find((concert) => concert.concertId === concertId))
  .filter((concert) => concert !== undefined) as Concert[];

const upcomingConcerts = currentSeasonConcertData
  .filter((concert) => new Date(concert.date) >= new Date())
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
const pastConcerts = currentSeasonConcertData
  .filter((concert) => new Date(concert.date) < new Date())
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export function LandingPageSection() {
  return (
    <>
      <Carousel autoPlay={true} autoPlayInterval={6000} className="h-[max(50svh,600px)] shadow-lg">
        {/* season splash */}
        <CarouselItem>
          <SectionMeshGradient color1="sand" backgroundColor="sand" tone="light">
            <div className={`min-h-[50svh] w-full flex flex-col justify-center items-center p-12`}>
              <div className="w-full flex gap-[1ch] justify-center items-center museo-slab">
                <FitTextWithPadding extraCharacters={1} maxFontSize={250}>
                  Season&nbsp;{""}
                  <CountUpToTarget
                    startValue={seasons.number.start}
                    targetValue={seasons.number.end}
                    duration={duration}
                    delay={delay}
                    easing="ease-out"
                    transition="none"
                  />
                </FitTextWithPadding>
              </div>
              <h3>
                <CountUpToTarget
                  startValue={seasons.year1.start}
                  targetValue={seasons.year1.end}
                  duration={duration}
                  delay={delay}
                  easing="ease-out"
                  transition="none"
                />{" "}
                -{" "}
                <CountUpToTarget
                  startValue={seasons.year2.start}
                  targetValue={seasons.year2.end}
                  duration={duration}
                  delay={delay}
                  easing="ease-out"
                  transition="none"
                />
              </h3>
            </div>
          </SectionMeshGradient>
        </CarouselItem>

        {/* next concert */}
        {upcomingConcerts
          .filter((concert) => new Date(concert.date) >= new Date())
          .slice(0, 1)
          .map((concert) => (
            <CarouselItem key={concert.concertId} className="relative flex-1 w-full h-full">
              <div className="absolute"></div>
              <SectionEmpty
                className="h-full w-full flex flex-col py-[4rem]"
                themeColor={concertColorThemes[concert.concertId] || "sand"}
              >
                <div key={concert.concertId} className={`h-full w-full flex flex-col items-center justify-between`}>
                  <div className="carousel-item__top-section w-full flex flex-col items-end justify-end museo-slab">
                    <div className="text-2xl md:text-3xl pr-half">Next concert:</div>
                    <div className="fit-text-container w-full md:w-[90%] flex justify-between items-center">
                      <div className="div"></div>
                      <FitText
                        className="text-right w-full h-full flex flex-row-reverse items-center right-0"
                        minFontSize={80}
                        mobileMinFontSize={50}
                        maxFontSize={180}
                        allowWrap={true}
                      >
                        {concert.title}
                      </FitText>
                    </div>
                  </div>
                  <div className="carousel-item__bottom-section w-full grid grid-cols-1 md:grid-cols-[1fr,auto] gap-double items-center justify-end museo-slab">
                    <div className="w-full">
                      <FitText
                        className="text-right font-bold w-full h-full flex items-center justify-end"
                        minFontSize={12}
                        mobileMinFontSize={10}
                        maxFontSize={24}
                      >
                        {`${extractDateFromUtc(concert.date)} @ ${concert.time}`}
                      </FitText>
                    </div>
                    <Link href={`/tickets`} className="flex justify-end">
                      <Button
                        variant="filled"
                        border={true}
                        size="lg"
                        color={concertColorThemes[concert.concertId] || "sand"}
                      >
                        Tickets
                      </Button>
                    </Link>
                  </div>
                </div>
              </SectionEmpty>
            </CarouselItem>
          ))}
      </Carousel>

      <SectionEmpty themeColor="water" tone="light">
        <h1>At a glance:</h1>

        {/* Mobile */}
        <div
          className="concerts-grid grid md:hidden gap-x-double grid-cols-[1fr,auto] items-center mb-double"
          role="table"
          aria-label="Current season concerts"
        >
          {upcomingConcerts.map((concert) => (
            <Link
              key={concert.concertId}
              className="contents"
              href={`/seasons/${concert.seasonId}/${removeSeasonNumberFromConcertId(concert.concertId)}`}
              role="row"
            >
              <div className={`cell mt-double px-2 text-left font-bold`} role="cell">
                <span className="text-xl museo-slab">{concert.title}</span>
              </div>
              <div className={`cell mt-double px-2 text-right kode-mono`} role="cell">
                {extractDateFromUtc(concert.date)}
              </div>
              <div className={`cell mb-double px-2 text-left`} role="cell">
                {concert.venueId ? getVenueData(concert.venueId)?.name : ""}
              </div>
              <div className={`cell mb-double px-2 text-right kode-mono`} role="cell">
                {concert.time}
              </div>
            </Link>
          ))}
          {pastConcerts.length > 0 && (
            <div
              className={`separator col-span-2 px-half mt-s opacity-50 border-t ${upcomingConcerts.length === 0 ? "hidden" : "pt-s"}`}
            >
              Past Concerts
            </div>
          )}
          {pastConcerts.map((concert) => (
            <Link
              key={concert.concertId}
              className="contents"
              href={`/seasons/${concert.seasonId}/${removeSeasonNumberFromConcertId(concert.concertId)}`}
              role="row"
            >
              <div className={`cell opacity-50 mt-double px-2 text-left font-bold`} role="cell">
                <span className="text-xl museo-slab">{concert.title}</span>
              </div>
              <div className={`cell opacity-50 mt-double px-2 text-right kode-mono`} role="cell">
                {extractDateFromUtc(concert.date)}
              </div>
              <div className={`cell opacity-50 mb-double px-2 text-left`} role="cell">
                {concert.venueId ? getVenueData(concert.venueId)?.name : ""}
              </div>
              <div className={`cell opacity-50 mb-double px-2 text-right kode-mono`} role="cell">
                {concert.time}
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop */}
        <div
          className="concerts-grid hidden md:grid gap-x-double grid-cols-[1fr,auto,auto,auto] items-center mb-double"
          role="table"
          aria-label="Current season concerts"
        >
          {/* header (4 grid items) */}
          <div className="header font-bold block px-2 py-1 text-left" role="columnheader">
            Title
          </div>
          <div className="header font-bold block px-2 py-1 text-center" role="columnheader">
            Date
          </div>
          <div className="header font-bold block px-2 py-1 text-center" role="columnheader">
            Time
          </div>
          <div className="header font-bold block px-2 py-1 text-right" role="columnheader">
            Venue
          </div>

          {upcomingConcerts.map((concert) => (
            <Link
              key={concert.concertId}
              className="contents"
              href={`/seasons/${concert.seasonId}/${removeSeasonNumberFromConcertId(concert.concertId)}`}
              role="row"
            >
              <div className={`cell px-2 py-1 text-left font-bold`} role="cell">
                <span className="text-xl museo-slab">{concert.title}</span>
              </div>
              <div className={`cell px-2 py-1 text-center kode-mono`} role="cell">
                {extractDateFromUtc(concert.date)}
              </div>
              <div className={`cell mb-0 px-2 py-1 text-center kode-mono`} role="cell">
                {concert.time}
              </div>
              <div className={`cell mb-0 px-2 py-1 text-right`} role="cell">
                {concert.venueId ? getVenueData(concert.venueId)?.name : ""}
              </div>
            </Link>
          ))}

          {pastConcerts.length > 0 && (
            <div
              className={`separator col-span-4 px-half mt-s opacity-50 border-t ${upcomingConcerts.length === 0 ? "hidden" : "pt-s"}`}
            >
              Past Concerts
            </div>
          )}

          {pastConcerts.map((concert) => (
            <Link
              key={concert.concertId}
              className="contents"
              href={`/seasons/${concert.seasonId}/${removeSeasonNumberFromConcertId(concert.concertId)}`}
              role="row"
            >
              <div className={`cell opacity-50 px-2 py-1 text-left font-bold`} role="cell">
                <span className="text-xl museo-slab">{concert.title}</span>
              </div>
              <div className={`cell opacity-50 px-2 py-1 text-center kode-mono`} role="cell">
                {extractDateFromUtc(concert.date)}
              </div>
              <div className={`cell opacity-50 mb-0 px-2 py-1 text-center kode-mono`} role="cell">
                {concert.time}
              </div>
              <div className={`cell opacity-50 mb-0 px-2 py-1 text-right`} role="cell">
                {concert.venueId ? getVenueData(concert.venueId)?.name : ""}
              </div>
            </Link>
          ))}
        </div>
      </SectionEmpty>
    </>
  );
}
