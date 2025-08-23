"use client";

import { DEFAULT_RUNTIME_WEBPACK } from "next/dist/shared/lib/constants";

type SteppedCurvesProps = {
  color1: string;
  color2?: string;
  color3?: string;
  speed?: number;
  tone?: "light" | "dark";
};

type ControlPoint = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

export function MeshGradientCurves({ color1, color2, color3, speed, tone }: SteppedCurvesProps) {
  const toneShades = tone === "dark" ? 900 : 50;
  const backgroundShade = tone === "dark" ? 400 : 950;

  function getColors(color1: string, color2?: string, color3?: string): string[]{
    switch (tone) {
      case "dark":
        return [color1, color2, color3].map(color => color ? color : "transparent");
      case "light":
        return [color1, color2, color3].filter(Boolean) as string[];
      default:
        return [];
    }
  }
}
