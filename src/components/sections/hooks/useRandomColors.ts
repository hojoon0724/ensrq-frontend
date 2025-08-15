"use client";

import { useEffect, useState } from "react";

export interface RandomColors {
  randomColor: "sand" | "sky" | "water";
  randomTextColor: "sand" | "sky" | "water";
  randomTone: "light" | "dark";
  textTone: "light" | "dark";
  textShade: number;
}

export function useRandomColors(forceTone?: "light" | "dark"): RandomColors {
  const [colors, setColors] = useState<RandomColors>({
    randomColor: "sand",
    randomTextColor: "sand",
    randomTone: "dark",
    textTone: "light",
    textShade: 200,
  });

  useEffect(() => {
    const colorOptions: ("sand" | "sky" | "water")[] = ["sand", "sky", "water"];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    const randomTextColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

    const randomTone = forceTone || (Math.random() < 0.5 ? "light" : "dark");
    const textTone = randomTone === "light" ? "dark" : "light";
    const textShade = randomTone === "light" ? 700 : 200;

    setColors({
      randomColor,
      randomTextColor,
      randomTone,
      textTone,
      textShade,
    });
  }, [forceTone]);

  return colors;
}
