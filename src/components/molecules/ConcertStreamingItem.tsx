"use client";

import { Image } from "@/components/atoms";
import { extractDateFromUtc, removeSeasonNumberFromConcertId } from "@/utils";
import Link from "next/link";
import { useState } from "react";

interface ConcertStreamingItemProps {
  concert: {
    concertId: string;
    title: string;
    date: string;
    seasonId: string;
  };
  seasonId: string;
}

export default function ConcertStreamingItem({ concert, seasonId }: ConcertStreamingItemProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    // Image loaded successfully
  };

  return (
    <Link
      href={`/streaming/${concert.seasonId}/${removeSeasonNumberFromConcertId(concert.concertId)}`}
      className="relative"
      key={concert.concertId}
    >
      {imageError ? (
        // Show text container when image fails to load
        <div className="concert-details-text-container flex flex-col h-64 w-full justify-center items-center text-center bg-gray-200 rounded-lg shadow-lg bg-white">
          <div className="text-lg font-semibold">{concert.title}</div>
          <div className="text-sm text-gray-600">{extractDateFromUtc(concert.date)}</div>
        </div>
      ) : (
        <Image
          src={`/graphics/${seasonId}/streaming-thumbnails/${concert.concertId}.webp`}
          alt={concert.title || ""}
          className={`w-full h-auto object-cover rounded-lg shadow-lg ${imageError ? "hidden" : ""}`}
          fill={false}
          width={500}
          height={300}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
    </Link>
  );
}
