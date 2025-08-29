"use client";

import { Image } from "@/components/atoms/Image";
import { randomize } from "@/utils";
import React, { useEffect, useState } from "react";

export interface PhotoMarqueeProps {
  photos: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  speed?: "slow" | "medium" | "fast" | number; // Duration in seconds or preset
  direction?: "left" | "right";
  aspectRatio?: "square" | "landscape" | "portrait" | string; // Custom aspect ratio like "16/9"
  className?: string;
  photoClassName?: string;
  gap?: number; // Gap between photos in rem
  pauseOnHover?: boolean;
  random?: boolean;
}

export function PhotoMarquee({
  photos,
  speed = "medium",
  direction = "left",
  aspectRatio = "landscape",
  className = "",
  photoClassName = "",
  gap = 1,
  pauseOnHover = true,
  random = true,
}: PhotoMarqueeProps): React.ReactNode {
  const [animationId, setAnimationId] = useState<string>("");
  const [photosToDisplay, setPhotosToDisplay] = useState(photos);

  // Generate a unique animation ID to avoid conflicts and handle client-side setup
  useEffect(() => {
    setAnimationId(`marquee-${Math.random().toString(36).substr(2, 9)}`);

    // Only shuffle on the client side to avoid hydration mismatch
    if (random) {
      setPhotosToDisplay(randomize([...photos]));
    }
  }, [photos, random]);

  // Convert speed to animation duration
  const getAnimationDuration = (speed: PhotoMarqueeProps["speed"]): string => {
    if (typeof speed === "number") {
      return `${speed}s`;
    }

    switch (speed) {
      case "slow":
        return "60s";
      case "medium":
        return "30s";
      case "fast":
        return "15s";
      default:
        return "30s";
    }
  };

  // Get aspect ratio and photo dimensions
  const getPhotoStyles = (ratio: string) => {
    switch (ratio) {
      case "square":
        return { aspectRatio: "1/1", width: "200px" };
      case "landscape":
        return { aspectRatio: "4/3", width: "250px" };
      case "portrait":
        return { aspectRatio: "3/4", width: "200px" };
      default:
        // Handle custom aspect ratio like "16/9"
        if (ratio.includes("/")) {
          return { aspectRatio: ratio, width: "250px" };
        }
        return { aspectRatio: "4/3", width: "250px" };
    }
  };

  const duration = getAnimationDuration(speed);
  const photoStyles = getPhotoStyles(aspectRatio);

  // Create enough copies to ensure smooth infinite scrolling
  const photoCopies = [...photosToDisplay, ...photosToDisplay, ...photosToDisplay];

  // Fixed photo width means we can calculate exact distances
  const photoWidth = parseInt(photoStyles.width);
  const gapPx = gap * 16; // Convert rem to px
  const totalPhotoWidth = photoWidth + gapPx;
  const oneSetWidth = totalPhotoWidth * photosToDisplay.length;
  const translateDistance = direction === "left" ? `-${oneSetWidth}px` : `${oneSetWidth}px`;

  return (
    <div className={`overflow-hidden w-full ${className}`}>
      <div
        className="flex h-full"
        style={{
          gap: `${gap}rem`,
          animation: animationId ? `${animationId} ${duration} linear infinite` : undefined,
          willChange: "transform",
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = "paused";
          }
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = "running";
          }
        }}
      >
        {photoCopies.map((photo, index) => (
          <div
            key={`${photo.src}-${index}`}
            className={`flex-shrink-0 relative ${photoClassName}`}
            style={{
              width: photoStyles.width,
              aspectRatio: photoStyles.aspectRatio,
            }}
          >
            <Image src={photo.src} alt={photo.alt} fill className="object-cover" loading="lazy" sizes="250px" />
          </div>
        ))}
      </div>

      {animationId && (
        <style jsx>{`
          @keyframes ${animationId} {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(${translateDistance});
            }
          }
        `}</style>
      )}
    </div>
  );
}
