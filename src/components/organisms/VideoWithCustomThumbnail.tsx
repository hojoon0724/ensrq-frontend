"use client";

import { Image } from "@/components/atoms";
import { useState } from "react";

interface VideoWithCustomThumbnailProps {
  thumbnail: string;
  icon: React.ReactNode;
  youtubeUrl: string;
  alt?: string;
  className?: string;
}

export function VideoWithCustomThumbnail({
  thumbnail,
  icon,
  youtubeUrl,
  alt = "Video thumbnail",
  className = "",
}: VideoWithCustomThumbnailProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(youtubeUrl);

  const handleThumbnailClick = () => {
    if (videoId) {
      setIsPlaying(true);
    } else {
    }
  };

  if (isPlaying && videoId) {
    return (
      <div className={`relative w-full ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
        />
      </div>
    );
  }

  return (
    <div className={`relative cursor-pointer w-full h-full group ${className}`} onClick={handleThumbnailClick}>
      <Image src={thumbnail} alt={alt} className="w-full h-auto object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 group-hover:bg-opacity-0 transition-all duration-200">
        <div className="transform group-hover:scale-110 transition-transform duration-200 opacity-100 w-20 md:w-32 h-20 md:h-32 bg-gray-30 p-4 rounded-full drop-shadow-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default VideoWithCustomThumbnail;
