import { MovingGradientText } from "@/components/atoms";
import { SectionGrid, SectionMeshGradient } from "@/components/sections";
import seasonData from "@/data/serve/seasons.json";
import { Season } from "@/types";
import { formatSeasonLabel } from "@/utils";
import Link from "next/link";

export default function SeasonsPage() {
  const colors = ["sand", "sky", "water"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomTextColor = colors[Math.floor(Math.random() * colors.length)];
  const randomTone = Math.random() < 0.5 ? "light" : "dark";
  const textTone = randomTone === "light" ? "dark" : "light";

  return (
    <div>
      <SectionMeshGradient color1={randomColor} backgroundColor={`${randomColor}`} tone={randomTone} className="h-[max(30svh,400px)]">
        <MovingGradientText text="All Seasons" className="text-8xl font-bold" gradientColor={`${randomTextColor}`} tone={textTone} />
      </SectionMeshGradient>
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
