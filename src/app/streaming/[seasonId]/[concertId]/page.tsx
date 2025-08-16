import { LogoIcon } from "@/assets/logoIcon";
import PasswordGate from "@/components/atoms/PasswordGate";
import { VideoWithCustomThumbnail } from "@/components/organisms";
import { SectionEmpty } from "@/components/sections";
import allConcerts from "@/data/serve/concerts.json";
import allSeasons from "@/data/serve/seasons.json";
import { extractDateFromUtc, removeSeasonNumberFromConcertId } from "@/utils";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return allSeasons.flatMap((season) =>
    season.concerts.map((concertId) => ({
      seasonId: season.seasonId,
      concertId: removeSeasonNumberFromConcertId(concertId),
    }))
  );
}

export default async function WatchConcertPage({
  params,
}: {
  params: Promise<{ seasonId: string; concertId: string }>;
}) {
  const { seasonId, concertId } = await params;

  // Restore full concert ID and find concert data
  const fullConcertId = `${seasonId}-${concertId}`;
  const concertData = allConcerts.find((concert) => concert.concertId === fullConcertId);

  // Check if concert exists
  if (!concertData) {
    notFound();
  }

  const isUpcoming = new Date() <= new Date(concertData.date);

  return (
    <PasswordGate pageTitle={`${concertData.title}`}>
      <SectionEmpty>
        <h1 className="font-bold mb-4 text-center">{concertData.title}</h1>
        {isUpcoming && <h3 className="text-center">{extractDateFromUtc(concertData.date)}</h3>}

        <div className="streaming-container bg-gray-50 w-full min-w-[min(300px,100%)] aspect-video flex justify-center items-center">
          <VideoWithCustomThumbnail
            thumbnail={`/graphics/${seasonId}/streaming-thumbnails/${concertData.concertId}.webp`}
            icon={<LogoIcon color="var(--water-600)" />}
            youtubeUrl={concertData.youTubeUrl || ""}
          />
        </div>
      </SectionEmpty>
    </PasswordGate>
  );
}
