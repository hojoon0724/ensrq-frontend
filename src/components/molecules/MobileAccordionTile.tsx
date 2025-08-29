"use client";

import { Image } from "@/components/atoms";
import { useEffect, useRef, useState } from "react";

interface MobileAccordionTileProps {
  profile: {
    id: string;
    image: {
      width: number;
      height: number;
      xCenter: number;
      yCenter: number;
    };
    name: string;
    bio: string;
  };
  themeColor?: "sand" | "water" | "sky";
  backgroundTone?: "light" | "dark";
  index?: number;
  isExpanded: boolean;
  onToggle: (profileId: string) => void;
}

export function MobileAccordionTile({
  profile,
  themeColor = "sand",
  backgroundTone = "dark",
  index = 0,
  isExpanded,
  onToggle,
}: MobileAccordionTileProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [profile.bio, isExpanded]);

  const colorClasses = {
    sand: {
      gradient: "from-sand-900/90 via-sand-800/70 to-transparent",
      bioBackground: "bg-sand-50/95",
      bioTextColor: "text-sand-900",
      borderColor: "border-sand-200",
      accent: "sand-400",
    },
    water: {
      gradient: "from-water-900/90 via-water-800/70 to-transparent",
      bioBackground: "bg-water-50/95",
      bioTextColor: "text-water-900",
      borderColor: "border-water-200",
      accent: "water-400",
    },
    sky: {
      gradient: "from-sky-900/90 via-sky-800/70 to-transparent",
      bioBackground: "bg-sky-50/95",
      bioTextColor: "text-sky-900",
      borderColor: "border-sky-200",
      accent: "sky-400",
    },
  };

  const colors = colorClasses[themeColor];

  // Determine overlay and text colors based on backgroundTone
  const overlayClasses = {
    light: {
      nameTextColor: "text-black",
      iconBackground: "bg-black/20",
      iconTextColor: "text-black",
      bioOverlay: "bg-black/0",
      bioBackground: "bg-black/80",
      bioTextColor: "text-white",
    },
    dark: {
      nameTextColor: "text-white",
      iconBackground: "bg-white/20",
      iconTextColor: "text-white",
      bioOverlay: "bg-white/0",
      bioBackground: "bg-white/80",
      bioTextColor: "text-black",
    },
  };

  const overlayColors = overlayClasses[backgroundTone];

  return (
    <div
      id={`profile-${profile.id}`}
      ref={tileRef}
      className={`
        relative overflow-hidden transition-all duration-500 ease-out
        ${isExpanded ? "shadow-xl" : "shadow-md"}
      `}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Image Header - Always Visible */}
      <div className="relative h-32 cursor-pointer" onClick={() => onToggle(profile.id)}>
        <Image
          src={`/photos/about/about-${profile.id}.webp`}
          alt={profile.name}
          fill
          xCenter={profile.image.xCenter}
          yCenter={profile.image.yCenter}
          sizes="100vw"
          className={`
            object-cover transition-all duration-700 ease-out
            ${isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
            ${isExpanded ? "scale-105" : "hover:scale-102"}
          `}
          onLoad={() => setIsImageLoaded(true)}
          priority={index < 4}
        />

        {/* Simple Overlay - removed gradient */}
        <div
          className={`
            absolute inset-0 ${overlayColors.bioOverlay}
            transition-opacity duration-300
            ${isExpanded ? "opacity-70" : "opacity-50"}
          `}
        />

        {/* Name and Toggle Indicator */}
        <div
          className={`absolute inset-0 flex items-center justify-between p-4 ${isExpanded ? "" : overlayColors.bioOverlay}`}
        >
          <h3 className={`${overlayColors.nameTextColor} font-bold text-lg sm:text-xl flex-1 text-shadow-lg`}>
            {profile.name}
          </h3>

          {/* Expand/Collapse Indicator */}
          <div
            className={`
            w-8 h-8 rounded-full ${overlayColors.iconBackground} backdrop-blur-sm
            flex items-center justify-center transition-all duration-300
            ${isExpanded ? "rotate-180" : "rotate-0"}
          `}
          >
            <svg
              className={`w-4 h-4 ${overlayColors.iconTextColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Accent Line */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-1 transition-all duration-300
            bg-${colors.accent}
            ${isExpanded ? "opacity-100" : "opacity-60"}
          `}
        />
      </div>

      {/* Expandable Bio Content */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-out border-l-4
          ${isExpanded ? `border-${colors.accent}` : "border-transparent"}
        `}
        style={{
          maxHeight: isExpanded ? `${Math.min(contentHeight + 48, 400)}px` : "0px",
        }}
      >
        <div
          ref={contentRef}
          className={`
            ${overlayColors.bioBackground} backdrop-blur-sm p-6
            border-t border-b ${colors.borderColor}
          `}
        >
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            <p
              className={`
                ${overlayColors.bioTextColor} text-sm leading-relaxed
              `}
              dangerouslySetInnerHTML={{ __html: profile.bio }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={() => onToggle(profile.id)}
            className={`
              my-2 px-4 py-2 text-xs font-medium rounded-full transition-all duration-300
              ${overlayColors.bioBackground} ${overlayColors.bioTextColor} border ${colors.borderColor}
              hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
              flex items-center gap-2 mx-auto
            `}
          >
            <span>Close</span>
            <svg
              className={`w-3 h-3 rotate-180 ${overlayColors.bioTextColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
