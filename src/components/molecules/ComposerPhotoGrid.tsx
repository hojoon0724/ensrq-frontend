"use client";

import photoManifest from "@/data/photo-manifest.json";
import { PhotoManifest } from "@/types";
import {Image} from "@/components/atoms"; 

interface ComposerPhotoGridProps {
  photoPaths: string[];
  className?: string;
}

export function ComposerPhotoGrid({ photoPaths, className = "" }: ComposerPhotoGridProps) {
  const getGridLayout = () => {
    const photoCount = photoPaths.length;
    if (photoCount === 0) return { columns: 1, shouldLastSpan: false };

    // Estimate how many columns can fit based on container width
    // 30% of parent minus gaps, with 120px minimum per photo
    const estimatedContainerWidth = 300; // approximate
    const minPhotoWidth = 120;
    const gap = 4;
    const maxColumns = Math.floor((estimatedContainerWidth + gap) / (minPhotoWidth + gap));

    // Determine actual columns needed
    const columns = Math.min(maxColumns, photoCount, 3); // Max 3 columns

    // Check if last photo should span full width
    const photosInLastRow = photoCount % columns;
    const shouldLastSpan = photosInLastRow === 1 && photoCount > columns;

    return { columns, shouldLastSpan };
  };

  const { columns, shouldLastSpan } = getGridLayout();

  const renderPhotoGrid = () => {
    if (photoPaths.length === 0) return null;

    return photoPaths.map((photoPath, index) => {
      const isLastPhoto = index === photoPaths.length - 1;
      const shouldSpan = shouldLastSpan && isLastPhoto;

      return (
        <div key={index} className={`composer-photo-container h-full w-full ${shouldSpan ? "col-span-full" : ""}`}>
          <Image
            src={photoPath}
            alt={`Composer ${index + 1}`}
            width={(photoManifest as PhotoManifest)[photoPath]?.width || 256}
            height={(photoManifest as PhotoManifest)[photoPath]?.height || 256}
            className="object-cover w-full h-full rounded-sm"
          />
        </div>
      );
    });
  };

  if (photoPaths.length === 0) return null;

  return (
    <div
      className={`composer-photo-grid h-full w-full grid auto-rows-fr gap-1 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        // gridTemplateColumns: `repeat(3, 1fr)`,
      }}
    >
      {renderPhotoGrid()}
    </div>
  );
}
