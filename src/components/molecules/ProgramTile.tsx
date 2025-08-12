"use client";

import { Badge, Button } from "@/components/atoms";
import photoManifest from "@/data/photo-manifest.json";
import { PhotoManifest, ProgramWork } from "@/types";
import { getComposerData, getMusicianData, getWorkData } from "@/utils";
import { Image } from "@/components/atoms";
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

  // Get musicians performing this work
  const musicians = programWork.musicians.map((musicianId) => getMusicianData(musicianId)).filter(Boolean);

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
      className={`program-tile rounded-xl shadow-lg ${colors.bg} ${colors.border} border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${className}`}
    >
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Composer Photo */}
          <div className="flex-shrink-0">
            {composerPhotoPath && !imageError ? (
              <div className={`w-24 h-24 md:w-32 md:h-32 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-md border-2 ${colors.border}`}>
                <Image
                  src={composerPhotoPath}
                  alt={composer?.name || "Composer"}
                  width={(photoManifest as PhotoManifest)[composerPhotoPath]?.width || 256}
                  height={(photoManifest as PhotoManifest)[composerPhotoPath]?.height || 256}
                  className="object-cover w-full h-full"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div
                className={`w-24 h-24 md:w-32 md:h-32 lg:w-64 lg:h-64 rounded-full ${colors.button} flex items-center justify-center shadow-md font-bold text-lg md:text-2xl lg:text-6xl`}
              >
                {composer?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "?"}
              </div>
            )}
          </div>

          {/* Composer and Work Info */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
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

              {/* Badges for special designations */}
              <div className="flex flex- gap-1">
                {programWork.is_premiere && <Badge className={`${colors.badge} text-xs font-semibold`}>PREMIERE</Badge>}
                {programWork.is_commission && (
                  <Badge className={`${colors.badge} text-xs font-semibold`}>COMMISSION</Badge>
                )}
              </div>
            </div>

            {/* Work Title */}
            <h4 className={`text-xl font-semibold ${colors.title} mb-1 leading-tight`}>
              {work?.title || programWork.workId}
            </h4>

            {work?.subtitle && <p className={`text-sm ${colors.text} italic mb-2`}>{work.subtitle}</p>}

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
            {work?.movements && work.movements.length > 0 && (
              <div className="px-0 py-4">
                {/* <h5 className={`text-sm font-semibold ${colors.composer} mb-2`}>Movements:</h5> */}
                <ul className=" space-y-1">
                  {work.movements.map((movement, index) => (
                    <li key={index} className={`text-sm ${colors.text}`}>
                      {movement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Musicians Section */}
      {musicians.length > 0 && (
        <div className="px-6 pb-4">
          {/* <h5 className={`text-sm font-semibold ${colors.composer} mb-2`}>Performers:</h5> */}
          <div className="flex flex-wrap gap-2">
            {musicians.map((musician, index) => (
              <div
                key={index}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.button} text-xs`}
              >
                <span className="font-medium">{musician?.name}</span>
                <span className="opacity-75">{musician?.instrument}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instrumentation */}
      {/* {work?.instrumentation && work.instrumentation.length > 0 && (
        <div className="px-6 pb-4">
          <h5 className={`text-sm font-semibold ${colors.composer} mb-2`}>Instrumentation:</h5>
          <div className="flex flex-wrap gap-2">
            {work.instrumentation.map((instr, index) => (
              <span key={index} className={`px-2 py-1 rounded ${colors.badge} text-xs`}>
                {instr.count > 1 ? `${instr.count} ` : ""}
                {instr.instrument}
              </span>
            ))}
          </div>
        </div>
      )} */}

      {/* Program Notes Toggle */}
      {work?.description && (
        <div className="px-6 pb-4">
          <Button
            onClick={() => setShowNotes(!showNotes)}
            className={`${colors.button} text-sm px-4 py-2 rounded-lg transition-colors duration-200`}
          >
            {showNotes ? "Hide Program Notes" : "Show Program Notes"}
          </Button>
        </div>
      )}

      {/* Program Notes Content */}
      {showNotes && work?.description && (
        <div className={`mx-6 mb-6 p-4 rounded-lg ${colors.notes} border transition-all duration-300`}>
          <div className={`text-sm ${colors.text} leading-relaxed`}>
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

      {/* Special Text for Premieres/Commissions */}
      {(programWork.premiere_text || programWork.commission_text) && (
        <div className={`px-6 pb-4 text-sm ${colors.text} italic`}>
          {programWork.premiere_text && <p className="mb-1">{programWork.premiere_text}</p>}
          {programWork.commission_text && <p>{programWork.commission_text}</p>}
        </div>
      )}
    </div>
  );
}
