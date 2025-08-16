"use client";

import React, { useEffect, useRef } from "react";

type MeshGradientManualCurvesProps = {
  colorShades: string[][];
  blendMode?: "blended" | "stepped";
  intensity?: number;
  speed?: number;
  backgroundColor?: string;
  tone?: "light" | "dark";
  baselineWidth?: number;
  lineCount?: number;
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
        // Scale segment count based on height - more segments for taller viewports
        const baseSegments = Math.max(2, Math.floor(height / 300)); // One segment per 300px height
        const segments = baseSegments + Math.floor(Math.random() * Math.max(2, baseSegments / 2));

        for (let j = 0; j <= segments; j++) {
          points.push({
            x: (j / segments) * width * 1.2 - width * 0.1, // Extend beyond edges
            y: Math.random() * height,
            dx: (Math.random() - 0.5) * proportionalSpeed * 0.5, // Slower random movement
            dy: (Math.random() - 0.5) * proportionalSpeed,
          });
        }

        curves.push({
          points,
          color: resolvedColors[Math.floor(Math.random() * resolvedColors.length)],
        });
      }

      // Add extra edge curves - top and bottom
      const edgeCurves = Math.max(1, Math.floor(baseSize / 400)); // Scale number of edge curves
      for (let i = 0; i < edgeCurves; i++) {
        // Top edge curve
        const topPoints: ControlPoint[] = [];
        const topSegments = Math.max(3, Math.floor(width / 150)) + Math.floor(Math.random() * 4);
        const baseTopY = -height * (0.1 + i * 0.15); // Base position above canvas

        for (let j = 0; j <= topSegments; j++) {
          topPoints.push({
            x: (j / topSegments) * width * 1.2 - width * 0.1,
            y: baseTopY + (Math.random() - 0.5) * height * 0.1, // Add random Y offset
            dx: (Math.random() - 0.5) * proportionalSpeed * 0.3,
            dy: (Math.random() - 0.5) * proportionalSpeed * 0.5,
          });
        }

        // Bottom edge curve
        const bottomPoints: ControlPoint[] = [];
        const bottomSegments = Math.max(3, Math.floor(width / 150)) + Math.floor(Math.random() * 4);
        const baseBottomY = height * (1.1 + i * 0.15); // Base position below canvas

        for (let j = 0; j <= bottomSegments; j++) {
          bottomPoints.push({
            x: (j / bottomSegments) * width * 1.2 - width * 0.1,
            y: baseBottomY + (Math.random() - 0.5) * height * 0.1, // Add random Y offset
            dx: (Math.random() - 0.5) * proportionalSpeed * 0.3,
            dy: (Math.random() - 0.5) * proportionalSpeed * 0.5,
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
      const globalCompositeOperation = tone === "dark" ? "multiply" : "source-over";
      // const globalCompositeOperation = 'source-over'

      curvesRef.current.forEach((curve) => {
        const { points, color } = curve;

        // Calculate proportional line width based on viewport dimensions
        const baseSize = Math.min(width, height);
        const scaleFactor = baseSize / 1000; // Normalize to a base size of 1000px
        const baseLineWidth = baselineWidth;
        const lineWidth = baseLineWidth * scaleFactor;
        const layers = 7; // Number of layers for soft edge effect

        // Set composite operation for the entire curve based on tone
        ctx.globalCompositeOperation = globalCompositeOperation;

        for (let layer = 0; layer < layers; layer++) {
          const progress = layer / (layers - 1); // 0 to 1
          const currentWidth = lineWidth * (1 - progress * 2); // Shrink width

          // Adjust alpha based on tone - for dark mode, use higher alpha to get darker results
          const alpha = (1 - progress) * 0.1;

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

          // Calculate proportional margins and buffers
          const baseSize = Math.min(width, height);
          const proportionalMargin = Math.max(width * 0.05, baseSize * 0.02); // Minimum proportional buffer
          const extendedMargin = Math.max(width * 0.2, baseSize * 0.1); // Extended boundary margin

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

            // Get boundaries from neighboring points using proportional buffer
            const leftBound = points[i - 1].x + proportionalMargin;
            const rightBound = points[i + 1].x - proportionalMargin;

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

          // For middle points, additional extended X bounds check with proportional margins
          if (i !== 0 && i !== points.length - 1) {
            if (point.x < -extendedMargin || point.x > width + extendedMargin) {
              point.dx *= -1;
              point.x = Math.max(-extendedMargin, Math.min(width + extendedMargin, point.x));
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
  }, [baselineWidth, lineCount, colorShades, speed, backgroundColor, tone]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.parentElement?.getBoundingClientRect();
      const newWidth = rect?.width || window.innerWidth;
      const newHeight = rect?.height || window.innerHeight;

      const oldWidth = dimensionsRef.current.width;
      const oldHeight = dimensionsRef.current.height;

      dimensionsRef.current.width = canvas.width = newWidth;
      dimensionsRef.current.height = canvas.height = newHeight;

      // Scale existing curves proportionally when dimensions change
      if (oldWidth > 0 && oldHeight > 0 && curvesRef.current.length > 0) {
        const widthRatio = newWidth / oldWidth;
        const heightRatio = newHeight / oldHeight;
        const newBaseSize = Math.min(newWidth, newHeight);
        const oldBaseSize = Math.min(oldWidth, oldHeight);
        const speedScaleFactor = newBaseSize / oldBaseSize;

        curvesRef.current.forEach((curve) => {
          curve.points.forEach((point) => {
            // Scale positions proportionally
            point.x *= widthRatio;
            point.y *= heightRatio;

            // Scale movement speeds proportionally
            point.dx *= speedScaleFactor;
            point.dy *= speedScaleFactor;
          });
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0 z-[-1] pointer-events-none" />;
};
