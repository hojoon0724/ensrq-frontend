"use client";

import { MovingGradientText } from "@/components/atoms";
import { TicketsTable } from "@/components/organisms/TicketsTable";
import { SectionMeshGradient, useRandomColors } from "@/components/sections";

import allSeasons from "@/data/serve/seasons.json";
import { formatSeasonLabel } from "@/utils";

const currentSeason = allSeasons[0];

export default function Tickets() {
  const colors = useRandomColors("dark");

  return (
    <>
      <SectionMeshGradient
        color1={colors.randomColor}
        backgroundColor={colors.randomColor}
        className="h-[max(30svh,400px)] flex flex-col justify-center items-center"
        tone={colors.randomTone}
      >
        <MovingGradientText
          text="Tickets"
          className="text-4xl lg:text-7xl font-bold text-center px-4"
          gradientColor={colors.randomTextColor}
          tone={colors.textTone}
        >
          <div
            className={`text-2xl lg:text-4xl museo-slab text-center text-${colors.randomTextColor}-${colors.textShade} mt-4`}
          >
            {formatSeasonLabel(currentSeason.seasonId)}
          </div>
          <div
            className={`text-lg lg:text-2xl museo-slab text-center text-${colors.randomTextColor}-${colors.textShade} mt-4`}
          >
            {currentSeason.year}
          </div>
        </MovingGradientText>
      </SectionMeshGradient>
      <TicketsTable season={currentSeason} />
    </>
  );
}
