"use client";

import React, { useEffect, useRef } from "react";
type MeshGradientSCurveProps = {
  colorShades: string[][];
  intensity?: number;
  speed?: number;
  backgroundColor?: string;
  tone?: "light" | "dark";
  baselineWidth?: number;
  lineCount?: number;
  nodeCount?: number;
  nodes: Array<Array<{ x: number; y: number }>>;
  lockLastNodeX?: boolean;
  maxXMovement?: number;
  maxYMovement?: number;
  frozenNodeIndices?: number[];
  randomizeStart?: boolean;
};
type ControlPoint = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  initialX: number; // Store initial X coordinate for movement bounds
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
  document.body.appendChild(el);
  const computed = window.getComputedStyle(el).color;
  document.body.removeChild(el);
  const result = computed || color;
  // Cache the result
  colorCache.set(color, result);
  return result;
};

export const MeshGradientSCurve: React.FC<MeshGradientSCurveProps> = ({
  colorShades,
  speed = 1,
  backgroundColor = "transparent",
  tone = "light",
  baselineWidth = 20,
  lineCount = 6,
  nodeCount = 4,
  nodes = [],
  lockLastNodeX = false,
  maxXMovement = 10,
  maxYMovement = 10,
  frozenNodeIndices = [],
  randomizeStart = true,
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
      for (let i = 0; i < count; i++) {
        const points: ControlPoint[] = [];
        const lineNodes = nodes[i] || [];
        for (let j = 0; j < nodeCount; j++) {
          let x = 0;
          let y = 50;
          if (lineNodes[j]) {
            x = lineNodes[j].x;
            y = lineNodes[j].y;
          } else {
            // Always use equally spaced X coordinates for non-explicit nodes
            x = (j / (nodeCount - 1)) * 100;
            if (randomizeStart && !frozenNodeIndices.includes(j)) {
              // Only randomize Y coordinate when randomizeStart is true
              y = Math.random() * 100; // Random Y between 0-100%
            } else {
              y = 50;
            }
          }
          const initialXPixels = (x / 100) * width;
          points.push({
            x: initialXPixels,
            y: (y / 100) * height,
            dx: (Math.random() - 0.5) * proportionalSpeed * 0.5,
            dy: (Math.random() - 0.5) * proportionalSpeed,
            initialX: initialXPixels, // Store initial X position for movement bounds
          });
        }
        const colorIndex = i % resolvedColors.length;
        curves.push({
          points,
          color: resolvedColors[colorIndex],
        });
      }
      return curves;
    };

    const updateDimensions = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const width = rect.width;
      const height = rect.height;
      if (width <= 0 || height <= 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
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
      const globalCompositeOperation = tone === "dark" ? "multiply" : "source-over";

      curvesRef.current.forEach((curve, curveIndex) => {
        const { points, color } = curve;
        const baseSize = Math.min(width, height);
        const scaleFactor = baseSize / 1000;
        const baseLineWidth = baselineWidth;
        const lineWidth = baseLineWidth * scaleFactor;
        const layers = 7;
        ctx.globalCompositeOperation = globalCompositeOperation;
        for (let layer = 0; layer < layers; layer++) {
          const progress = layer / (layers - 1);
          const currentWidth = lineWidth * (1 - progress * 2);
          const alpha = (1 - progress) * 0.2;
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
          ctx.lineCap = "round";
          ctx.globalAlpha = alpha;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        // Animate points with random movement, but keep endpoints anchored to nodes
        const currentNodes = nodes[curveIndex] || [];
        for (let i = 0; i < points.length; i++) {
          // Check if this node index is frozen
          const isNodeFrozen = frozenNodeIndices.includes(i);

          // If node is provided, anchor to node position
          if (currentNodes[i]) {
            points[i].x = (currentNodes[i].x / 100) * width;
            points[i].y = (currentNodes[i].y / 100) * height;
          } else if (!isNodeFrozen) {
            // Otherwise, allow random movement within bounds (unless frozen)
            const point = points[i];

            // Handle last node X locking
            const isLastNode = i === points.length - 1;

            // X movement: respect maxXMovement and lockLastNodeX
            if (!lockLastNodeX || !isLastNode) {
              const maxXPixels = (maxXMovement / 100) * width;
              const newX = point.x + point.dx;
              // Use initial X position as the center point for movement bounds
              const minX = Math.max(0, point.initialX - maxXPixels);
              const maxX = Math.min(width, point.initialX + maxXPixels);

              if (newX >= minX && newX <= maxX) {
                point.x = newX;
              } else {
                point.dx *= -1;
                point.x = Math.max(minX, Math.min(maxX, point.x));
              }
            } else if (lockLastNodeX && isLastNode) {
              // Lock last node to x = 100%
              point.x = width;
            }

            // Y movement: respect maxYMovement based on previous node's Y value
            let referenceY = point.y; // Default to current position
            if (i > 0) {
              // Use previous node's Y position as reference
              referenceY = points[i - 1].y;
            }

            const maxYPixels = (maxYMovement / 100) * height;
            const newY = point.y + point.dy;
            const minY = Math.max(0, referenceY - maxYPixels);
            const maxY = Math.min(height, referenceY + maxYPixels);

            if (newY >= minY && newY <= maxY) {
              point.y = newY;
            } else {
              point.dy *= -1;
              point.y = Math.max(minY, Math.min(maxY, point.y));
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
  }, [
    baselineWidth,
    lineCount,
    nodeCount,
    colorShades,
    speed,
    backgroundColor,
    tone,
    nodes,
    lockLastNodeX,
    maxXMovement,
    maxYMovement,
    frozenNodeIndices,
    randomizeStart,
  ]);
  // Separate effect to update colors when colorShades change without recreating curves
  useEffect(() => {
    if (curvesRef.current.length > 0) {
      const resolvedColors = colorShades.flat().map(resolveCSSColor);
      curvesRef.current.forEach((curve, index) => {
        const colorIndex = index % resolvedColors.length;
        curve.color = resolvedColors[colorIndex];
      });
    }
  }, [colorShades]);

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
      if (newWidth <= 0 || newHeight <= 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Update initialX values proportionally when canvas is resized
      const oldWidth = dimensionsRef.current.width;
      if (oldWidth > 0 && curvesRef.current.length > 0) {
        const widthRatio = newWidth / oldWidth;
        curvesRef.current.forEach((curve) => {
          curve.points.forEach((point) => {
            point.initialX *= widthRatio;
          });
        });
      }

      dimensionsRef.current.width = newWidth;
      dimensionsRef.current.height = newHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full top-0 left-0 z-[-1] pointer-events-none object-contain" />;
};
