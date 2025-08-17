"use client";

import React, { useEffect, useRef } from "react";

type MeshGradientManualCurvesProps = {
  colorShades: string[][];
  intensity?: number;
  speed?: number;
  backgroundColor?: string;
  tone?: "light" | "dark";
  baselineWidth?: number;
  lineCount?: number;
  nodeCount?: number;
  nodes: Array<Array<{ x: number; y: number }>>;
};

type ControlPoint = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

type Curve = {
  points: ControlPoint[];
  color: string;
};

// Cache for resolved colors to avoid repeated DOM operations
const colorCache = new Map<string, string>();

// Function to clear the color cache (useful if CSS custom properties change)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clearColorCache = () => {
  colorCache.clear();
};

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

export const MeshGradientManualCurves: React.FC<MeshGradientManualCurvesProps> = ({
  colorShades,
  speed = 0,
  backgroundColor = "transparent",
  tone = "light",
  baselineWidth = 20,
  lineCount = 6,
  nodeCount = 4,
  nodes = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const curvesRef = useRef<Curve[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const createCurves = (width: number, height: number, count = lineCount): Curve[] => {
      const resolvedColors = colorShades.flat().map(resolveCSSColor);
      const curves: Curve[] = [];

      // Calculate proportional values based on viewport size
      const baseSize = Math.min(width, height);
      const scaleFactor = baseSize / 1000; // Normalize to a base size of 1000px
      const proportionalSpeed = speed * scaleFactor;

      // Create main curves
      for (let i = 0; i < count; i++) {
        const points: ControlPoint[] = [];

        // Use the passed nodes for this line
        const lineNodes = nodes[i] || [];

        for (let j = 0; j < nodeCount; j++) {
          let x = 0;
          let y = 50; // Default to middle

          if (lineNodes[j]) {
            x = lineNodes[j].x;
            y = lineNodes[j].y;
          } else {
            // Fallback if no node provided - distribute evenly
            x = (j / (nodeCount - 1)) * 100;
            y = 50;
          }

          points.push({
            x: (x / 100) * width, // Convert percentage to pixels
            y: (y / 100) * height,
            dx: (Math.random() - 0.5) * proportionalSpeed * 0.5,
            dy: (Math.random() - 0.5) * proportionalSpeed,
          });
        }

        curves.push({
          points,
          color: resolvedColors[Math.floor(Math.random() * resolvedColors.length)],
        });
      }

      return curves;
    };

    const updateDimensions = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const width = rect.width;
      const height = rect.height;

      // Ensure dimensions are valid and not zero
      if (width <= 0 || height <= 0) return;

      // Set both canvas display size and internal resolution
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      dimensionsRef.current.width = width;
      dimensionsRef.current.height = height;
    };

    updateDimensions();
    curvesRef.current = createCurves(dimensionsRef.current.width, dimensionsRef.current.height);

    const draw = () => {
      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      if (backgroundColor !== "transparent") {
        ctx.fillStyle = resolveCSSColor(backgroundColor);
        ctx.fillRect(0, 0, width, height);
      }

      // Set blend mode based on tone
      const globalCompositeOperation = tone === "dark" ? "multiply" : "source-over";

      curvesRef.current.forEach((curve, curveIndex) => {
        const { points, color } = curve;

        // Calculate proportional line width based on viewport dimensions
        const baseSize = Math.min(width, height);
        const scaleFactor = baseSize / 1000;
        const baseLineWidth = baselineWidth;
        const lineWidth = baseLineWidth * scaleFactor;
        const layers = 7;

        // Set composite operation for the entire curve based on tone
        ctx.globalCompositeOperation = globalCompositeOperation;

        for (let layer = 0; layer < layers; layer++) {
          const progress = layer / (layers - 1);
          const currentWidth = lineWidth * (1 - progress * 2);

          const alpha = (1 - progress) * 0.15;

          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);

          for (let i = 1; i < points.length; i++) {
            if (i === points.length - 1) {
              ctx.lineTo(points[i].x, points[i].y);
            } else {
              const xc = (points[i].x + points[i + 1].x) / 2;
              const yc = (points[i].y + points[i + 1].y) / 2;
              ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
          }

          ctx.strokeStyle = color;
          ctx.lineWidth = currentWidth;
          ctx.globalAlpha = alpha;
          ctx.stroke();
        }

        // Reset for next curve
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";

        // Keep positions static - update based on current nodes
        const currentNodes = nodes[curveIndex] || [];
        for (let i = 0; i < Math.min(points.length, currentNodes.length); i++) {
          const node = currentNodes[i];
          points[i].x = (node.x / 100) * width;
          points[i].y = (node.y / 100) * height;
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [baselineWidth, lineCount, nodeCount, colorShades, speed, backgroundColor, tone, nodes]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const newWidth = rect.width;
      const newHeight = rect.height;

      // Ensure dimensions are valid and not zero
      if (newWidth <= 0 || newHeight <= 0) return;

      // Set both canvas display size and internal resolution
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      ctx.scale(dpr, dpr);

      dimensionsRef.current.width = newWidth;
      dimensionsRef.current.height = newHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0 z-[-1] pointer-events-none object-contain" />
  );
};
