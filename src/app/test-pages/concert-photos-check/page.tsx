"use client";

import { Image } from "@/components/atoms";
import graphicAssetManifest from "@/data/graphic-assets-manifest.json";
import allComposers from "@/data/serve/composers.json";
import allConcerts from "@/data/serve/concerts.json";
import allMusicians from "@/data/serve/musicians.json";
import allSeasons from "@/data/serve/seasons.json";
import allWorks from "@/data/serve/works.json";
import { Composer } from "@/types/composer";
import { Musician } from "@/types/musician";
import { useState } from "react";

type Concert = (typeof allConcerts)[0];
type Work = (typeof allWorks)[0];
type ProgramItem = { workId: string; musicians: string[] };
type Instrumentation = { instrument: string; count?: number };

const photoPath = "/photos/portraits/";

export default function ConcertPhotosCheckPage() {
  const [selectedSeason, setSelectedSeason] = useState<string | null>("s10");
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  return (
    <div className="top-container flex flex-col items-center justify-center w-full h-full">
      <h1>Concert Photos Check</h1>
      <div className="filter-container flex flex-row gap-4">
        <label htmlFor="season-select">Select Season:</label>
        <select id="season-select" onChange={(e) => setSelectedSeason(e.target.value)} value={selectedSeason || ""}>
          <option value="">Choose a season</option>
          {allSeasons.map((season) => (
            <option key={season.seasonId} value={season.seasonId}>
              {season.seasonId}
            </option>
          ))}
        </select>

        <label htmlFor="concert-select">Select Concert:</label>
        <select
          id="concert-select"
          onChange={(e) => {
            const concert = allConcerts.find((c) => c.concertId === e.target.value);
            setSelectedConcert(concert || null);
          }}
          value={selectedConcert?.concertId || ""}
        >
          <option value="">Choose a concert</option>
          {selectedSeason
            ? allConcerts
                .filter((concert) => concert.seasonId === selectedSeason)
                .map((concert) => (
                  <option key={concert.concertId} value={concert.concertId}>
                    {concert.title}
                  </option>
                ))
            : null}
        </select>
      </div>
      <div className="photo-gallery w-full flex flex-col justify-center mt-8 p-4">
        <h3 className="mb-8">Program Works</h3>
        <div className="program-works flex flex-col gap-8">
          {selectedConcert
            ? selectedConcert.program.map((programItem: ProgramItem) => {
                const work: Work | undefined = allWorks.find((w) => w.workId === programItem.workId);
                if (!work) return null;

                const composer: Composer | undefined = allComposers.find(
                  (c) => c.composerId === work.composerId
                ) as Composer;
                if (!composer) return null;

                // Find the actual image paths for this composer (all photos)
                const composerImagePaths = composer
                  ? (() => {
                      const paths: string[] = [];

                      if (composer.photos && Array.isArray(composer.photos)) {
                        // Get all photos from the photos array
                        composer.photos.forEach((photo) => {
                          const potentialPath = `${photoPath}${photo}.webp`;
                          // Check if the path exists in the graphic assets manifest
                          if (potentialPath in graphicAssetManifest) {
                            paths.push(potentialPath);
                          }
                        });
                      } else {
                        // Fallback to composerId-based path
                        const potentialPath = `${photoPath}${composer.composerId}${composer.preferredPhoto || ""}.webp`;
                        if (potentialPath in graphicAssetManifest) {
                          paths.push(potentialPath);
                        }
                      }

                      return paths;
                    })()
                  : [];

                return (
                  <div key={work.workId} className="work-section border p-4 rounded-lg">
                    <h4 className="text-xl font-bold mb-4">{work.title}</h4>

                    {/* Composer Section */}
                    <div className="composer-section mb-6">
                      <h5 className="text-lg font-semibold mb-2">Composer</h5>
                      <div className="composer-info flex items-center gap-4">
                        <div className="composer-photos flex flex-wrap gap-1">
                          {composerImagePaths.length > 0 ? (
                            composerImagePaths.map((imagePath, photoIndex) => {
                              // Determine opacity based on preferred photo or first photo
                              let isPreferred = false;
                              if (composerImagePaths.length > 1) {
                                if (composer.preferredPhoto) {
                                  // Check if this photo matches the preferred photo
                                  const photoName = imagePath.replace(`${photoPath}`, "").replace(".webp", "");
                                  isPreferred = photoName === composer.preferredPhoto;
                                } else {
                                  // Use first photo as preferred
                                  isPreferred = photoIndex === 0;
                                }
                              } else {
                                // Single photo, always full opacity
                                isPreferred = true;
                              }

                              return (
                                <div
                                  key={photoIndex}
                                  className="photo h-20 w-20 relative"
                                  style={{ opacity: isPreferred ? 1 : 0.3 }}
                                >
                                  <Image
                                    src={imagePath}
                                    alt={`${composer.name} photo ${photoIndex + 1}`}
                                    onError={() => {
                                      console.log(`Composer image not found: ${imagePath}`);
                                    }}
                                  />
                                </div>
                              );
                            })
                          ) : (
                            <div className="photo-missing h-20 w-20 bg-gray-200 flex items-center justify-center text-xs">
                              No Photo
                            </div>
                          )}
                        </div>
                        <div className="composer-details">
                          <p className="font-medium">{composer.name}</p>
                          <p className="text-sm text-gray-600">ID: {composer.composerId}</p>
                          {composer.photos && composer.photos.length > 1 && (
                            <p className="text-xs text-blue-500">{composer.photos.length} photos available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Instrumentation Section */}
                    <div className="instrumentation-section">
                      <h5 className="text-lg font-semibold mb-2">Instrumentation</h5>
                      <div className="instruments grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {work.instrumentation.flatMap((inst: Instrumentation, instIndex: number) => {
                          const count = inst.count || 1;
                          return Array.from({ length: count }, (_, countIndex) => {
                            const overallIndex =
                              work.instrumentation
                                .slice(0, instIndex)
                                .reduce((sum, prevInst) => sum + (prevInst.count || 1), 0) + countIndex;

                            // Find assigned musician for this specific instrument position
                            const assignedMusicianId = programItem.musicians[overallIndex] || null;
                            const assignedMusician = assignedMusicianId
                              ? (allMusicians.find((m) => m.musicianId === assignedMusicianId) as Musician)
                              : null;

                            // Find musician image paths (all photos)
                            const musicianImagePaths = assignedMusician
                              ? (() => {
                                  const paths: string[] = [];

                                  if (assignedMusician.photos && Array.isArray(assignedMusician.photos)) {
                                    // Get all photos from the photos array
                                    assignedMusician.photos.forEach((photo) => {
                                      const potentialPath = `${photoPath}${photo}.webp`;
                                      // Check if the path exists in the graphic assets manifest
                                      if (potentialPath in graphicAssetManifest) {
                                        paths.push(potentialPath);
                                      }
                                    });
                                  } else {
                                    // Fallback to musicianId-based path
                                    const potentialPath = `${photoPath}${assignedMusician.musicianId}${assignedMusician.preferredPhoto || ""}.webp`;
                                    if (potentialPath in graphicAssetManifest) {
                                      paths.push(potentialPath);
                                    }
                                  }

                                  return paths;
                                })()
                              : [];

                            return (
                              <div
                                key={`${work.workId}-${inst.instrument}-${countIndex}`}
                                className="instrument-item border rounded p-2"
                              >
                                <div className="instrument-info mb-2">
                                  <p className="font-medium capitalize">
                                    {inst.instrument} {count > 1 ? `#${countIndex + 1}` : ""}
                                  </p>
                                </div>

                                {/* Musician Assignment */}
                                <div className="musician-assignment">
                                  {assignedMusician ? (
                                    <div className="musician-info flex items-center gap-1">
                                      <div className="musician-photos flex flex-wrap gap-1">
                                        {musicianImagePaths.length > 0 ? (
                                          musicianImagePaths.map((imagePath, photoIndex) => {
                                            // Determine opacity based on preferred photo or first photo
                                            let isPreferred = false;
                                            if (musicianImagePaths.length > 1) {
                                              if (assignedMusician.preferredPhoto) {
                                                // Check if this photo matches the preferred photo
                                                const photoName = imagePath
                                                  .replace(`${photoPath}`, "")
                                                  .replace(".webp", "");
                                                isPreferred = photoName === assignedMusician.preferredPhoto;
                                              } else {
                                                // Use first photo as preferred
                                                isPreferred = photoIndex === 0;
                                              }
                                            } else {
                                              // Single photo, always full opacity
                                              isPreferred = true;
                                            }

                                            return (
                                              <div
                                                key={photoIndex}
                                                className="photo h-12 w-12 relative"
                                                style={{ opacity: isPreferred ? 1 : 0.3 }}
                                              >
                                                <Image
                                                  src={imagePath}
                                                  alt={`${assignedMusician.name} photo ${photoIndex + 1}`}
                                                  onError={() => {
                                                    // This will be handled by the Image component's error fallback
                                                    console.log(`Image not found: ${imagePath}`);
                                                  }}
                                                />
                                              </div>
                                            );
                                          })
                                        ) : (
                                          <div className="photo-missing h-12 w-12 flex items-center justify-center text-xs text-center bg-red-700 text-gray-30">
                                            No Photo
                                          </div>
                                        )}
                                      </div>
                                      <div className="musician-details">
                                        <p className="text-sm font-medium">{assignedMusician.name}</p>
                                        <p className="text-xs text-gray-500">ID: {assignedMusicianId}</p>
                                        {assignedMusician.photos && assignedMusician.photos.length > 1 && (
                                          <p className="text-xs text-blue-500">
                                            {assignedMusician.photos.length} photos available
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="no-musician">
                                      <p className="text-sm text-gray-500 italic">No musician assigned</p>
                                      {assignedMusicianId && (
                                        <p className="text-xs text-red-500">Invalid ID: {assignedMusicianId}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}
