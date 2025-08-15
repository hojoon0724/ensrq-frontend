"use client";

import { MovingGradientText } from "@/components/atoms";
import { TicketsTable } from "@/components/organisms/TicketsTable";
import { SectionMeshGradient } from "@/components/sections";
import { useEffect, useState } from "react";

import LiveData from "@/data/live-data.json";
import { formatSeasonLabel } from "../../utils/textFormat";

const currentSeason = LiveData[0];

export default function Tickets() {
  const [colors, setColors] = useState({
    randomColor: "sand",
    randomTextColor: "sand",
    randomTone: "dark" as "light" | "dark",
    textTone: "light" as "light" | "dark",
    textShade: 200,
  });

  useEffect(() => {
    const colorOptions = ["sand", "sky", "water"];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    const randomTextColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

    // Easy to change: just modify this line to "light" or "dark" as needed
    const randomTone = "dark" as "light" | "dark"; // or "light" - change this to switch tones
    const textTone = randomTone === "light" ? "dark" : "light";
    const textShade = randomTone === "light" ? 700 : 200;

    setColors({
      randomColor,
      randomTextColor,
      randomTone,
      textTone,
      textShade,
    });
  }, []);

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
