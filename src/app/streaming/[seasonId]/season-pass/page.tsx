import { LogoIcon } from "@/assets/logoIcon";
import { VideoWithCustomThumbnail } from "@/components/organisms";
import { SectionEmpty } from "@/components/sections";
import { notFound } from "next/navigation";

// Static import — avoids duplicate imports in both functions
import PasswordGate from "@/components/atoms/PasswordGate";
import allConcerts from "@/data/serve/concerts.json";
import allSeasons from "@/data/serve/seasons.json";

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

  const nextConcert = currentSeasonConcertsData.find((concert) => new Date(concert.date) > new Date());
  const upcomingConcerts = currentSeasonConcertsData.filter((concert) => new Date(concert.date) > new Date());
  const pastConcerts = currentSeasonConcertsData.filter((concert) => new Date(concert.date) < new Date());

  if (!seasonData) {
    notFound();
  }

  return (
    <PasswordGate>
      {/* next concert */}
      {nextConcert && (
        <SectionEmpty>
          <h1 className="text-center my-double">Next Concert</h1>
          <div className="streaming-container bg-gray-50 w-full aspect-video flex justify-center items-center">
            <VideoWithCustomThumbnail
              thumbnail={`/graphics/${seasonId}/streaming-thumbnails/season-pass.webp`}
              icon={<LogoIcon color="var(--water-600)" />}
              youtubeUrl={seasonData.youTubeUrl || ""}
            />
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
              </SectionEmpty>
            );
          })}
        </>
      ) : null}
    </PasswordGate>
  );
}
