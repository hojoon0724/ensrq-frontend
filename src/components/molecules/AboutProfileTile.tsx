"use client";

import { Image } from "@/components/atoms";
import { useEffect, useRef, useState } from "react";

interface AboutProfileTileProps {
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
  isHovered: boolean;
  onHover: (profileId: string | null) => void;
  isAnyHovered: boolean;
}

export function AboutProfileTile({
  profile,
  themeColor = "sand",
  backgroundTone = "dark",
  index = 0,
  isHovered,
  onHover,
  isAnyHovered,
}: AboutProfileTileProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const colorClasses = {
    sand: {
      gradient: "from-sand-900/90 via-sand-800/70 to-transparent",
      nameColor: "",
      bioColor: "text-sand-50",
      bioBackground: "bg-sand-50/95",
      bioTextColor: "text-black",
      accent: "sand-400",
    },
    water: {
      gradient: "from-water-900/90 via-water-800/70 to-transparent",
      nameColor: "",
      bioColor: "text-water-50",
      bioBackground: "bg-water-50/95",
      bioTextColor: "text-black",
      accent: "water-400",
    },
    sky: {
      gradient: "from-sky-900/90 via-sky-800/70 to-transparent",
      nameColor: "",
      bioColor: "text-sky-50",
      bioBackground: "bg-sky-50/95",
      bioTextColor: "text-black",
      accent: "sky-400",
    },
  };

  const colors = colorClasses[themeColor];

  // Determine overlay and text colors based on backgroundTone
  const overlayClasses = {
    light: {
      nameTextColor: "text-black",
      nameTextColorHover: "text-white", // switches to white when on dark background
      iconBackground: "bg-black/20",
      iconTextColor: "text-black",
      nameBackgroundHover: "bg-black/70",
      bioBackground: "bg-black/80",
      bioTextColor: "text-white",
    },
    dark: {
      nameTextColor: "text-white",
      nameTextColorHover: "text-black", // switches to black when on light background
      iconBackground: "bg-white/20",
      iconTextColor: "text-white",
      nameBackgroundHover: "bg-white/70",
      bioBackground: "bg-white/80",
      bioTextColor: "text-black",
    },
  };

  const overlayColors = overlayClasses[backgroundTone];

  // Calculate width based on hover state
  const getWidthClasses = () => {
    if (!isAnyHovered) {
      return "flex-1"; // Equal flex distribution when nothing is hovered
    }

    if (isHovered) {
      return "flex-[4]"; // Expanded item gets 4x the space
    }
    return "flex-[1]"; // Compressed items get 1x the space each
  };

  return (
    <div
      className={`
        relative overflow-hidden transition-all duration-700 ease-out cursor-pointer
        ${getWidthClasses()}
        min-h-[500px] lg:min-h-[600px]
        ${isAnyHovered && !isHovered ? "brightness-[60%]" : ""}
      `}
      onMouseEnter={() => onHover(profile.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => {
        // Handle mobile tap
        if (isMobile) {
          onHover(isHovered ? null : profile.id);
        }
      }}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={`/photos/about/about-${profile.id}.webp`}
          alt={profile.name}
          fill
          xCenter={profile.image.xCenter}
          yCenter={profile.image.yCenter}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`
            object-cover transition-all duration-700 ease-out
            ${isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"}
            ${isHovered ? "scale-105" : "scale-100"}
          `}
          onLoad={() => setIsImageLoaded(true)}
          priority={index < 3}
        />
      </div>

      {/* Simple Overlay - removed gradient */}
      <div
        className={`
          absolute inset-0 bg-black/20
          transition-opacity duration-500
          ${isHovered ? "opacity-60" : "opacity-40"}
        `}
      />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end">
        {/* Name - Always Visible */}
        <div className="relative z-10 h-full flex flex-col">
          <h2
            className={`
              ${isAnyHovered && isHovered ? overlayColors.nameTextColorHover : overlayColors.nameTextColor} font-light transition-all duration-500 ease-out mb-4 p-6 lg:p-8
              ${!isAnyHovered ? "text-xl lg:text-4xl lg:writing-mode-vertical-rl lg:text-orientation-mixed text-right h-full" : ""}
              ${isAnyHovered && isHovered ? `text-xl lg:text-3xl xl:text-4xl ${overlayColors.nameBackgroundHover} backdrop-blur-xl justify-start` : ""}
              ${isAnyHovered && !isHovered ? "text-base lg:text-4xl lg:writing-mode-vertical-rl lg:text-orientation-mixed text-right h-full" : ""}
            `}
          >
            {profile.name}
          </h2>
        </div>

        {/* Bio Content - Visible when hovered (desktop) or when expanded (mobile) */}
        <div
          className={`
            transform transition-all duration-500 ease-out
            ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 lg:translate-y-full lg:opacity-0"}
            ${isHovered ? "block" : "hidden lg:hidden"}
          `}
        >
          <div
            className={`
              ${overlayColors.bioBackground} backdrop-blur-xl
              transition-all duration-300 p-6 lg:p-8
            `}
          >
            <div ref={contentRef} className="max-h-64 lg:max-h-60 overflow-y-auto custom-scrollbar">
              <p
                className={`
                  ${overlayColors.bioTextColor} text-sm lg:text-base leading-relaxed
                `}
                dangerouslySetInnerHTML={{ __html: profile.bio }}
              />
            </div>
          </div>
        </div>

        {/* Subtle Accent Line */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-1 transition-all duration-300
            bg-${colors.accent}
            ${isHovered ? "opacity-100" : "opacity-50"}
          `}
        />
      </div>

      {/* Mobile Tap Indicator */}
      <div
        className={`
        lg:hidden absolute top-4 right-4 
        w-8 h-8 rounded-full ${overlayColors.iconBackground} backdrop-blur-sm
        flex items-center justify-center transition-opacity duration-300
        ${isHovered ? "opacity-0" : "opacity-70"}
      `}
      >
        <svg className={`w-4 h-4 ${overlayColors.iconTextColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
