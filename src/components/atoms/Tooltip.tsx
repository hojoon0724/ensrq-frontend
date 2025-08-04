"use client";

import React, { useState } from "react";

export interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({
  content,
  position = "top",
  variant = "dark",
  size = "md",
  delay = 300,
  children,
  className = "",
}: TooltipProps): React.ReactNode {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const baseTooltipClasses =
    "absolute z-50 px-2 py-1 text-sm rounded-md shadow-lg pointer-events-none transition-opacity duration-200 w-full flex items-center justify-center text-center";

  const variantClasses = {
    dark: "bg-gray-900 text-white",
    light: "bg-white text-gray-900 border border-gray-200",
  };

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent",
    bottom:
      "absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent",
    left: "absolute left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent",
    right: "absolute right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent",
  };

  const arrowColors = {
    dark: {
      top: "border-t-gray-900",
      bottom: "border-b-gray-900",
      left: "border-l-gray-900",
      right: "border-r-gray-900",
    },
    light: {
      top: "border-t-white",
      bottom: "border-b-white",
      left: "border-l-white",
      right: "border-r-white",
    },
  };

  return (
    <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {isVisible && (
        <div
          className={`
            ${baseTooltipClasses}
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${positionClasses[position]}
            ${className}
          `
            .trim()
            .replace(/\s+/g, " ")}
        >
          {content}
          <div
            className={`
              ${arrowClasses[position]}
              ${arrowColors[variant][position]}
            `
              .trim()
              .replace(/\s+/g, " ")}
          />
        </div>
      )}
    </div>
  );
}
