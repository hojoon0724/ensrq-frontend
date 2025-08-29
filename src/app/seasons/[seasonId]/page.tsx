import { ConcertTile } from "@/components/molecules";
import { RandomColorPageHeader } from "@/components/sections";
import allConcerts from "@/data/serve/concerts.json";
import allSeasons from "@/data/serve/seasons.json";
import { Concert } from "@/types";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return allSeasons.map((season) => ({ seasonId: season.seasonId }));
}
export default async function SingleSeasonPage({ params }: { params: Promise<{ seasonId: string }> }) {
  const { seasonId } = await params;

  // Find season data from imported allSeasons
  const seasonData = allSeasons.find((season) => season.seasonId === seasonId);

  if (!seasonData) {
    notFound();
  }

  // Filter concert data from preloaded allConcerts
  const concertData = seasonData.concerts
    ?.map((id: string) => allConcerts.find((c) => c.concertId === id))
    ?.filter(Boolean) as Concert[];

  return (
    <div>
      <RandomColorPageHeader seasonId={seasonId} seasonData={seasonData}>
        {concertData?.map((concert: Concert) => (
          <div key={concert.concertId} className="w-full">
            <ConcertTile concert={concert} />
          </div>
        ))}
      </RandomColorPageHeader>
    </div>
  );
}
