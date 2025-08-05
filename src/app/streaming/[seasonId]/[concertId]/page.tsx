import { Icon } from "@/components/atoms";
import { VideoWithCustomThumbnail } from "@/components/organisms";

export default async function WatchConcertPage({
  params,
}: {
  params: Promise<{ seasonId: string; concertId: string }>;
}) {
  const { seasonId, concertId } = await params;

  let concertModule = null;
  let concertData = null;

  try {
    // Dynamically import the concert data using both seasonId and concertId
    concertModule = await import(`@/data/split/concerts/${seasonId}-${concertId}.json`);
    concertData = concertModule.default;
  } catch (error) {
    console.error(`Concert data not found for ${concertId}:`, error);
  }

  if (!concertData) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-4">Concert Not Found</h1>
        <p className="mb-4">The concert &ldquo;{concertId}&rdquo; could not be found.</p>
      </div>
    );
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
      {/* Add more content related to the specific concert here */}
    </div>
  );
}
