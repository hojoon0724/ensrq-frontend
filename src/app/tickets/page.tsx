"use client";

import { MovingGradientText } from "@/components/atoms";
import { TicketsTable } from "@/components/organisms/TicketsTable";
import { SectionMeshGradient, useRandomColors } from "@/components/sections";

import allSeasons from "@/data/serve/seasons.json";
import { formatSeasonLabel } from "@/utils";

// Get the current season based on date or fall back to the latest season
const getCurrentSeason = () => {
  if (!allSeasons || allSeasons.length === 0) {
    throw new Error("No seasons data available");
  }

  // Sort by seasonId to ensure correct order (s01, s02, ..., s10)
  const sortedSeasons = [...allSeasons].sort((a, b) => {
    const aNum = parseInt(a.seasonId.replace("s", ""));
    const bNum = parseInt(b.seasonId.replace("s", ""));
    return aNum - bNum;
  });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JS months are 0-indexed

  // Find season based on year range (e.g., "2024-2025" means Aug 2024 to July 2025)
  const activeSeason = sortedSeasons.find((season) => {
    const [startYear, endYear] = season.year.split("-").map(Number);

    // Season typically runs from August of start year to July of end year
    if (currentYear === startYear && currentMonth >= 8) return true;
    if (currentYear === endYear && currentMonth <= 7) return true;
    if (currentYear > startYear && currentYear < endYear) return true;

    return false;
  });

  // If no active season found (e.g., during summer break), return the latest season
  return activeSeason || sortedSeasons[sortedSeasons.length - 1];
};

const currentSeason = getCurrentSeason();

export default function Tickets() {
  const colors = useRandomColors();

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
