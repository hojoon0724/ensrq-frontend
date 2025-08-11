"use client";

import { Button, MovingGradientText } from "@/components/atoms";
import { ProgramTile } from "@/components/molecules";
import { SectionEmpty } from "@/components/sections";
import { SectionMeshGradient } from "@/components/sections/SectionMeshGradient";
import { Concert } from "@/types";
import { getVenueData } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RandomColorConcertHeaderProps {
  concertData: Concert;
  children?: React.ReactNode;
}

export default function RandomColorConcertHeader({ concertData, children }: RandomColorConcertHeaderProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    const formattedDate = formatDate(dateString);
    if (timeString) {
      return `${formattedDate} at ${timeString}`;
    }
    return formattedDate;
  };

  return (
    <>
      <SectionMeshGradient
        color1={colors.randomColor}
        backgroundColor={colors.randomColor}
        className="h-[max(30svh,400px)] flex flex-col justify-center items-center"
        tone={colors.randomTone}
      >
        <MovingGradientText
          text={concertData.title}
          className="text-4xl lg:text-6xl font-bold text-center px-4"
          gradientColor={colors.randomTextColor}
          tone={colors.textTone}
        >
          <div
            className={`concert-date-time text-lg lg:text-2xl museo-slab text-center text-${colors.randomTextColor}-${colors.textShade} mt-4`}
          >
            {formatDateTime(concertData.date, concertData.time)}
          </div>
          {concertData.venueId && (
            <div
              className={`concert-venue text-base lg:text-xl museo-slab text-center text-${colors.randomTextColor}-${colors.textShade} mt-2`}
            >
              {getVenueData(concertData.venueId)?.name}
            </div>
          )}
        </MovingGradientText>
      </SectionMeshGradient>

      <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone}>
        <div className="tickets-link-container grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {concertData.ticketsLinks?.singleLive?.url && (
            <Button color={colors.randomTextColor}>
              <Link href={concertData.ticketsLinks.singleLive.url}>
                Purchase Live Tickets
                {concertData.ticketsLinks.singleLive.price &&
                  concertData.ticketsLinks.singleLive.price > 0 &&
                  ` - $${concertData.ticketsLinks.singleLive.price}`}
              </Link>
            </Button>
          )}
          {concertData.ticketsLinks?.singleStreaming?.url && (
            <Button color={colors.randomTextColor}>
              <Link href={concertData.ticketsLinks.singleStreaming.url}>
                Purchase Streaming
                {concertData.ticketsLinks.singleStreaming.price &&
                  concertData.ticketsLinks.singleStreaming.price > 0 &&
                  ` - $${concertData.ticketsLinks.singleStreaming.price}`}
              </Link>
            </Button>
          )}
        </div>
      </SectionEmpty>

      <div className={`bg-${colors.randomColor}-${colors.textShade} h-[1px] w-full`} style={{ height: "3px" }}>
        &nbsp;
      </div>

      {concertData.subtitle && (
        <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone}>
          <div className="text-center max-w-3xl mx-auto px-4">
            <p className={`text-lg text-${colors.randomColor}-100 italic`}>{concertData.subtitle}</p>
          </div>
        </SectionEmpty>
      )}

      {concertData.description && (
        <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone}>
          <div className="text-center max-w-4xl mx-auto px-4">
            <p className={`text-lg text-${colors.randomColor}-100`}>{concertData.description}</p>
          </div>
        </SectionEmpty>
      )}

      <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone} className="flex-1">
        <div className="max-w-4xl mx-auto">
          <h2 className={`font-bold text-center mb-8 text-${colors.randomColor}-${colors.textShade}`}>Program</h2>
          <div className="space-y-s">
            {concertData.program.map((programWork, index) => {
              return (
                <ProgramTile
                  key={index}
                  programWork={programWork}
                  color={colors.randomColor as "sand" | "sky" | "water"}
                  tone={colors.randomTone}
                />
              );
            })}
          </div>
        </div>
      </SectionEmpty>

      {children}
    </>
  );
}
