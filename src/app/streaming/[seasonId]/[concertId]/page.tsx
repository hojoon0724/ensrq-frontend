import PasswordGate from "@/components/atoms/PasswordGate";
import { ConcertLivestream } from "@/components/organisms";
import allConcerts from "@/data/serve/concerts.json";
import allSeasons from "@/data/serve/seasons.json";
import { removeSeasonNumberFromConcertId } from "@/utils";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return allSeasons.flatMap((season) =>
    season.concerts.map((concertId) => ({
      seasonId: season.seasonId,
      concertId: removeSeasonNumberFromConcertId(concertId),
    }))
  );
}

export default async function WatchConcertPage({
  params,
}: {
  params: Promise<{ seasonId: string; concertId: string }>;
}) {
  const { seasonId, concertId } = await params;

  // Restore full concert ID and find concert data
  const fullConcertId = `${seasonId}-${concertId}`;
  const concertData = allConcerts.find((concert) => concert.concertId === fullConcertId);

  // Check if concert exists
  if (!concertData) {
    notFound();
  }
  const isUpcoming = new Date() <= new Date(concertData.date);

  return (
    <PasswordGate pageTitle={`${concertData.title}`}>
      <ConcertLivestream concert={concertData} isUpcoming={isUpcoming} />
    </PasswordGate>
  );
}
