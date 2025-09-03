import { Button, CountUpToTarget, FitText, FitTextWithPadding, Image } from "@/components/atoms";
import { CarouselItem, PhotoMarquee } from "@/components/molecules";
import { Carousel } from "@/components/organisms";
import { SectionEmpty, SectionMeshGradient } from "@/components/sections";
import graphicAssetsManifest from "@/data/graphic-assets-manifest.json";
import allConcerts from "@/data/serve/concerts.json";
import allSeasons from "@/data/serve/seasons.json";
import allWorks from "@/data/serve/works.json";
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

const currentSeason = "s10";
const currentSeasonData = allSeasons.find((season) => season.seasonId === currentSeason);

const currentSeasonConcertIds = currentSeasonData?.concerts || [];

const concertColorThemes: Record<string, string> = {
  "s10-2025-10-27-tangled-whispers": "water",
  "s10-2025-12-08-songbird": "sky",
  "s10-2026-01-19-goldbeaters-skin": "sand",
  "s10-2026-02-23-retrospektiv": "sand",
  "s10-2026-04-24-music-for-18-musicians": "sky",
  "s10-2026-05-22-music-for-new-bodies": "water",
};

const welcomeText = [
  "It’s Season Nine of ensembleNEWSRQ!",
  "While the obvious rhyme for this year is ‘Nine is Fine’, just fine simply won’t cut it. So, dear patrons, with your permission, we’d like to declare: Season Nine is DIVINE. We’re so thrilled to bring you a season packed to the brim with six incredible subscription programs (anchored by our local enSRQ Artists), two commissions and world premieres, the second annual Suncoast Composer Fellowship, and enSRQ’s return to the Sarasota Opera House for our season finale in May.",
  "Our Ninth Season opens in September with a powerful display of today’s mosst talented and diverse compositional voices with ‘Night, Reflected’. In November we feature Stephen Drury (a legend of contemporary piano repertoire) who brings his authoritative interpretation of Charles Ives’ Concord Sonata to Sarasota. Along with local star Thea Lobo and Samantha Bennett, this program honors the 150th Birthdays of two composers (‘Ives & Schoenberg’) that paved the way for the 21st century musical landscape. In January, a string quartet program speaks to the transient beauty of the things we cannot see (Visions & Miracles). In February,our percussion feature will bring down the house with four works (including a premiere from Paul Mortilla and a very special surprise guest) with ‘Truth & Mayhem’. In March, ‘Critical Moments’ showcases our second commission from Kitty Xiao and other musical gems for ensembles large and small.",
  "Finally, in May we’ll present a capstone performance, honoring the recent passing of Wolfgang Rihm, with his monumental ‘Jagden und Formen’ (Hunts & Forms) featuring enSRQ favorite Conor Hanick in our return to the Sarasota Opera House.",
  "Fellow musical travelers, get ready to embark once more upon a journey of profound musical contrasts: joy and sorrow, chaos and beauty. We can’t wait for you to join us for INCREDIBLE new music this season.",
  "With dynamic chromaticism,",
  "Samantha + George",
];

const currentSeasonConcertData = currentSeasonConcertIds
  .map((concertId) => allConcerts.find((concert) => concert.concertId === concertId))
  .filter((concert) => concert !== undefined) as Concert[];

const upcomingConcerts = currentSeasonConcertData
  .filter((concert) => new Date(concert.date) >= new Date())
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
const pastConcerts = currentSeasonConcertData
  .filter((concert) => new Date(concert.date) < new Date())
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

// Collect photo IDs from the next concert's composers and musicians
const nextConcertPhotosArr: string[] = [];

if (upcomingConcerts.length > 0) {
  upcomingConcerts[0].program.forEach((work) => {
    // Add composer ID
    const composerId = allWorks.find((w) => w.workId === work.workId)?.composerId;
    if (composerId) {
      nextConcertPhotosArr.push(composerId);
    }

    // Add musician IDs
    work.musicians.forEach((musicianId) => {
      if (musicianId !== "") {
        nextConcertPhotosArr.push(musicianId);
      }
    });
  });
}

// remove duplicates and filter out non-existing photos
const existingPhotosArr: string[] = Array.from(new Set(nextConcertPhotosArr)).filter(
  (photo) => photo && Object.prototype.hasOwnProperty.call(graphicAssetsManifest, `/photos/portraits/${photo}.webp`)
);

// Pre-map photos to avoid creating new arrays on every render
const marqueePhotos = existingPhotosArr.map((id) => ({
  src: `/photos/portraits/${id}.webp`,
  alt: id || "composer",
}));

export function LandingPageSection() {
  return (
    <>
      <Carousel autoPlay={true} autoPlayInterval={8000} className="h-[max(50svh,600px)] shadow-lg">
        {/* season splash */}
        <CarouselItem>
          <SectionMeshGradient color1="sand" backgroundColor="sand" tone="light" className="h-full">
            <div className={`min-h-[50svh] h-full w-full flex flex-col justify-between items-center p-[3%]`}>
              <div></div>
              <div className="center-container w-full h-full justify-center items-center flex flex-col gap-s text-center">
                <Link
                  href="/seasons/s10"
                  className="w-full flex gap-[1ch] justify-center items-center museo-slab leading-none"
                >
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
                </Link>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-s">
                <Link href={currentSeasonData?.ticketsLinks?.seasonLive?.url || "#"} className="w-full" target="_blank">
                  <Button variant="filled" size="lg" className="w-full">
                    Live Season Pass
                  </Button>
                </Link>
                <Link
                  href={currentSeasonData?.ticketsLinks?.seasonStreaming?.url || "#"}
                  className="w-full"
                  target="_blank"
                >
                  <Button variant="filled" size="lg" className="w-full">
                    Live Streaming Season Pass
                  </Button>
                </Link>
              </div>
            </div>
          </SectionMeshGradient>
        </CarouselItem>

        {/* next concert */}
        {upcomingConcerts
          .filter((concert) => new Date(concert.date) >= new Date())
          .slice(0, 0)
          .map((concert) => (
            <CarouselItem key={concert.concertId} className="relative flex-1 w-full h-full">
              {/* Background mesh gradient */}
              <div className={`absolute marquee-container w-full h-full`}>
                <div className="w-full h-full flex flex-col ">
                  <div
                    className={`padding-row w-full h-full bg-${concertColorThemes[concert.concertId] || "sand"}-950 z-[-2]`}
                  >
                    &nbsp;
                  </div>
                  <div
                    className={`first-row w-full h-full bg-${concertColorThemes[concert.concertId] || "sand"}-950 z-[-2]`}
                  >
                    <PhotoMarquee
                      photos={marqueePhotos}
                      speed={"medium"}
                      direction={"left"}
                      aspectRatio={"landscape"}
                      className="h-full"
                      photoClassName="object-cover"
                      gap={0}
                      pauseOnHover={true}
                    />
                  </div>
                  <div
                    className={`second-row w-full h-full bg-${concertColorThemes[concert.concertId] || "sand"}-950 z-[-2]`}
                  >
                    <PhotoMarquee
                      photos={marqueePhotos}
                      speed={"slow"}
                      direction={"left"}
                      aspectRatio={"landscape"}
                      className="h-full"
                      photoClassName="object-cover"
                      gap={0}
                      pauseOnHover={true}
                    />
                  </div>
                </div>
              </div>
              <SectionMeshGradient
                color1={concertColorThemes[concert.concertId] || "sand"}
                tone="light"
                backgroundColor="transparent"
                variant="s-curve"
                baselineWidth={700}
                lockLastNodeX={true}
                lineCount={6}
                nodeCount={4}
                nodes={[
                  [
                    { x: 0, y: 0 },
                    { x: 20, y: 0 },
                  ],
                  [
                    { x: 0, y: 0 },
                    { x: 20, y: 0 },
                  ],
                  [
                    { x: 0, y: 0 },
                    { x: 20, y: 0 },
                  ],
                  [
                    { x: 0, y: 0 },
                    { x: 20, y: 0 },
                  ],
                  [
                    { x: 0, y: 0 },
                    { x: 20, y: 0 },
                  ],
                  [
                    { x: 0, y: 0 },
                    { x: 20, y: 0 },
                  ],
                ]}
              >
                <></>
              </SectionMeshGradient>
              {/* Content overlay */}
              <div
                key={concert.concertId}
                className="absolute inset-0 h-full w-full max-w-7xl mx-auto flex flex-col items-center justify-between p-8"
              >
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
                      className={`text-right font-bold w-full h-full flex items-center justify-end [text-shadow:2px_2px_6px_rgba(0,0,0,0.5)] text-${concertColorThemes[concert.concertId] || "sand"}-50`}
                      minFontSize={12}
                      mobileMinFontSize={10}
                      maxFontSize={24}
                    >
                      {`${extractDateFromUtc(concert.date)} @ ${concert.time}`}
                    </FitText>
                  </div>
                  <div className="tickets-buttons-container w-full flex justify-end items-end gap-s">
                    <Link href={`${concert.ticketsLinks.singleLive?.url}`} className="flex justify-end">
                      <Button
                        variant="filled"
                        border={true}
                        size="lg"
                        color={concertColorThemes[concert.concertId] || "sand"}
                      >
                        Live Ticket
                      </Button>
                    </Link>
                    <Link href={`${concert.ticketsLinks.singleStreaming?.url}`} className="flex justify-end">
                      <Button
                        variant="filled"
                        border={true}
                        size="lg"
                        color={concertColorThemes[concert.concertId] || "sand"}
                      >
                        Streaming Ticket
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
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
      <SectionEmpty themeColor="sky" tone="dark">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-s">
          <div className="image-container relative w-full h-full aspect-[5/4]">
            <Image src="/photos/about/about-ensrq-10.webp" alt="george and samantha photo" />
          </div>
          <div className="season-welcome-text-container text-gray-30 flex justify-center items-center flex-col">
            {welcomeText.map((line, index) => (
              <p
                className={`${index < welcomeText.length - 2 ? "mb-4 text-justify w-full" : "w-full text-right"} pretty`}
                key={index}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </SectionEmpty>
      <SectionEmpty themeColor="sky" tone="dark">
        <div className="cta mb-s">
          <Link href={`/seasons/${currentSeason}`} className="w-full">
            <Button variant="filled" size="xl" className="w-full">
              Explore the Season
            </Button>
          </Link>
        </div>
      </SectionEmpty>
    </>
  );
}
