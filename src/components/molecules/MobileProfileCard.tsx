"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface MobileProfileCardProps {
  profile: {
    id: string;
    image: {
      width: number;
      height: number;
    };
    name: string;
    bio: string;
  };
  themeColor?: "sand" | "water" | "sky";
  index?: number;
  isExpanded: boolean;
  onToggle: (profileId: string) => void;
}

export function MobileProfileCard({
  profile,
  themeColor = "sand",
  index = 0,
  isExpanded,
  onToggle,
}: MobileProfileCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    sand: {
      gradient: "from-sand-900/90 via-sand-800/70 to-transparent",
      cardBg: "bg-sand-50",
      cardBorder: "border-sand-200",
      nameColor: "text-white",
      bioTextColor: "text-sand-900",
      buttonBg: "bg-sand-500",
      buttonHover: "hover:bg-sand-600",
      accent: "sand-400",
    },
    water: {
      gradient: "from-water-900/90 via-water-800/70 to-transparent",
      cardBg: "bg-water-50",
      cardBorder: "border-water-200",
      nameColor: "text-white",
      bioTextColor: "text-water-900",
      buttonBg: "bg-water-500",
      buttonHover: "hover:bg-water-600",
      accent: "water-400",
    },
    sky: {
      gradient: "from-sky-900/90 via-sky-800/70 to-transparent",
      cardBg: "bg-sky-50",
      cardBorder: "border-sky-200",
      nameColor: "text-white",
      bioTextColor: "text-sky-900",
      buttonBg: "bg-sky-500",
      buttonHover: "hover:bg-sky-600",
      accent: "sky-400",
    },
  };

  const colors = colorClasses[themeColor];

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ease-out
        ${colors.cardBg} ${colors.cardBorder}
        ${isExpanded ? "shadow-2xl scale-[1.02]" : "shadow-lg hover:shadow-xl hover:scale-[1.01]"}
      `}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* Image Section */}
      <div className="relative h-80 overflow-hidden">
        <div
          className={`
            absolute inset-0 bg-gradient-to-t ${colors.gradient}
            transition-opacity duration-300 z-10
            ${isImageLoaded ? "opacity-100" : "opacity-0"}
          `}
        />
        <Image
          src={`/photos/about/about-${profile.id}.webp`}
          alt={profile.name}
          fill
          sizes="100vw"
          className={`
            object-cover object-center transition-all duration-700 ease-out
            ${isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
            ${isExpanded ? "scale-110" : "hover:scale-105"}
          `}
          onLoad={() => setIsImageLoaded(true)}
          priority={index < 3}
        />

        {/* Name overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <h2
            className={`
            ${colors.nameColor} font-bold text-2xl sm:text-3xl
            transition-all duration-300
          `}
          >
            {profile.name}
          </h2>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Bio Preview - Always show first few lines */}
        <div className="mb-4">
          <p
            className={`
              ${colors.bioTextColor} text-base leading-relaxed
              ${!isExpanded ? "line-clamp-3" : ""}
            `}
            dangerouslySetInnerHTML={{
              __html: isExpanded ? profile.bio : profile.bio.substring(0, 150) + "...",
            }}
          />
        </div>

        {/* Expanded Bio Content */}
        {isExpanded && (
          <div
            ref={contentRef}
            className={`
              overflow-hidden transition-all duration-500 ease-out
              max-h-96 overflow-y-auto custom-scrollbar
            `}
          >
            <div
              className={`
              ${colors.cardBg} rounded-lg p-4 border ${colors.cardBorder}
            `}
            >
              <p
                className={`
                  ${colors.bioTextColor} text-base leading-relaxed
                `}
                dangerouslySetInnerHTML={{ __html: profile.bio }}
              />
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => onToggle(profile.id)}
          className={`
            mt-4 w-full px-6 py-3 text-white font-medium rounded-xl transition-all duration-300
            ${colors.buttonBg} ${colors.buttonHover}
            hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
            flex items-center justify-center gap-2
          `}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? `Collapse ${profile.name} bio` : `Expand ${profile.name} bio`}
        >
          <span>{isExpanded ? "Show Less" : "Read Bio"}</span>
          <svg
            className={`
              w-5 h-5 transition-transform duration-300
              ${isExpanded ? "rotate-180" : "rotate-0"}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Subtle Accent Line */}
      <div
        className={`
          absolute top-0 left-0 right-0 h-1
          bg-${colors.accent}
          ${isExpanded ? "opacity-100" : "opacity-50"}
          transition-opacity duration-300
        `}
      />
    </div>
  );
}
