import { LogoIcon } from "@/assets/logoIcon";
import { VideoWithCustomThumbnail } from "@/components/organisms";
import { SectionEmpty } from "@/components/sections";
import { notFound } from "next/navigation";

// Static import — avoids duplicate imports in both functions
import PasswordGate from "@/components/atoms/PasswordGate";
import liveData from "@/data/live-data.json";

export async function generateStaticParams() {
  return liveData
    .filter((season) => season.seasonStreamingPageUrl) // Only seasons that have streaming pages
    .map((season) => ({
      seasonId: season.seasonId,
    }));
}

export default async function SeasonPassPage({ params }: { params: Promise<{ seasonId: string }> }) {
  const { seasonId } = await params;

  // Find the season data that matches both the seasonId and the current URL path
  const currentUrl = `/streaming/${seasonId}/season-pass`;
  const seasonData = liveData.find(
    (season) => season.seasonId === seasonId && season.seasonStreamingPageUrl === currentUrl
  );

  if (!seasonData) {
    notFound();
  }

  return (
    <PasswordGate>
      <SectionEmpty>
        <h1 className="text-4xl font-bold mb-4">
          Season {seasonData.seasonId.toUpperCase()} Pass - {seasonData.year}
        </h1>
        <div className="streaming-container bg-gray-50 w-full aspect-video flex justify-center items-center">
          <VideoWithCustomThumbnail
            thumbnail={`/graphics/${seasonId}/streaming-thumbnails/season-pass.webp`}
            icon={<LogoIcon color="var(--water-600)" />}
            youtubeUrl={seasonData.youTubeUrl || ""}
          />
        </div>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(seasonData, null, 2)}</pre>
      </SectionEmpty>
    </PasswordGate>
  );
}
