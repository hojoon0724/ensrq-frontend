import { Image } from "@/components/atoms";
import ConcertStreamingItem from "@/components/molecules/ConcertStreamingItem";
import { BaseRandomColorHeader, SectionGrid } from "@/components/sections";
import graphicAssetsManifest from "@/data/graphic-assets-manifest.json";
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

  const seasonPassGraphicsPath = `/graphics/${seasonId}/streaming-thumbnails/${seasonId}-season-pass.webp`;
  const existsInManifest: boolean = Object.prototype.hasOwnProperty.call(graphicAssetsManifest, seasonPassGraphicsPath);

  return (
    <div>
      <BaseRandomColorHeader title={`Streaming`} subtitle={`${formatSeasonLabel(seasonId)}`}></BaseRandomColorHeader>
      <SectionGrid>
        <Link href={`/streaming/${seasonId}/season-pass`} className="relative">
          {existsInManifest ? (
            <Image
              src={seasonPassGraphicsPath}
              alt={`Streaming Season Pass`}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
              fill={false}
              width={500}
              height={300}
            />
          ) : (
            <div className="concert-details-text-container flex flex-col w-full aspect-video justify-center items-center text-center bg-gray-200 rounded-lg shadow-lg bg-white">
              <div className="text-lg font-normal museo-slab">{`Streaming Season Pass`}</div>
            </div>
          )}
        </Link>
        {seasonConcertsWithStreaming.map((concert) => (
          <ConcertStreamingItem key={concert.concertId} concert={concert} seasonId={seasonId} />
        ))}
      </SectionGrid>
    </div>
  );
}
