import { RandomColorConcertHeader } from "@/components/sections";
import { Concert } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

// Static imports for repo JSON (faster, smaller runtime code)
import liveData from "@/data/live-data.json";
import allConcerts from "@/data/serve/concerts.json";

export function generateStaticParams() {
  return liveData.flatMap((season) =>
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

  // Precompute valid IDs
  const validSeasonIds = new Set(liveData.map((season) => season.seasonId));
  const validConcertIds = new Set(liveData.flatMap((season) => season.concerts));

  // Validate season and concert
  if (!validSeasonIds.has(seasonId)) {
    notFound();
  }

  // Find the concert data
  const concertData = allConcerts.find((c) => c.concertId === fullConcertId);

  if (!concertData || !validConcertIds.has(fullConcertId)) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-4">Concert Not Found</h1>
        <p className="mb-4">
          The concert &ldquo;{concertId}&rdquo; could not be found in season {seasonId}.
        </p>
        <Link href={`/seasons/${seasonId}`} className="text-blue-600 hover:underline">
          Return to Season {seasonId.replace("s", "").replace(/^0+/, "")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <RandomColorConcertHeader concertData={concertData as Concert} />
    </div>
  );
}
