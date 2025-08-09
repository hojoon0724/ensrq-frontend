import { formatSeasonLabel } from "../../../utils/textFormat";
export default async function WatchSeasonPage({ params }: { params: Promise<{ seasonId: string }> }) {
  const { seasonId } = await params;

  let seasonData = null;

  try {
    // Dynamically import the JSON file
    seasonData = await import(`@/data/split/seasons/${seasonId}.json`);
  } catch (error) {
    console.error(`Season data not found for ${seasonId}:`, error);
  }

  let concertData = null;

  try {
    // Dynamically import the concert data for the season
    const concertPromises = seasonData?.default?.concerts?.map(async (concertId: string) => {
      // Dynamically import the concert data
      try {
        const concertModule = await import(`@/data/split/concerts/${concertId}.json`);
        return concertModule.default; // Extract the actual JSON data
      } catch (error) {
        console.error(`Error processing concert data for ${concertId}:`, error);
        return null;
      }
    });
    concertData = await Promise.all(concertPromises || []);
    // Filter out any null values from failed imports
    concertData = concertData.filter((concert) => concert !== null);
  } catch (error) {
    console.error(`Error importing concert data for ${seasonId}:`, error);
  }

  if (!seasonData) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-4">Season Not Found</h1>
        <p className="mb-4">The season &ldquo;{seasonId}&rdquo; could not be found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Watch {formatSeasonLabel(seasonId)}</h1>
      <p className="mb-4">This is the watch page for {formatSeasonLabel(seasonId)}.</p>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(seasonData.default, null, 2)}</pre>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(concertData, null, 2)}</pre>
      {/* Add more content related to the specific season here */}
    </div>
  );
}
