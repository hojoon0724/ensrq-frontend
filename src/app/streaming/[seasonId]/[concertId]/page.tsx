import { LogoIcon } from "@/assets/logoIcon";
import { VideoWithCustomThumbnail } from "@/components/organisms";
import { SectionEmpty } from "@/components/sections";
import { removeSeasonNumberFromConcertId } from "@/utils/textFormat";
import { notFound } from "next/navigation";

// Static import — avoids duplicate imports in both functions
import liveData from "@/data/live-data.json";

export async function generateStaticParams() {
  return liveData.flatMap((season) =>
    season.concerts.map((concertId) => ({
      seasonId: season.seasonId,
      concertId: removeSeasonNumberFromConcertId(concertId),
    }))
  );
}

export default async function WatchConcertPage({ params }: { params: { seasonId: string; concertId: string } }) {
  const { seasonId, concertId } = params;

  // Precompute valid IDs
  const validSeasonIds = new Set(liveData.map((season) => season.seasonId));
  const validConcertIds = new Set(liveData.flatMap((season) => season.concerts));

  // Restore full concert ID
  const fullConcertId = `${seasonId}-${concertId}`;

  // Validate
  if (!validSeasonIds.has(seasonId) || !validConcertIds.has(fullConcertId)) {
    notFound();
  }

  // Load concert data
  let concertData = null;
  try {
    concertData = (await import(`@/data/split/concerts/${fullConcertId}.json`)).default;
  } catch (error) {
    console.error(`Concert data not found for ${fullConcertId}:`, error);
    notFound();
  }

  return (
    <SectionEmpty>
      <h1 className="text-4xl font-bold mb-4">{concertData.title}</h1>
      <div className="streaming-container bg-gray-50 w-full aspect-video flex justify-center items-center">
        <VideoWithCustomThumbnail
          thumbnail={`/graphics/${seasonId}/streaming-thumbnails/${concertData.concertId}.webp`}
          icon={<LogoIcon color="var(--water-600)" />}
          youtubeUrl={concertData.youTubeUrl || ""}
        />
      </div>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(concertData, null, 2)}</pre>
    </SectionEmpty>
  );
}
