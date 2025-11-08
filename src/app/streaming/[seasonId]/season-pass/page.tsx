import { ConcertLivestream } from "@/components/organisms";
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
      <div className="bg-sky-200 z-[34]">
        <div className="my-0 text-center sticky h-full pb-s top-20 lg:top-0 pt-2 lg:py-6 bg-sky-50 z-[35] flex justify-center items-center">
          <div className="h-8 text-4xl museo-slab flex justify-center items-center">Next Up</div>
        </div>
        {nextConcert && <ConcertLivestream concert={nextConcert} isUpcoming={true} />}
      </div>

      {/* upcoming concerts */}

      {upcomingConcerts.length > 0 ? (
        <div className="bg-sand-200 z-[34]">
          <div className="my-0 text-center sticky h-full pb-s top-20 lg:top-0 pt-2 lg:py-6 bg-sand-50 z-[35] flex justify-center items-center">
            <div className="h-8 text-4xl museo-slab flex justify-center items-center">Upcoming</div>
          </div>
          {upcomingConcerts.map((concert) => {
            return <ConcertLivestream concert={concert} isUpcoming={true} key={concert.concertId} />;
          })}
        </div>
      ) : null}

      {/* past concerts */}
      {pastConcerts.length > 0 ? (
        <div className="bg-water-200 z-[34]">
          <div className="my-0 text-center sticky h-full pb-s top-20 lg:top-0 pt-2 lg:py-6 bg-water-50 z-[35] flex justify-center items-center">
            <div className="h-8 text-4xl museo-slab flex justify-center items-center">Past Concerts</div>
          </div>
          {pastConcerts.map((concert) => {
            return <ConcertLivestream concert={concert} isUpcoming={false} key={concert.concertId} />;
          })}
        </div>
      ) : null}
    </PasswordGate>
  );
}
