import { focusToPercent, getFocusPoint } from "@/utils/getFocusPoint";
import NextImage from "next/image";
import React from "react";

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  loading?: "lazy" | "eager";
  xCenter?: string | number;
  yCenter?: string | number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  useFocusPoint?: boolean; // New prop to enable/disable automatic focus point detection
}

export function Image({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = "",
  objectFit = "cover",
  rounded = "none",
  loading = "lazy",
  xCenter = "50%",
  yCenter = "50%",
  sizes,
  onLoad,
  onError,
  useFocusPoint = true, // Default to true to automatically use focus points
  ...props
}: ImageProps): React.ReactNode {
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const objectFitClasses = {
    contain: "object-contain",
    cover: "object-cover",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  };

  // Get focus point from manifest if enabled and available
  let finalXCenter = xCenter;
  let finalYCenter = yCenter;

  if (useFocusPoint) {
    const focusPoint = getFocusPoint(src);
    if (focusPoint) {
      const { xPercent, yPercent } = focusToPercent(focusPoint);
      finalXCenter = xPercent;
      finalYCenter = yPercent;
    }
  }

  // Create object-position style for centering
  const formatPosition = (value: string | number): string => {
    if (typeof value === "number") {
      return `${value}%`;
    }
    return value;
  };

  const objectPositionStyle = {
    objectPosition: `${formatPosition(finalXCenter)} ${formatPosition(finalYCenter)}`,
  };

  const imageClasses = `${roundedClasses[rounded]} ${objectFitClasses[objectFit]} ${className}`;

  if (fill) {
    return (
      <NextImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={imageClasses}
        style={objectPositionStyle}
        sizes={sizes}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={loading}
      className={imageClasses}
      style={objectPositionStyle}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  );
}
