import { RandomColorHeader, SectionGrid } from "@/components/sections";
import seasonData from "@/data/serve/seasons.json";
import { Season } from "@/types";
import { formatSeasonLabel } from "@/utils";
import Link from "next/link";

export default function SeasonsPage() {
  return (
    <div>
      <RandomColorHeader title="All Seasons" />
      <SectionGrid>
        {seasonData.map((season: Season) => (
          <Link key={season.seasonId} href={`/seasons/${season.seasonId}`}>
            <div className="p-4 border-b border-gray-200 flex flex-col justify-center items-center w-full aspect-video border">
              <h3 className="text-xl font-semibold">{formatSeasonLabel(season.seasonId)}</h3>
              <h3 className="text-lg font-light">{season.year}</h3>
            </div>
          </Link>
        ))}
      </SectionGrid>
      {/* Render season information here */}
    </div>
  );
}
