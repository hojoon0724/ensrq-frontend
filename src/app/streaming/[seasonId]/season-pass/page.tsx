import { LogoIcon } from "@/assets/logoIcon";
import { VideoWithCustomThumbnail } from "@/components/organisms";
import { SectionEmpty } from "@/components/sections";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

// Static import — avoids duplicate imports in both functions
import PasswordGate from "@/components/atoms/PasswordGate";
import allComposers from "@/data/serve/composers.json";
import allConcerts from "@/data/serve/concerts.json";
import allSeasons from "@/data/serve/seasons.json";
import allWorks from "@/data/serve/works.json";
import { formatSeasonLabel } from "@/utils";

export async function generateStaticParams() {
  return allSeasons
    .filter((season) => season.seasonStreamingPageUrl) // Only seasons that have streaming pages
    .map((season) => ({
      seasonId: season.seasonId,
    }));
}

export default async function SeasonPassPage({ params }: { params: Promise<{ seasonId: string }> }) {
  const { seasonId } = await params;

  // Find the season data that matches both the seasonId and the current URL path
  const currentUrl = `/streaming/${seasonId}/season-pass`;
  const seasonData = allSeasons.find(
    (season) => season.seasonId === seasonId && season.seasonStreamingPageUrl === currentUrl
  );

  const currentSeasonConcertsData = allConcerts.filter(
    (concert) => concert.seasonId === seasonId && concert.youTubeUrl && concert.youTubeUrl.trim() !== ""
  );

  // Helper: concerts expire the day after their scheduled date
  function isConcertExpired(concertDate: string) {
    const today = new Date();
    const concert = new Date(concertDate);
    concert.setDate(concert.getDate() + 1);
    const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const concertUTC = Date.UTC(concert.getUTCFullYear(), concert.getUTCMonth(), concert.getUTCDate());
    return todayUTC >= concertUTC;
  }

  const nextConcert = currentSeasonConcertsData.find((concert) => !isConcertExpired(concert.date));

  const upcomingConcerts = currentSeasonConcertsData.filter(
    (concert) => !isConcertExpired(concert.date) && concert.concertId !== nextConcert?.concertId
  );

  const pastConcerts = currentSeasonConcertsData.filter((concert) => isConcertExpired(concert.date));

  if (!seasonData) {
    notFound();
  }

  return (
    <PasswordGate pageTitle={`${formatSeasonLabel(seasonData.seasonId)}` || "Season Pass"}>
      {/* next concert */}
      {nextConcert && (
        <SectionEmpty>
          <h1 className="text-center my-double"></h1>

          <div className="streaming-container bg-gray-50 w-full aspect-video flex justify-center items-center">
            <VideoWithCustomThumbnail
              key={nextConcert.concertId}
              thumbnail={`/graphics/${seasonId}/streaming-thumbnails/${nextConcert.concertId}.webp`}
              icon={<LogoIcon color="var(--water-600)" />}
              youtubeUrl={nextConcert.youTubeUrl || ""}
            />
          </div>
          {/* Program Notes for Next Concert */}
          <div className="program-notes-container">
            <h2 className="font-bold my-4 text-center">Program Notes</h2>
            {nextConcert.program?.map((work, index) => {
              const workData = allWorks.find((w) => w.workId === work.workId);
              if (!workData) return null;
              return (
                <div key={index} className="mb-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mx-auto">
                  <h4 className="composer-name">
                    {allComposers.find((c) => c.composerId === workData.composerId)?.name || workData.composerId}
                  </h4>
                  <h4 className="work-title">{workData.title}</h4>
                  <div className="work-details col-start-1 lg:col-start-2">
                    {workData.description && (
                      <div className="program-note">
                        <Markdown>{workData.description}</Markdown>
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold mb-1"></h4>
                </div>
              );
            })}
          </div>
        </SectionEmpty>
      )}

      {/* upcoming concerts */}

      {upcomingConcerts.length > 0 ? (
        <>
          <h1 className="text-center my-double">Upcoming Concerts</h1>
          {upcomingConcerts.map((concert) => {
            return (
              <SectionEmpty key={concert.concertId}>
                <div className="streaming-container bg-gray-50 w-full aspect-video flex flex-col justify-center items-center">
                  <VideoWithCustomThumbnail
                    key={concert.concertId}
                    thumbnail={`/graphics/${seasonId}/streaming-thumbnails/${concert.concertId}.webp`}
                    icon={<LogoIcon color="var(--water-600)" />}
                    youtubeUrl={concert.youTubeUrl || ""}
                  />
                </div>
                {/* Program Notes for Upcoming Concert */}
                <div className="program-notes-container">
                  <h2 className="font-bold my-4 text-center">Program Notes</h2>
                  {concert.program?.map((work, index) => {
                    const workData = allWorks.find((w) => w.workId === work.workId);
                    if (!workData) return null;
                    return (
                      <div key={index} className="mb-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mx-auto">
                        <h4 className="composer-name">
                          {allComposers.find((c) => c.composerId === workData.composerId)?.name || workData.composerId}
                        </h4>
                        <h4 className="work-title">{workData.title}</h4>
                        <div className="work-details col-start-1 lg:col-start-2">
                          {workData.description && (
                            <div className="program-note">
                              <Markdown>{workData.description}</Markdown>
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold mb-1"></h4>
                      </div>
                    );
                  })}
                </div>
              </SectionEmpty>
            );
          })}
        </>
      ) : null}

      {/* past concerts */}
      {pastConcerts.length > 0 ? (
        <>
          <h1 className="text-center my-double">Past Concerts</h1>
          {pastConcerts.map((concert) => {
            return (
              <SectionEmpty key={concert.concertId}>
                <div className="streaming-container bg-gray-50 w-full aspect-video flex flex-col justify-center items-center">
                  <VideoWithCustomThumbnail
                    key={concert.concertId}
                    thumbnail={`/graphics/${seasonId}/streaming-thumbnails/${concert.concertId}.webp`}
                    icon={<LogoIcon color="var(--water-600)" />}
                    youtubeUrl={concert.youTubeUrl || ""}
                  />
                </div>
                {/* Program Notes for Past Concert */}
                <div className="program-notes-container">
                  <h2 className="font-bold my-4 text-center">Program Notes</h2>
                  {concert.program?.map((work, index) => {
                    const workData = allWorks.find((w) => w.workId === work.workId);
                    if (!workData) return null;
                    return (
                      <div key={index} className="mb-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mx-auto">
                        <h4 className="composer-name">
                          {allComposers.find((c) => c.composerId === workData.composerId)?.name || workData.composerId}
                        </h4>
                        <h4 className="work-title">{workData.title}</h4>
                        <div className="work-details col-start-1 lg:col-start-2">
                          {workData.description && (
                            <div className="program-note">
                              <Markdown>{workData.description}</Markdown>
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold mb-1"></h4>
                      </div>
                    );
                  })}
                </div>
              </SectionEmpty>
            );
          })}
        </>
      ) : null}
    </PasswordGate>
  );
}
