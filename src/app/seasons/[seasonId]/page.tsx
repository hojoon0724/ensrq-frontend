import { ConcertTile } from "@/components/molecules";
import { RandomColorSeasonHeader } from "@/components/sections";
import liveData from "@/data/live-data.json";
import allConcerts from "@/data/serve/concerts.json";
import { Concert } from "@/types";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return liveData.map((season) => ({ seasonId: season.seasonId }));
}
export default async function SingleSeasonPage({ params }: { params: Promise<{ seasonId: string }> }) {
  const { seasonId } = await params;

  // Precompute valid IDs
  const validSeasonIds = new Set(liveData.map((season) => season.seasonId));
  const validConcertIds = new Set(liveData.flatMap((season) => season.concerts));

  // Validate season
  if (!validSeasonIds.has(seasonId)) {
    notFound();
  }

  // Load season data
  let seasonData = null;
  try {
    seasonData = (await import(`@/data/split/seasons/${seasonId}.json`)).default;
  } catch (error) {
    console.error(`Season data not found for ${seasonId}:`, error);
  }

  if (!seasonData) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-4">Season Not Found</h1>
        <p className="mb-4">The season &ldquo;{seasonId}&rdquo; could not be found.</p>
      </div>
    );
  }

  // Filter concert data from preloaded allConcerts
  const concertData = seasonData.concerts
    ?.filter((id: string) => validConcertIds.has(id))
    ?.map((id: string) => allConcerts.find((c) => c.concertId === id))
    ?.filter(Boolean);

  return (
    <div>
      <RandomColorSeasonHeader seasonId={seasonId} seasonData={seasonData}>
        {concertData?.map((concert: Concert) => (
          <div key={concert.concertId} className="w-full">
            <ConcertTile concert={concert} />
          </div>
        ))}
      </RandomColorSeasonHeader>
    </div>
  );
}
