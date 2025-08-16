"use client";

import React, { useEffect, useRef } from "react";

type MeshGradientStraightProps = {
  colorShades: string[][];
  blendMode?: "blended" | "stepped";
  intensity?: number;
  backgroundColor?: string;
  tone?: "light" | "dark";
};

type Line = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
};

// Cache for resolved colors to avoid repeated DOM operations
const colorCache = new Map<string, string>();

const resolveCSSColor = (color: string): string => {
  if (typeof window === "undefined") return color;

  // Check cache first
  if (colorCache.has(color)) {
    return colorCache.get(color)!;
  }

  const el = document.createElement("div");
  el.style.color = color;
  el.style.visibility = "hidden";
  el.style.position = "absolute";
  el.style.pointerEvents = "none";
  document.body.appendChild(el);
  const computed = window.getComputedStyle(el).color;
  document.body.removeChild(el);

  const result = computed || color;
  // Cache the result
  colorCache.set(color, result);
  return result;
};

export const MeshGradientStraight: React.FC<MeshGradientStraightProps> = ({
  colorShades,
  blendMode = "blended",
  backgroundColor = "transparent",
  tone = "light",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const linesRef = useRef<Line[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const createLines = (width: number, height: number): Line[] => {
      const resolvedColors = colorShades.flat().map(resolveCSSColor);
      const lines: Line[] = [];

      const centerX = width / 2;
      const centerY = height / 2;
      const lineLength = Math.max(width, height) * 1.5; // Make lines long enough to cross the entire canvas

      // Create 5 lines, each rotated 10 degrees clockwise from the previous
      for (let i = 0; i < 5; i++) {
        const angle = i * 30 * (Math.PI / 180); // Convert degrees to radians

        // Calculate start and end points for a line passing through the center
        const halfLength = lineLength / 2;
        const startX = centerX - Math.cos(angle) * halfLength;
        const startY = centerY - Math.sin(angle) * halfLength;
        const endX = centerX + Math.cos(angle) * halfLength;
        const endY = centerY + Math.sin(angle) * halfLength;

        lines.push({
          startX,
          startY,
          endX,
          endY,
          color: resolvedColors[i % resolvedColors.length],
        });
      }

      return lines;
    };

    const updateDimensions = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const width = rect?.width || window.innerWidth;
      const height = rect?.height || window.innerHeight;
      dimensionsRef.current.width = canvas.width = width;
      dimensionsRef.current.height = canvas.height = height;
    };

    updateDimensions();
    linesRef.current = createLines(dimensionsRef.current.width, dimensionsRef.current.height);

    const draw = () => {
      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      if (backgroundColor !== "transparent") {
        ctx.fillStyle = resolveCSSColor(backgroundColor);
        ctx.fillRect(0, 0, width, height);
      }

      // Set blend mode based on tone
      const globalCompositeOperation = tone === "dark" ? "multiply" : "source-over";

      linesRef.current.forEach((line) => {
        const { startX, startY, endX, endY, color } = line;

        // Calculate proportional line width based on viewport dimensions
        const baseSize = Math.min(width, height);
        const scaleFactor = baseSize / 1000; // Normalize to a base size of 1000px
        const baseLineWidth = blendMode === "blended" ? 700 : 120;
        const lineWidth = baseLineWidth * scaleFactor;
        const layers = 7; // Number of layers for soft edge effect

        // Set composite operation for the entire line based on tone
        ctx.globalCompositeOperation = globalCompositeOperation;

        for (let layer = 0; layer < layers; layer++) {
          const progress = layer / (layers - 1); // 0 to 1
          const currentWidth = lineWidth * (1 - progress * 2); // Shrink width

          // Adjust alpha based on tone - for dark mode, use higher alpha to get darker results
          let alpha: number;
          if (tone === "dark") {
            alpha = (1 - progress) * (blendMode === "blended" ? 0.1 : 1);
          } else {
            alpha = (1 - progress) * (blendMode === "blended" ? 0.1 : 1);
          }

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);

          // Use the original color with alpha applied
          ctx.strokeStyle = color;
          ctx.lineWidth = currentWidth;
          ctx.globalAlpha = alpha; // Apply alpha via globalAlpha
          ctx.stroke();
        }

        // Reset for next line
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      });
    };

    draw(); // Draw once since there's no animation
  }, [colorShades, blendMode, backgroundColor, tone]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.parentElement?.getBoundingClientRect();
      const newWidth = rect?.width || window.innerWidth;
      const newHeight = rect?.height || window.innerHeight;

      dimensionsRef.current.width = canvas.width = newWidth;
      dimensionsRef.current.height = canvas.height = newHeight;

      // Recreate lines for new dimensions
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const centerX = newWidth / 2;
        const centerY = newHeight / 2;
        const lineLength = Math.max(newWidth, newHeight) * 1.5;

        linesRef.current.forEach((line, i) => {
          const angle = i * 10 * (Math.PI / 180);
          const halfLength = lineLength / 2;
          line.startX = centerX - Math.cos(angle) * halfLength;
          line.startY = centerY - Math.sin(angle) * halfLength;
          line.endX = centerX + Math.cos(angle) * halfLength;
          line.endY = centerY + Math.sin(angle) * halfLength;
        });

        // Redraw after resize
        const { width, height } = dimensionsRef.current;
        ctx.clearRect(0, 0, width, height);

        if (backgroundColor !== "transparent") {
          ctx.fillStyle = resolveCSSColor(backgroundColor);
          ctx.fillRect(0, 0, width, height);
        }

        const globalCompositeOperation = tone === "dark" ? "multiply" : "source-over";

        linesRef.current.forEach((line) => {
          const { startX, startY, endX, endY, color } = line;
          const baseSize = Math.min(width, height);
          const scaleFactor = baseSize / 1000;
          const baseLineWidth = blendMode === "blended" ? 700 : 120;
          const lineWidth = baseLineWidth * scaleFactor;
          const layers = 7;

          ctx.globalCompositeOperation = globalCompositeOperation;

          for (let layer = 0; layer < layers; layer++) {
            const progress = layer / (layers - 1);
            const currentWidth = lineWidth * (1 - progress * 2);

            let alpha: number;
            if (tone === "dark") {
              alpha = (1 - progress) * (blendMode === "blended" ? 0.1 : 1);
            } else {
              alpha = (1 - progress) * (blendMode === "blended" ? 0.1 : 1);
            }

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = color;
            ctx.lineWidth = currentWidth;
            ctx.globalAlpha = alpha;
            ctx.stroke();
          }

          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "source-over";
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [colorShades, blendMode, backgroundColor, tone]);

  return <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0 z-[-1] pointer-events-none" />;
};
