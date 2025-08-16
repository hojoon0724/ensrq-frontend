"use client";

import { MovingGradientText } from "@/components/atoms";
import { SectionEmpty, SectionMeshGradient } from "@/components/sections";
import { useRandomColors } from "./hooks/useRandomColors";

interface BaseRandomColorHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  children?: React.ReactNode;
  forceTone?: "light" | "dark";
  headerSize?: "normal" | "large";
  showTicketSection?: boolean;
  ticketSection?: React.ReactNode;
}

export default function BaseRandomColorHeader({
  title,
  subtitle,
  children,
  forceTone,
  headerSize = "large",
  showTicketSection = false,
  ticketSection,
}: BaseRandomColorHeaderProps) {
  const colors = useRandomColors(forceTone);

  const titleSizeClasses =
    headerSize === "large" ? "text-6xl lg:text-8xl font-bold" : "text-4xl lg:text-6xl font-bold text-center px-4";

  return (
    <>
      <SectionMeshGradient
        color1={colors.randomColor}
        backgroundColor={colors.randomColor}
        className="h-[max(30svh,400px)] flex flex-col justify-center items-center"
        tone={colors.randomTone}
      >
        <MovingGradientText
          text={title}
          className={`${titleSizeClasses} flex justify-center items-center text-center p-s`}
          gradientColor={colors.randomTextColor}
          tone={colors.textTone}
        >
          {subtitle &&
            (typeof subtitle === "string" ? (
              <div
                className={`museo-slab text-center text-${colors.randomTextColor}-${colors.textShade} mt-2 ${
                  headerSize === "large" ? "text-2xl" : "text-lg lg:text-2xl"
                }`}
              >
                {subtitle}
              </div>
            ) : (
              subtitle
            ))}
        </MovingGradientText>
      </SectionMeshGradient>

      {showTicketSection && ticketSection && (
        <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone}>
          <div className="flex justify-center items-center">{ticketSection}</div>
        </SectionEmpty>
      )}

      {children && (
        <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone}>
          {children}
        </SectionEmpty>
      )}
    </>
  );
}
