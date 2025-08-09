import { Icon } from "@/components/atoms";
import { VideoWithCustomThumbnail } from "@/components/organisms";
import { SectionEmpty } from "@/components/sections";
import { removeSeasonNumberFromConcertId } from "@/utils/textFormat";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  // Load your JSON data
  const liveData = await import("@/data/live-data.json");

  const concertList = liveData.default
    .map((season) =>
      season.concerts.map((concertId) => ({
        seasonId: season.seasonId,
        concertId: removeSeasonNumberFromConcertId(concertId), // Remove season prefix for cleaner URLs
      }))
    )
    .flat();

  return concertList
}

export default async function WatchConcertPage({
  params,
}: {
  params: Promise<{ seasonId: string; concertId: string }>;
}) {
  const { seasonId, concertId } = await params;

  // Load live data to validate season and concert
  const liveData = (await import("@/data/live-data.json")).default;
  const validSeasonIds = liveData?.map((season) => season.seasonId);
  const validConcertIds = liveData?.map((season) => season.concerts).flat();

  // Convert shortened concertId back to full concertId for validation and data loading
  const fullConcertId = `${seasonId}-${concertId}`;

  // Check if the current seasonId and full concertId are valid
  if (!validSeasonIds.includes(seasonId) || !validConcertIds.includes(fullConcertId)) {
    notFound();
  }

  let concertData = null;

  try {
    const concertModule = await import(`@/data/split/concerts/${fullConcertId}.json`);
    concertData = concertModule.default;
  } catch (error) {
    console.error(`Concert data not found for ${fullConcertId}:`, error);
    notFound(); // Better UX than rendering manually
  }

  if (!concertData) {
    // notFound() already called above, but TypeScript needs a return in this branch.
    return null;
  }

  return (
    <SectionEmpty>
      <h1 className="text-4xl font-bold mb-4">{concertData.title}</h1>
      <div className="streaming-container bg-gray-50 w-full aspect-video flex justify-center items-center">
        <VideoWithCustomThumbnail
          thumbnail={`/graphics/${seasonId}/streaming-thumbnails/${concertData.concertId}.webp` || ""}
          icon={<Icon name="play" />}
          youtubeUrl={concertData.youTubeUrl || ""}
        />
      </div>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(concertData, null, 2)}</pre>
    </SectionEmpty>
  );
}
