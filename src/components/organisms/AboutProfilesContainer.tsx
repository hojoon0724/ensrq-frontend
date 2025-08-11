"use client";

import { AboutProfileTile, MobileAccordionTile } from "@/components/molecules";
import { useState } from "react";

interface AboutProfilesContainerProps {
  profilesArray: {
    id: string;
    image: {
      width: number;
      height: number;
      xCenter: number;
      yCenter: number;
    };
    name: string;
    bio: string;
    testId?: string;
  }[];
  themeColor?: "sand" | "water" | "sky";
  backgroundTone?: "light" | "dark";
  title?: string;
}

export function AboutProfilesContainer({
  profilesArray,
  themeColor = "sand",
  backgroundTone = "dark",
  title,
}: AboutProfilesContainerProps) {
  // const [hoveredProfile, setHoveredProfile] = useState<string | null>(null);
  const [hoveredProfile, setHoveredProfile] = useState<string | null>(null);

  if (!profilesArray || profilesArray.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {title && (
        <div className="mb-8 lg:mb-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <div
            className={`
              w-24 h-1 mx-auto rounded-full
              ${themeColor === "sand" ? "bg-sand-400" : ""}
              ${themeColor === "water" ? "bg-water-400" : ""}
              ${themeColor === "sky" ? "bg-sky-400" : ""}
            `}
          />
        </div>
      )}

      {/* Desktop: Horizontal Accordion Layout */}
      <div className="hidden lg:block w-full">
        <div
          className="flex h-[min(800px,80svh)] overflow-hidden shadow-2xl"
          onMouseLeave={() => setHoveredProfile(null)}
        >
          {profilesArray.map((profile, index) => (
            <AboutProfileTile
              key={profile.id}
              profile={profile}
              themeColor={themeColor}
              backgroundTone={backgroundTone}
              index={index}
              isHovered={hoveredProfile === profile.id}
              onHover={setHoveredProfile}
              isAnyHovered={hoveredProfile !== null}
            />
          ))}
        </div>
      </div>

      {/* Mobile: Horizontal Stack with Vertical Expansion */}
      <div className="lg:hidden -mx-4 sm:-mx-6">
        <div className="space-y-0">
          {profilesArray.map((profile, index) => (
            <MobileAccordionTile
              key={profile.id}
              profile={profile}
              themeColor={themeColor}
              backgroundTone={backgroundTone}
              index={index}
              isExpanded={hoveredProfile === profile.id}
              onToggle={(profileId: string) => {
                const currentExpanded = hoveredProfile;
                const newExpanded = hoveredProfile === profileId ? null : profileId;
                setHoveredProfile(newExpanded);

                // Auto scroll to the top of the photo after expansion animation completes
                if (newExpanded) {
                  // If there was a previously expanded item, we need to wait longer for both collapse and expand
                  const delay = currentExpanded ? 650 : 600;

                  setTimeout(() => {
                    const element = document.getElementById(`profile-${profileId}`);
                    if (element) {
                      // Calculate position after all animations complete
                      const elementTop = element.getBoundingClientRect().top + window.scrollY;
                      const offset = 90; // Account for any fixed navigation
                      window.scrollTo({
                        top: elementTop - offset,
                        behavior: "smooth",
                      });
                    }
                  }, delay);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
