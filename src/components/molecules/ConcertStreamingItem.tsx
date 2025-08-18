"use client";

import { Image } from "@/components/atoms";
import graphicAssetsManifest from "@/data/graphic-assets-manifest.json";
import { extractDateFromUtc, removeSeasonNumberFromConcertId } from "@/utils";
import Link from "next/link";

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
  const key = `/graphics/${seasonId}/streaming-thumbnails/${concert.concertId}.webp`;
  const existsInManifest: boolean = Object.prototype.hasOwnProperty.call(graphicAssetsManifest, key);

  return (
    <Link
      href={`/streaming/${concert.seasonId}/${removeSeasonNumberFromConcertId(concert.concertId)}`}
      className="relative"
      key={concert.concertId}
    >
      {existsInManifest ? (
        <Image
          src={`/graphics/${seasonId}/streaming-thumbnails/${concert.concertId}.webp`}
          alt={concert.title || ""}
          className="w-full h-auto object-cover rounded-lg shadow-lg"
          fill={false}
          width={500}
          height={300}
        />
      ) : (
        <div className="concert-details-text-container flex flex-col aspect-video w-full justify-center items-center text-center bg-gray-200 rounded-lg shadow-lg bg-white">
          <div className="text-lg font-semibold">{concert.title}</div>
          <div className="text-sm text-gray-600">{extractDateFromUtc(concert.date)}</div>
        </div>
      )}
    </Link>
  );
}
