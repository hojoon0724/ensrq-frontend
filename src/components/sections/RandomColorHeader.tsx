"use client";

import { MovingGradientText } from "@/components/atoms";
import { SectionMeshGradient } from "@/components/sections";
import { useEffect, useState } from "react";

interface RandomColorHeaderProps {
  title: string;
  className?: string;
}

export default function RandomColorHeader({ title }: RandomColorHeaderProps) {
  const [colors, setColors] = useState({
    randomColor: "sand",
    randomTextColor: "sand",
    randomTone: "light" as "light" | "dark",
    textTone: "dark" as "light" | "dark",
  });

  useEffect(() => {
    const colorOptions = ["sand", "sky", "water"];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    const randomTextColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    const randomTone = Math.random() < 0.5 ? "light" : "dark";
    const textTone = randomTone === "light" ? "dark" : "light";

    setColors({
      randomColor,
      randomTextColor,
      randomTone,
      textTone,
    });
  }, []);

  return (
    <>
    <SectionMeshGradient
      color1={colors.randomColor}
      backgroundColor={colors.randomColor}
      tone={colors.randomTone}
     className="h-[max(30svh,400px)] flex flex-col justify-center items-center"
    >
      <MovingGradientText
        text={title}
        className="text-6xl lg:text-8xl font-bold"
        gradientColor={colors.randomTextColor}
        tone={colors.textTone}
      />
    </SectionMeshGradient>
    </>
  );
}
