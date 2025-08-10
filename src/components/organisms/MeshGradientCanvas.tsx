"use client";

import React, { useEffect, useRef } from "react";

type MeshGradientCanvasProps = {
  colorShades: string[][];
  blendMode?: "blended" | "stepped";
  intensity?: number;
  speed?: number;
  backgroundColor?: string;
};

// Helper function to resolve CSS variables to computed color values
const resolveCSSColor = (color: string): string => {
  if (typeof window === "undefined") return color;

  // Create a temporary element to compute the color
  const tempElement = document.createElement("div");
  tempElement.style.color = color;
  document.body.appendChild(tempElement);

  const computedColor = window.getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement);

  return computedColor || color;
};

type Blob = {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  color: string;
};

export const MeshGradientCanvas: React.FC<MeshGradientCanvasProps> = ({
  colorShades,
  blendMode = "blended",
  intensity = 0.05,
  speed = 1,
  backgroundColor = "transparent",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const blobsRef = useRef<Blob[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get parent container dimensions instead of window dimensions
    const updateCanvasDimensions = () => {
      const parentRect = canvas.parentElement?.getBoundingClientRect();

      // Use parent dimensions if available, otherwise fallback to window
      const width = parentRect?.width || window.innerWidth;
      const height = parentRect?.height || window.innerHeight;

      dimensionsRef.current.width = canvas.width = width;
      dimensionsRef.current.height = canvas.height = height;
    };

    // Initialize canvas dimensions
    updateCanvasDimensions();

    const createBlobsLocal = (width: number, height: number, count = 10): Blob[] => {
      const newBlobs: Blob[] = [];
      // Resolve all CSS variables to actual color values
      const resolvedColors = colorShades.flat().map((color) => resolveCSSColor(color));

      // Calculate base blob size based on viewport dimensions
      const baseSize = Math.min(width, height);
      const minRadius = baseSize * 0.2; // 20% of smaller dimension
      const maxRadius = baseSize * 0.3; // 30% of smaller dimension

      for (let i = 0; i < count; i++) {
        const r = minRadius + Math.random() * (maxRadius - minRadius);
        newBlobs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r,
          dx: (Math.random() - 0.5) * speed,
          dy: (Math.random() - 0.5) * speed,
          color: resolvedColors[Math.floor(Math.random() * resolvedColors.length)],
        });
      }
      return newBlobs;
    };

    // Initialize blobs only once
    blobsRef.current = createBlobsLocal(dimensionsRef.current.width, dimensionsRef.current.height, 20);

    const draw = () => {
      if (!ctx) return;
      const { width, height } = dimensionsRef.current;

      // Clear the canvas and set background
      ctx.clearRect(0, 0, width, height);

      // Apply background color if specified
      if (backgroundColor !== "transparent") {
        const resolvedBgColor = resolveCSSColor(backgroundColor);
        ctx.fillStyle = resolvedBgColor;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.globalAlpha = blendMode === "blended" ? 0.5 : 1;

      blobsRef.current.forEach((blob) => {
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);

        if (blendMode === "blended") {
          gradient.addColorStop(0, blob.color);
          gradient.addColorStop(1, "transparent");
        } else {
          // stepped gradient with bands
          for (let i = 0; i <= 10; i++) {
            const stop = i / 10;
            const originalShade = colorShades.find((shades) => shades.includes(blob.color))?.[i] || blob.color;
            const bandColor = resolveCSSColor(originalShade);
            gradient.addColorStop(stop, bandColor);
          }
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();

        // movement with subtle mouse influence (like water currents)
        const mouseDiffX = mouseRef.current.x - blob.x / width;
        const mouseDiffY = mouseRef.current.y - blob.y / height;
        const distance = Math.sqrt(mouseDiffX * mouseDiffX + mouseDiffY * mouseDiffY);

        // Apply influence that decreases with distance, like water ripples
        const influenceStrength = Math.max(0, 1 - distance * 2) * intensity;
        const mouseInfluenceX = mouseDiffX * influenceStrength * 0.5;
        const mouseInfluenceY = mouseDiffY * influenceStrength * 0.5;

        blob.x += blob.dx + mouseInfluenceX;
        blob.y += blob.dy + mouseInfluenceY;

        // bounce
        if (blob.x < 0 || blob.x > width) blob.dx *= -1;
        if (blob.y < 0 || blob.y > height) blob.dy *= -1;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { width, height } = dimensionsRef.current;
      mouseRef.current = {
        x: e.clientX / width,
        y: e.clientY / height,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [colorShades, blendMode, intensity, speed, backgroundColor]);

  // Separate effect for handling resize without recreating blobs
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Update canvas dimensions using parent container
      const parentRect = canvas.parentElement?.getBoundingClientRect();
      const width = parentRect?.width || window.innerWidth;
      const height = parentRect?.height || window.innerHeight;

      dimensionsRef.current.width = canvas.width = width;
      dimensionsRef.current.height = canvas.height = height;

      // Scale existing blob sizes based on new dimensions
      const baseSize = Math.min(width, height);
      const minRadius = baseSize * 0.2;
      const maxRadius = baseSize * 0.3;
      const radiusRange = maxRadius - minRadius;

      blobsRef.current.forEach((blob) => {
        // Normalize current radius to 0-1 range, then scale to new dimensions
        const normalizedRadius = Math.random(); // You could store original normalized values if needed
        blob.r = minRadius + normalizedRadius * radiusRange;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full z-[-1] absolute top-0 left-0 pointer-events-none" />;
};
