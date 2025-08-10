"use client";

import { Button, MovingGradientText } from "@/components/atoms";
import { SectionEmpty } from "@/components/sections";
import { SectionMeshGradient } from "@/components/sections/SectionMeshGradient";
import { Season } from "@/types";
import { formatSeasonLabel } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RandomColorSeasonHeaderProps {
  seasonId: string;
  seasonData: Season;
  children?: React.ReactNode;
}

export default function RandomColorSeasonHeader({ seasonId, seasonData, children }: RandomColorSeasonHeaderProps) {
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
          text={formatSeasonLabel(seasonId)}
          className="text-6xl lg:text-8xl font-bold"
          gradientColor={colors.randomTextColor}
          tone={colors.textTone}
        >
          <div className={`season-year text-2xl museo-slab text-${colors.randomTextColor}-${colors.textShade}`}>
            {seasonData?.year}
          </div>
        </MovingGradientText>
      </SectionMeshGradient>

      <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone}>
        <div className="tickets-link-container grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {seasonData?.ticketsLinks?.seasonLive?.url && (
            <Button color={colors.randomTextColor}>
              <Link href={seasonData.ticketsLinks.seasonLive.url}>Purchase Live Season Pass</Link>
            </Button>
          )}
          {seasonData?.ticketsLinks?.seasonStreaming?.url && (
            <Button color={colors.randomTextColor}>
              <Link href={seasonData.ticketsLinks.seasonStreaming.url}>Purchase Streaming Season Pass</Link>
            </Button>
          )}
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone}>
        {children}
      </SectionEmpty>
    </>
  );
}
