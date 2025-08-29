import { Image } from "@/components/atoms";
import { GridSection } from "@/components/layouts";
import { RandomColorPageHeader } from "@/components/sections";
import graphicAssetsManifest from "@/data/graphic-assets-manifest.json";
import seasonData from "@/data/serve/seasons.json";
import { Season } from "@/types";
import { formatSeasonLabel } from "@/utils";
import Link from "next/link";

const seasonDataSorted = seasonData.reverse();

export default function SeasonsPage() {
  const colors = ["sky", "sand", "water"];
  const shades = [50, 100, 200, 300, 400];

  return (
    <div>
      <RandomColorPageHeader title="All Seasons" />
      <GridSection>
        {seasonDataSorted.map((season: Season, index: number) => {
          const key = `/graphics/season-covers/${season.seasonId}.webp`;
          const existsInManifest: boolean = Object.prototype.hasOwnProperty.call(graphicAssetsManifest, key);
          const bgColor = colors[index % colors.length];
          const shadeIndex = Math.floor(index / colors.length) % shades.length;
          const shade = shades[shadeIndex];

          return (
            <Link key={season.seasonId} href={`/seasons/${season.seasonId}`} className="w-full aspect-video">
              {existsInManifest ? (
                <Image
                  src={key}
                  alt={formatSeasonLabel(season.seasonId)}
                  width={800}
                  height={450}
                  fill={false}
                  className="object-cover"
                />
              ) : (
                <div
                  className={`p-4 border-b border-gray-200 flex flex-col justify-center items-center w-full aspect-video border bg-${bgColor}-${shade}`}
                >
                  <h3 className="text-xl font-semibold">{formatSeasonLabel(season.seasonId)}</h3>
                  <h3 className="text-lg font-light">{season.year}</h3>
                </div>
              )}
            </Link>
          );
        })}
      </GridSection>
    </div>
  );
}
