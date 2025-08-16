import { Image } from "@/components/atoms";
import ConcertStreamingItem from "@/components/molecules/ConcertStreamingItem";
import { BaseRandomColorHeader, SectionGrid } from "@/components/sections";
import { formatSeasonLabel } from "@/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function WatchSeasonPage({ params }: { params: Promise<{ seasonId: string }> }) {
  const { seasonId } = await params;

  // Import data
  const allSeasons = (await import(`@/data/serve/seasons.json`)).default;
  const allConcerts = (await import(`@/data/serve/concerts.json`)).default;

  // Find season data
  const seasonData = allSeasons.find((season) => season.seasonId === seasonId);

  // Check if season exists
  if (!seasonData) {
    notFound();
  }

  // Get concert data for this season (only concerts with YouTube streaming)
  const seasonConcertsWithStreaming = seasonData.concerts
    .map((concertId: string) => allConcerts.find((concert) => concert.concertId === concertId))
    .filter((concert): concert is NonNullable<typeof concert> =>
      Boolean(concert && concert.youTubeUrl && concert.youTubeUrl.trim() !== "")
    );

  return (
    <div>
      <BaseRandomColorHeader title={`Streaming`} subtitle={`${formatSeasonLabel(seasonId)}`}></BaseRandomColorHeader>
      <SectionGrid>
        <Link href={`/streaming/${seasonId}/season-pass`} className="relative">
          <div className="concert-details-text-container flex flex-col absolute h-full w-full justify-center items-center text-center museo-slab">
            Streaming Season Pass
          </div>
          <Image
            src={`/graphics/${seasonId}/streaming-thumbnails/season-pass.webp`}
            alt={`Season ${formatSeasonLabel(seasonId)}`}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            fill={false}
            width={500}
            height={300}
          />
        </Link>
        {seasonConcertsWithStreaming.map((concert) => (
          <ConcertStreamingItem key={concert.concertId} concert={concert} seasonId={seasonId} />
        ))}
      </SectionGrid>
    </div>
  );
}
