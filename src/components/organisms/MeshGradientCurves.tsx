"use client";

import React, { useEffect, useRef } from "react";

type MeshGradientCurvesProps = {
  colorShades: string[][];
  blendMode?: "blended" | "stepped";
  intensity?: number;
  speed?: number;
  backgroundColor?: string;
  tone?: "light" | "dark";
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

const resolveCSSColor = (color: string): string => {
  if (typeof window === "undefined") return color;
  const el = document.createElement("div");
  el.style.color = color;
  document.body.appendChild(el);
  const computed = window.getComputedStyle(el).color;
  document.body.removeChild(el);
  return computed || color;
};

export const MeshGradientCurves: React.FC<MeshGradientCurvesProps> = ({
  colorShades,
  blendMode = "blended",
  speed = 1,
  backgroundColor = "transparent",
  tone = "light",
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

    const createCurves = (width: number, height: number, count = 6): Curve[] => {
      const resolvedColors = colorShades.flat().map(resolveCSSColor);
      const curves: Curve[] = [];

      // Create main curves
      for (let i = 0; i < count; i++) {
        const points: ControlPoint[] = [];
        const segments = 2 + Math.floor(Math.random() * 4); // 4–8 segments

        for (let j = 0; j <= segments; j++) {
          points.push({
            x: (j / segments) * width * 1.2 - width * 0.1, // Extend beyond edges
            y: Math.random() * height,
            dx: (Math.random() - 0.5) * speed * 0.5, // Slower random movement
            dy: (Math.random() - 0.5) * speed,
          });
        }

        curves.push({
          points,
          color: resolvedColors[Math.floor(Math.random() * resolvedColors.length)],
        });
      }

      // Add extra edge curves - top and bottom
      const edgeCurves = 2;
      for (let i = 0; i < edgeCurves; i++) {
        // Top edge curve
        const topPoints: ControlPoint[] = [];
        const topSegments = 4 + Math.floor(Math.random() * 4);
        const baseTopY = -height * (0.1 + i * 0.15); // Base position above canvas

        for (let j = 0; j <= topSegments; j++) {
          topPoints.push({
            x: (j / topSegments) * width * 1.2 - width * 0.1,
            y: baseTopY + (Math.random() - 0.5) * height * 0.1, // Add random Y offset
            dx: (Math.random() - 0.5) * speed * 0.3,
            dy: (Math.random() - 0.5) * speed * 0.5,
          });
        }

        // Bottom edge curve
        const bottomPoints: ControlPoint[] = [];
        const bottomSegments = 4 + Math.floor(Math.random() * 4);
        const baseBottomY = height * (1.1 + i * 0.15); // Base position below canvas

        for (let j = 0; j <= bottomSegments; j++) {
          bottomPoints.push({
            x: (j / bottomSegments) * width * 1.2 - width * 0.1,
            y: baseBottomY + (Math.random() - 0.5) * height * 0.1, // Add random Y offset
            dx: (Math.random() - 0.5) * speed * 0.3,
            dy: (Math.random() - 0.5) * speed * 0.5,
          });
        }

        curves.push({
          points: topPoints,
          color: resolvedColors[Math.floor(Math.random() * resolvedColors.length)],
        });

        curves.push({
          points: bottomPoints,
          color: resolvedColors[Math.floor(Math.random() * resolvedColors.length)],
        });
      }

      return curves;
    };

    const updateDimensions = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const width = rect?.width || window.innerWidth;
      const height = rect?.height || window.innerHeight;
      dimensionsRef.current.width = canvas.width = width;
      dimensionsRef.current.height = canvas.height = height;
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
      const globalCompositeOperation = tone === 'dark' ? 'multiply' : 'source-over';
      // const globalCompositeOperation = 'source-over'

      curvesRef.current.forEach((curve) => {
        const { points, color } = curve;

        // Draw the curve with a soft edge effect using multiple strokes
        const lineWidth = blendMode === "blended" ? 300 : 120;
        const layers = 7; // Number of layers for soft edge effect

        // Set composite operation for the entire curve based on tone
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

          // Use the original color with alpha applied
          ctx.strokeStyle = color;
          ctx.lineWidth = currentWidth;
          ctx.globalAlpha = alpha; // Apply alpha via globalAlpha
          ctx.stroke();
        }

        // Reset for next curve
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";

        // Update points - natural movement only
        for (let i = 0; i < points.length; i++) {
          const point = points[i];

          // Check if this is an edge curve (positioned outside main canvas area)
          const isTopEdgeCurve = points[0].y < 0;
          const isBottomEdgeCurve = points[0].y > height;

          // Keep first and last points anchored outside canvas edges
          if (i === 0) {
            // Keep left edge point fixed outside left boundary
            point.x = -width * 0.1;
            if (!isTopEdgeCurve && !isBottomEdgeCurve) {
              point.y += point.dy;
            } else {
              // Edge curves move more slowly in Y
              point.y += point.dy * 0.3;
            }
          } else if (i === points.length - 1) {
            // Keep right edge point fixed outside right boundary
            point.x = width * 1.1;
            if (!isTopEdgeCurve && !isBottomEdgeCurve) {
              point.y += point.dy;
            } else {
              // Edge curves move more slowly in Y
              point.y += point.dy * 0.3;
            }
          } else {
            // Middle points can move naturally but with x-axis crossing constraints
            const newX = point.x + point.dx;

            // Get boundaries from neighboring points
            const leftBound = points[i - 1].x + width * 0.05; // Small buffer
            const rightBound = points[i + 1].x - width * 0.05; // Small buffer

            // Check if new position would cross boundaries
            if (newX >= leftBound && newX <= rightBound) {
              point.x = newX;
            } else {
              // Bounce off the boundary
              point.dx *= -1;
              // Ensure point stays within bounds
              point.x = Math.max(leftBound, Math.min(rightBound, point.x));
            }

            if (!isTopEdgeCurve && !isBottomEdgeCurve) {
              point.y += point.dy;
            } else {
              // Edge curves move more slowly in Y
              point.y += point.dy * 0.3;
            }
          }

          // Bounce within bounds for Y - different logic for edge curves
          if (isTopEdgeCurve) {
            // Top edge curves stay above canvas
            if (point.y > -height * 0.05 || point.y < -height * 0.4) point.dy *= -1;
            point.y = Math.max(-height * 0.4, Math.min(-height * 0.05, point.y));
          } else if (isBottomEdgeCurve) {
            // Bottom edge curves stay below canvas
            if (point.y < height * 1.05 || point.y > height * 1.4) point.dy *= -1;
            point.y = Math.max(height * 1.05, Math.min(height * 1.4, point.y));
          } else {
            // Main curves stay within canvas
            if (point.y < 0 || point.y > height) point.dy *= -1;
            point.y = Math.max(0, Math.min(height, point.y));
          }

          // For middle points, additional extended X bounds check
          if (i !== 0 && i !== points.length - 1) {
            const margin = width * 0.2;
            if (point.x < -margin || point.x > width + margin) {
              point.dx *= -1;
              point.x = Math.max(-margin, Math.min(width + margin, point.x));
            }
          }
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [colorShades, blendMode, speed, backgroundColor, tone]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      const width = rect?.width || window.innerWidth;
      const height = rect?.height || window.innerHeight;
      dimensionsRef.current.width = canvas.width = width;
      dimensionsRef.current.height = canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0 z-[-1] pointer-events-none" />;
};
