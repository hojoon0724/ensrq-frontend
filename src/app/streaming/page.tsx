import { Image } from "@/components/atoms";
import { RandomColorHeader, SectionGrid } from "@/components/sections";
import seasonData from "@/data/serve/seasons.json";
import { Season } from "@/types";
import { formatSeasonLabel } from "@/utils";
import Link from "next/link";

const seasonsWithStreaming = ['s06','s07','s08','s09','s10']

export default function Streaming() {
  const filteredSeasons = seasonData.filter((season) =>
    seasonsWithStreaming.includes(season.seasonId)
  );

  return (
    <div>
      <RandomColorHeader title="Streaming" />
      <SectionGrid>
        {filteredSeasons.reverse().map((season: Season) => (
          <Link key={season.seasonId} href={`/streaming/${season.seasonId}`}>
            <Image
              src={`/graphics/season-link-buttons/streaming-${season.seasonId}.webp`}
              alt={`Season ${formatSeasonLabel(season.seasonId)}`}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
              fill={false}
              width={500}
              height={300}
            />
          </Link>
        ))}
      </SectionGrid>
    </div>
  );
}
