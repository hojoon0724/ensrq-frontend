"use client";

import { Image } from "@/components/atoms";

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
    const gap = 0;
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
        <div
          key={index}
          className={`composer-photo-container relative h-full w-full ${shouldSpan ? "col-span-full" : ""}`}
        >
          <Image
            src={photoPath}
            alt={`Composer ${index + 1}`}
            fill
            className="object-cover rounded-sm"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      );
    });
  };

  if (photoPaths.length === 0) return null;

  return (
    <div
      className={`composer-photo-grid h-full w-full grid auto-rows-fr ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {renderPhotoGrid()}
    </div>
  );
}
