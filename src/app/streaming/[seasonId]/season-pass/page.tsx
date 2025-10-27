import { LogoIcon } from "@/assets/logoIcon";
import { VideoWithCustomThumbnail } from "@/components/organisms";
import { SectionEmpty } from "@/components/sections";
import { notFound } from "next/navigation";

// Static import — avoids duplicate imports in both functions
import PasswordGate from "@/components/atoms/PasswordGate";
import allConcerts from "@/data/serve/concerts.json";
import allSeasons from "@/data/serve/seasons.json";
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

  // Compare dates using UTC to handle timezone differences
  const today = new Date();
  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  const nextConcert = currentSeasonConcertsData.find((concert) => {
    const concertDate = new Date(concert.date);
    const concertUTC = Date.UTC(concertDate.getUTCFullYear(), concertDate.getUTCMonth(), concertDate.getUTCDate());
    return concertUTC >= todayUTC;
  });

  const upcomingConcerts = currentSeasonConcertsData.filter((concert) => {
    const concertDate = new Date(concert.date);
    const concertUTC = Date.UTC(concertDate.getUTCFullYear(), concertDate.getUTCMonth(), concertDate.getUTCDate());
    return concertUTC >= todayUTC && concert.concertId !== nextConcert?.concertId;
  });

  const pastConcerts = currentSeasonConcertsData.filter((concert) => {
    const concertDate = new Date(concert.date);
    const concertUTC = Date.UTC(concertDate.getUTCFullYear(), concertDate.getUTCMonth(), concertDate.getUTCDate());
    return concertUTC < todayUTC;
  });

  if (!seasonData) {
    notFound();
  }

  return (
    <PasswordGate pageTitle={`${formatSeasonLabel(seasonData.seasonId)}` || "Season Pass"}>
      {/* next concert */}
      {nextConcert && (
        <SectionEmpty>
          <h1 className="text-center my-double">Next Concert</h1>

          <div className="streaming-container bg-gray-50 w-full aspect-video flex justify-center items-center">
            <VideoWithCustomThumbnail
              key={nextConcert.concertId}
              thumbnail={`/graphics/${seasonId}/streaming-thumbnails/${nextConcert.concertId}.webp`}
              icon={<LogoIcon color="var(--water-600)" />}
              youtubeUrl={nextConcert.youTubeUrl || ""}
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
