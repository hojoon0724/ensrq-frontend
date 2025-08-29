"use client";

import { useEffect, useRef, useState } from "react";

interface FitTextProps {
  children: React.ReactNode;
  className?: string;
  minFontSize?: number;
  maxFontSize?: number;
  mobileMinFontSize?: number;
  allowWrap?: boolean;
}

export function FitText({
  children,
  className = "",
  minFontSize = 12,
  maxFontSize = 200,
  mobileMinFontSize,
  allowWrap = false,
}: FitTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(minFontSize);
  const [shouldWrap, setShouldWrap] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element || !element.parentElement) return;
    const parent = element.parentElement;

    const fitText = () => {
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;
      if (!parentWidth || !parentHeight) return;

      // Determine minimum font size based on screen size
      const isMobile = window.innerWidth < 768; // Tailwind's md breakpoint
      const currentMinFontSize = isMobile && mobileMinFontSize ? mobileMinFontSize : minFontSize;

      setShouldWrap(false);
      element.style.whiteSpace = "nowrap";

      let testSize = maxFontSize;
      element.style.fontSize = `${testSize}px`;

      // Shrink until it fits or minFontSize is reached
      while (testSize > currentMinFontSize && element.scrollWidth > parentWidth) {
        testSize--;
        element.style.fontSize = `${testSize}px`;
      }

      // If we hit minFontSize and still overflows, allow wrapping
      if (allowWrap && element.scrollWidth > parentWidth) {
        element.style.whiteSpace = "normal";
        setShouldWrap(true);

        // Shrink if wrapping causes vertical overflow
        while (testSize > currentMinFontSize && element.scrollHeight > parentHeight) {
          testSize--;
          element.style.fontSize = `${testSize}px`;
        }
      }

      setFontSize(testSize);
      element.style.fontSize = `${testSize}px`;
    };

    const observer = new ResizeObserver(fitText);
    observer.observe(parent);

    // Also listen for window resize to handle orientation changes
    const handleResize = () => fitText();
    window.addEventListener("resize", handleResize);

    fitText();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [children, minFontSize, maxFontSize, mobileMinFontSize, allowWrap]);

  return (
    <div
      ref={textRef}
      className={`overflow-hidden w-full ${shouldWrap ? "" : "whitespace-nowrap"} ${className}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {children}
    </div>
  );
}
