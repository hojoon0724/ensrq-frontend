import { RandomColorConcertHeader } from "@/components/sections";
import { Concert } from "@/types";
import { notFound } from "next/navigation";

// Static imports for repo JSON (faster, smaller runtime code)
import allConcerts from "@/data/serve/concerts.json";
import allSeasons from "@/data/serve/seasons.json";

export function generateStaticParams() {
  return allSeasons.flatMap((season) =>
    season.concerts.map((concertId) => ({
      seasonId: season.seasonId,
      concertId: concertId.replace(/^s\d{2}-/, ""),
    }))
  );
}

export default async function SingleConcertPage({
  params,
}: {
  params: Promise<{ seasonId: string; concertId: string }>;
}) {
  const { seasonId, concertId } = await params;

  // Reconstruct the full concert ID
  const fullConcertId = `${seasonId}-${concertId}`;

  // Find the concert data
  const concertData = allConcerts.find((c) => c.concertId === fullConcertId);

  if (!concertData) {
    notFound();
  }

  return (
    <div>
      <RandomColorConcertHeader concertData={concertData as Concert} />
    </div>
  );
}
