"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  className?: string;
}

export function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  showIndicators = true,
  showArrows = true,
  className = "",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 because we have a clone before
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children);
  const totalItems = items.length;

  // Create extended items array with clones for infinite effect
  const extendedItems = [
    items[totalItems - 1], // Clone of last item at beginning
    ...items, // Original items
    items[0], // Clone of first item at end
  ];

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setCurrentIndex(index + 1); // Adjust for clone offset
    },
    [isTransitioning]
  );

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, [isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  }, [isTransitioning]);

  // Handle infinite loop transitions
  useEffect(() => {
    if (!isTransitioning) return;

    const timeout = setTimeout(() => {
      setIsTransitioning(false);

      // Reset position for infinite effect
      if (currentIndex >= totalItems + 1) {
        setCurrentIndex(1); // Jump to real first item
      } else if (currentIndex <= 0) {
        setCurrentIndex(totalItems); // Jump to real last item
      }
    }, 500); // Match transition duration

    return () => clearTimeout(timeout);
  }, [currentIndex, totalItems, isTransitioning]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || totalItems <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext, totalItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (totalItems === 0) return null;

  // Calculate the actual current index for indicators (adjust for clone offset)
  const actualCurrentIndex =
    currentIndex === 0 ? totalItems - 1 : currentIndex === totalItems + 1 ? 0 : currentIndex - 1;

  return (
    <div className={`carousel relative w-full overflow-hidden ${className}`}>
      {/* Carousel container */}
      <div
        ref={carouselRef}
        className={`flex w-full ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          height: '100%'
        }}
      >
        {extendedItems.map((child, index) => (
          <div key={`slide-${index}`} className="w-full h-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && totalItems > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200 z-10"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200 z-10"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && totalItems > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === actualCurrentIndex ? "bg-white" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
