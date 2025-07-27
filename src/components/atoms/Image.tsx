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
}

const Image: React.FC<ImageProps> = ({
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
  ...props
}) => {
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

  const imageClasses = `${roundedClasses[rounded]} ${objectFitClasses[objectFit]} ${className}`;

  if (fill) {
    return <NextImage src={src} alt={alt} fill priority={priority} className={imageClasses} {...props} />;
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
      {...props}
    />
  );
};

export default Image;
