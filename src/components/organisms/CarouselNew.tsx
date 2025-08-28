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

export function CarouselNew({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  showIndicators = true,
  showArrows = true,
  className = "",
}: CarouselProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children);
  const totalItems = items.length;

  // Calculate the current visual index (for indicators)
  const visualIndex = Math.floor(Math.abs(translateX) / 100) % totalItems;

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || totalItems === 0) return;

      setIsTransitioning(true);

      // Calculate the shortest path to the target slide
      const currentVisual = Math.floor(Math.abs(translateX) / 100) % totalItems;
      let difference = index - currentVisual;

      // Determine shortest direction for infinite scroll
      if (difference > totalItems / 2) {
        difference -= totalItems;
      } else if (difference < -totalItems / 2) {
        difference += totalItems;
      }

      setTranslateX((prev) => prev - difference * 100);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [isTransitioning, translateX, totalItems]
  );

  const goToNext = useCallback(() => {
    if (isTransitioning || totalItems === 0) return;

    setIsTransitioning(true);
    setTranslateX((prev) => prev - 100);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, totalItems]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning || totalItems === 0) return;

    setIsTransitioning(true);
    setTranslateX((prev) => prev + 100);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, totalItems]);

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

  // Create enough copies of items to fill the view smoothly
  const copies = Math.max(3, Math.ceil(500 / totalItems)); // Ensure we have enough copies
  const allItems: React.ReactNode[] = [];

  for (let i = 0; i < copies; i++) {
    items.forEach((item, index) => {
      allItems.push(
        <div key={`copy-${i}-item-${index}`} className="w-full h-full flex-shrink-0">
          {item}
        </div>
      );
    });
  }

  return (
    <div className={`carousel relative w-full overflow-hidden ${className}`}>
      {/* Carousel container */}
      <div
        ref={carouselRef}
        className={`flex w-full ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
        style={{
          transform: `translateX(${translateX}%)`,
          height: "100%",
        }}
      >
        {allItems}
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
                index === visualIndex ? "bg-white" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
