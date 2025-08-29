"use client";

import { useEffect, useRef, useState } from "react";

interface FitTextProps {
  children: React.ReactNode;
  className?: string;
  minFontSize?: number;
  maxFontSize?: number;
  allowWrap?: boolean;
  extraCharacters?: number;
}

export function FitTextWithPadding({
  children,
  className = "",
  minFontSize = 12,
  maxFontSize = 200,
  allowWrap = false,
  extraCharacters = 0,
}: FitTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(minFontSize);
  const [shouldWrap, setShouldWrap] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element || !element.parentElement) return;
    const parent = element.parentElement;

    const fitText = () => {
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;
      if (!parentWidth || !parentHeight) return;

      setShouldWrap(false);
      element.style.whiteSpace = "nowrap";

      // Create a temporary element to measure with extra characters
      const tempElement = element.cloneNode(true) as HTMLElement;
      tempElement.style.position = "absolute";
      tempElement.style.visibility = "hidden";
      tempElement.style.pointerEvents = "none";

      // Add extra characters for measurement
      const extraChars = "0".repeat(extraCharacters);
      tempElement.textContent = (element.textContent || "") + extraChars;

      parent.appendChild(tempElement);

      let testSize = maxFontSize;
      tempElement.style.fontSize = `${testSize}px`;

      // Shrink until it fits or minFontSize is reached
      while (testSize > minFontSize && tempElement.scrollWidth > parentWidth) {
        testSize--;
        tempElement.style.fontSize = `${testSize}px`;
      }

      // If we hit minFontSize and still overflows, allow wrapping
      if (allowWrap && tempElement.scrollWidth > parentWidth) {
        tempElement.style.whiteSpace = "normal";
        setShouldWrap(true);

        // Shrink if wrapping causes vertical overflow
        while (testSize > minFontSize && tempElement.scrollHeight > parentHeight) {
          testSize--;
          tempElement.style.fontSize = `${testSize}px`;
        }
      }

      // Clean up temp element
      parent.removeChild(tempElement);

      setFontSize(testSize);
      element.style.fontSize = `${testSize}px`;
      setReady(true); // fade in now
    };

    const observer = new ResizeObserver(fitText);
    observer.observe(parent);

    fitText();

    return () => observer.disconnect();
  }, [children, minFontSize, maxFontSize, allowWrap, extraCharacters]);

  return (
    <div
      ref={textRef}
      className={`overflow-hidden ${shouldWrap ? "" : "whitespace-nowrap"} ${className}`}
      style={{
        fontSize: `${fontSize}px`,
        opacity: ready ? 1 : 0,
        transition: "opacity 0.3s ease", // adjust duration as you like
      }}
    >
      {children}
    </div>
  );
}
