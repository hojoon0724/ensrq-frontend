import { Icon } from "@/components/atoms";
import { VideoWithCustomThumbnail } from "@/components/organisms";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  // Load your JSON data
  const allConcerts = await import("@/data/serve/concerts.json");
  return allConcerts.default.map(({ seasonId, concertId }: { seasonId: string; concertId: string }) => ({
    seasonId,
    concertId,
  }));
}

export default async function WatchConcertPage({
  params,
}: {
  params: Promise<{ seasonId: string; concertId: string }>;
}) {
  const { seasonId, concertId } = await params;

  let concertData = null;

  try {
    const concertModule = await import(`@/data/split/concerts/${seasonId}-${concertId}.json`);
    concertData = concertModule.default;
  } catch (error) {
    console.error(`Concert data not found for ${concertId}:`, error);
    notFound(); // Better UX than rendering manually
  }

  if (!concertData) {
    // notFound() already called above, but TypeScript needs a return in this branch.
    return null;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-4">{concertData.title}</h1>
      <div className="streaming-container bg-gray-50 w-full aspect-video flex justify-center items-center">
        <VideoWithCustomThumbnail
          thumbnail={`/graphics/${seasonId}/streaming-thumbnails/${concertData.concertId}.jpg` || ""}
          icon={<Icon name="play" />}
          youtubeUrl={concertData.youTubeUrl || ""}
        />
      </div>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(concertData, null, 2)}</pre>
    </div>
  );
}
