"use client";

import { Badge, Button, Image } from "@/components/atoms";
import { ProgramWork } from "@/types";
import { getComposerData, getMusicianData, getWorkData } from "@/utils";
import { useState } from "react";

interface ProgramTileProps {
  programWork: ProgramWork;
  className?: string;
  color?: "sand" | "sky" | "water";
  tone?: "light" | "dark";
}

export function ProgramTile({ programWork, className = "", color = "sand", tone = "light" }: ProgramTileProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [imageError, setImageError] = useState(false);

  const work = getWorkData(programWork.workId);
  const composer = work?.composerId ? getComposerData(work.composerId) : null;

  // Create a flat array of instrument assignments that matches the musician order
  const instrumentAssignments = work?.instrumentation
    ? work.instrumentation.flatMap((instr) => Array.from({ length: instr.count }, () => instr.instrument))
    : [];

  // Pair each musician with their assigned instrument, filtering out empty/unassigned musicians
  const musicianInstrumentPairs = programWork.musicians
    .map((musicianId, index) => ({
      musician: musicianId ? getMusicianData(musicianId) : null,
      instrument: instrumentAssignments[index] || null,
      musicianId, // Keep the original ID for filtering
    }))
    .filter((pair) => pair.musicianId && pair.musician); // Only keep pairs with valid musician IDs and data

  // Create explicit color mappings to ensure Tailwind classes are properly detected
  const getColors = (color: string, tone: string) => {
    const isLight = tone === "light";

    if (color === "sand") {
      return {
        bg: isLight ? "bg-gradient-to-br from-sand-50 to-sand-100" : "bg-gradient-to-br from-sand-900 to-sand-950",
        border: isLight ? "border-sand-200" : "border-sand-700",
        accent: isLight ? "text-sand-600" : "text-sand-400",
        button: isLight ? "bg-sand-100 hover:bg-sand-200 text-sand-800" : "bg-sand-800 hover:bg-sand-700 text-sand-100",
        badge: isLight ? "bg-sand-100 text-sand-800" : "bg-sand-800 text-sand-100",
        composer: isLight ? "text-sand-900" : "text-sand-100",
        title: isLight ? "text-sand-800" : "text-sand-200",
        text: isLight ? "text-sand-700" : "text-sand-300",
        notes: isLight ? "bg-sand-muted-50 border-sand-muted-100" : "bg-sand-muted-900 border-sand-muted-800",
      };
    } else if (color === "sky") {
      return {
        bg: isLight ? "bg-gradient-to-br from-sky-50 to-sky-100" : "bg-gradient-to-br from-sky-900 to-sky-950",
        border: isLight ? "border-sky-200" : "border-sky-700",
        accent: isLight ? "text-sky-600" : "text-sky-400",
        button: isLight ? "bg-sky-100 hover:bg-sky-200 text-sky-800" : "bg-sky-800 hover:bg-sky-700 text-sky-100",
        badge: isLight ? "bg-sky-100 text-sky-800" : "bg-sky-800 text-sky-100",
        composer: isLight ? "text-sky-900" : "text-sky-100",
        title: isLight ? "text-sky-800" : "text-sky-200",
        text: isLight ? "text-sky-700" : "text-sky-300",
        notes: isLight ? "bg-sky-muted-50 border-sky-muted-100" : "bg-sky-muted-900 border-sky-muted-800",
      };
    } else {
      // water
      return {
        bg: isLight ? "bg-gradient-to-br from-water-50 to-water-100" : "bg-gradient-to-br from-water-900 to-water-950",
        border: isLight ? "border-water-200" : "border-water-700",
        accent: isLight ? "text-water-600" : "text-water-400",
        button: isLight
          ? "bg-water-100 hover:bg-water-200 text-water-800"
          : "bg-water-800 hover:bg-water-700 text-water-100",
        badge: isLight ? "bg-water-100 text-water-800" : "bg-water-800 text-water-100",
        composer: isLight ? "text-water-900" : "text-water-100",
        title: isLight ? "text-water-800" : "text-water-200",
        text: isLight ? "text-water-700" : "text-water-300",
        notes: isLight ? "bg-water-muted-50 border-water-muted-100" : "bg-water-muted-900 border-water-muted-800",
      };
    }
  };

  const colors = getColors(color, tone);

  // Generate composer photo path (assuming photos are stored in public/photos/portraits/)
  const composerPhotoPath = composer ? `/photos/portraits/${composer.composerId}.webp` : null;

  const formatYearRange = (born?: number, died?: number) => {
    if (!born && !died) return null;
    if (born && died) return `${born}–${died}`;
    if (born && !died) return `b. ${born}`;
    if (!born && died) return `d. ${died}`;
    return null;
  };

  return (
    <div
      className={`program-tile rounded-xl flex flex-col gap-4 lg:gap-6 shadow-lg ${colors.bg} ${colors.border} border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${className} p-4 lg:p-6`}
    >
      <div className="line-1">
        <div className="gap-4 w-full grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-start">
          {/* Composer Photo */}
          <div className="flex-shrink-0 flex flex-col gap-2 h-full justify-start">
            {composerPhotoPath && !imageError ? (
              <div
                className={`relative w-24 h-24 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-md border-2 ${colors.border}`}
              >
                <Image
                  src={composerPhotoPath}
                  alt={composer?.name || "Composer"}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 256px"
                />
              </div>
            ) : (
              <div
                className={`w-24 h-24 md:w-32 md:h-32 lg:w-64 lg:h-64 rounded-full ${colors.button} flex items-center justify-center museo-slab shadow-md font-bold text-lg md:text-2xl lg:text-6xl`}
              >
                {composer?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "?"}
              </div>
            )}
          </div>

          {/* Composer and Work Info */}
          <div className="flex-grow min-w-0 flex flex-col gap-1 h-full justify-center">
            <div className="flex items-start justify-between">
              <div className="composer-name-nationality-year">
                <h3 className={`text-lg font-bold ${colors.composer} leading-tight`}>
                  {composer?.name || "Unknown Composer"}
                </h3>
                {composer && (
                  <div className={`text-sm ${colors.text} flex items-center gap-2`}>
                    {composer.nationality && <span className="italic">{composer.nationality}</span>}
                    {formatYearRange(composer.born, composer.died) && (
                      <span className="text-xs">{formatYearRange(composer.born, composer.died)}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Work Title */}
            <h4 className={`text-xl font-semibold ${colors.title} leading-tight`}>
              {work?.title || programWork.workId}
            </h4>

            {work?.subtitle && <p className={`text-sm ${colors.text} italic`}>{work.subtitle}</p>}

            {/* Work Details */}
            <div className="flex flex-wrap gap-4 text-sm">
              {work?.year && (
                <span className={colors.text}>
                  <strong>Year:</strong> {work.year}
                </span>
              )}
              {work?.duration && (
                <span className={colors.text}>
                  <strong>Duration:</strong> {work.duration}
                </span>
              )}
            </div>

            {/* Movements Section */}
            {/* {work?.movements && work.movements.length > 0 && (
              <div className="px-0 py-4">
                <h5 className={`text-sm font-semibold ${colors.composer} mb-1`}>Movements:</h5>
                <ul className="">
                  {work.movements.map((movement, index) => (
                    <li key={index} className={`text-sm ${colors.text}`}>
                      {movement}
                    </li>
                  ))}
                </ul>
              </div>
            )} */}

            {/* Badges for special designations */}
            <div className="flex gap-1 flex-col items-start pt-4 md:flex-row">
              {programWork.is_commission && (
                <Badge className={`${colors.badge} text-xs font-semibold uppercase`}>
                  {programWork.commission_text || "commission"}
                </Badge>
              )}
              {programWork.is_premiere && (
                <Badge className={`${colors.badge} text-xs font-semibold uppercase`}>
                  {programWork.premiere_text || "premiere"}
                </Badge>
              )}
            </div>
          </div>
          {/* Musicians Section */}
          <div className="musicians-program-notes-container h-full flex flex-col justify-between gap-6 col-span-2 md:col-span-1 col-start-2">
            {musicianInstrumentPairs.length > 0 && (
              <div className="musicians-section flex flex-wrap md:flex-col justify-start items-center md:items-end gap-2">
                {musicianInstrumentPairs.map((pair, index) => (
                  <div
                    key={index}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.button} text-xs`}
                  >
                    <span className="font-medium text-nowrap">{pair.musician?.name},</span>
                    {pair.instrument && <span className="opacity-50">{pair.instrument}</span>}
                  </div>
                ))}
              </div>
            )}
            {/* Program Notes Toggle */}
            {work?.description && (
              <div className="text-nowrap flex flex-col justify-end items-end w-full">
                <Button
                  onClick={() => setShowNotes(!showNotes)}
                  color={color}
                  variant={tone === "light" ? "outline" : "filled"}
                  size="sm"
                  className="rounded-lg"
                >
                  {showNotes ? "Hide Program Notes" : "Show Program Notes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Program Notes Content */}
      {showNotes && work?.description && (
        <div className={`rounded-lg ${colors.notes} border transition-all duration-300`}>
          <div className={`text-sm ${colors.text} leading-relaxed p-2 md:p-6`}>
            <h6 className={`font-semibold ${colors.composer} mb-2`}>Program Notes</h6>
            <div className="prose prose-sm max-w-none">
              {work.description.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* {(programWork.premiere_text || programWork.commission_text) && (
        <div className={`px-6 pb-4 text-sm ${colors.text} italic`}>
          <p>
            {programWork.commission_text && <span>{programWork.commission_text}</span>}
            
            {programWork.premiere_text && <span className="mb-1"> {programWork.premiere_text}</span>}
          </p>
        </div>
      )} */}
    </div>
  );
}
