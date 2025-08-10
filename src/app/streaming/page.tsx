import { Image, MovingGradientText } from "@/components/atoms";
import { SectionGrid, SectionMeshGradient } from "@/components/sections";
import seasonData from "@/data/serve/seasons.json";
import { Season } from "@/types";
import { formatSeasonLabel } from "@/utils";
import Link from "next/link";

export default function Streaming() {
  const colors = ["sand", "sky", "water"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomTextColor = colors[Math.floor(Math.random() * colors.length)];
  const randomTone = Math.random() < 0.5 ? "light" : "dark";
  const textTone = randomTone === "light" ? "dark" : "light";

  return (
    <div>
      <SectionMeshGradient
        color1={randomColor}
        backgroundColor={`${randomColor}`}
        tone={randomTone}
        className="h-[max(30svh,400px)]"
      >
        <MovingGradientText
          text="Streaming"
          className="text-8xl font-bold"
          gradientColor={`${randomTextColor}`}
          tone={textTone}
        />
      </SectionMeshGradient>
      <SectionGrid>
        {seasonData.slice(0,6).map((season: Season) => (
          <Link key={season.seasonId} href={`/streaming/${season.seasonId}`}>
            <Image
              src={`/graphics/season-link-buttons/streaming-${season.seasonId}.webp`}
              alt={`Season ${formatSeasonLabel(season.seasonId)}`}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
              width={500}
              height={300}
            />
          </Link>
        ))}
      </SectionGrid>
    </div>
  );
}
