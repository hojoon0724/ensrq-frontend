"use client";

import { ShowMarkdownText } from "@/components/atoms";
import graphicAssetsManifest from "@/data/graphic-assets-manifest.json";
import { Concert, GraphicAssetManifest } from "@/types";
import {
  extractDateFromUtc,
  getComposerData,
  getVenueData,
  getWorkData,
  removeSeasonNumberFromConcertId,
} from "@/utils";
import Link from "next/link";
import { ComposerPhotoGrid } from "./ComposerPhotoGrid";

interface ConcertTileProps {
  concert: Concert;
}

export function ConcertTile({ concert }: ConcertTileProps) {
  const formatDateFromRaw = (rawDateString: string, timeString?: string) => {
    // rawDateString is in MM/DD/YYYY format from extractDateFromUtc
    const date = new Date(rawDateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (timeString) {
      return `${formattedDate} at ${timeString}`;
    }
    return formattedDate;
  };

  const composerPhotosArr: string[] = Array.from(
    new Set(
      concert.program
        .map((item) => {
          const workData = getWorkData(item.workId);
          const composerPhotoPath = workData?.composerId ? `/photos/portraits/${workData.composerId}.webp` : null;

          // Check if photo exists in manifest
          const photoExists = composerPhotoPath && (graphicAssetsManifest as GraphicAssetManifest)[composerPhotoPath];

          return photoExists ? composerPhotoPath : null;
        })
        .filter(Boolean) as string[],
    ),
  );

  return (
    <Link href={`/seasons/${concert.seasonId}/${removeSeasonNumberFromConcertId(concert.concertId)}`}>
      <div className="group relative grid md:grid-cols-[auto,clamp(30ch,60%,80ch)] h-full w-full bg-gray-50 shadow-sm border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 hover:border-gray-300">
        <div className="composer-photo-grid-container h-[70svw] md:h-auto bg-gray-400">
          <ComposerPhotoGrid photoPaths={composerPhotosArr} />
        </div>
        <div className="concert-details-text-container w-full p-s">
          {/* Concert Title */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
              {concert.title}
            </h3>
            {concert.subtitle && <p className="text-sm text-gray-600">{concert.subtitle}</p>}
          </div>
          {/* Co-presented */}
          {concert.coPresented && concert.coPresented.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 flex justify-start items-baseline">
                Co-presented by{" "}
                {concert.coPresented.map((coPresenter) => (
                  <span key={coPresenter.name} className="ml-1 font-medium">
                    {coPresenter.name}
                    {` `}
                  </span>
                ))}
              </p>
            </div>
          )}
          {/* Date and Time */}
          <div className="">
            <p className="text-sm font-semibold text-gray-800 mb-1">
              {formatDateFromRaw(extractDateFromUtc(concert.date))}
            </p>
            {concert.time && <p className="text-sm text-gray-600">{concert.time}</p>}
          </div>
          {/* Venue */}
          {concert.venueId && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">{getVenueData(concert.venueId)?.name || concert.venueId}</p>
            </div>
          )}
          {/* Concert blurb */}
          {concert.shortDescription && (
            <div className="text-sm text-gray-600">
              <ShowMarkdownText fontSize="sm">{concert.shortDescription}</ShowMarkdownText>
            </div>
          )}
          {/* Program Preview */}
          <div className="pt-4 w-full">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Program</p>
            <div className="space-y-3 w-full">
              {concert.program.map((item, index) => (
                <div key={index} className="work-info-container w-full">
                  <p className="work-composer font-bold text-sm text-gray-700 leading-3">
                    {getWorkData(item.workId)?.composerId
                      ? getComposerData(getWorkData(item.workId)!.composerId)?.name || ""
                      : ""}
                  </p>
                  <p className="work-title text-sm text-gray-700">
                    {getWorkData(item.workId)?.title || item.workId}
                    {getWorkData(item.workId)?.year ? " (" + getWorkData(item.workId)!.year + ")" : ""}
                  </p>
                  {(item.is_commission || item.is_premiere) && (
                    <div className="commission-premiere-container flex space-x-1 flex-wrap mb-s">
                      {item.is_premiere && (
                        <div className="premiere-text text-[10px] text-water-500 font-bold museo uppercase border-2 border-water-500 px-[6px] pt-[3px] pb-[2px] rounded-md">
                          World Premiere
                        </div>
                      )}
                      {item.is_commission && (
                        <div className="commission-text text-[10px] text-sky-500 font-bold museo uppercase border-2 border-sky-500 px-[6px] pt-[3px] pb-[2px] rounded-md">
                          Commission
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
      </div>
    </Link>
  );
}
