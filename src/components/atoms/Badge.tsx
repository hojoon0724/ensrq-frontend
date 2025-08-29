import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "sky" | "sand" | "water";
  size?: "xs" | "sm" | "md" | "lg";
  shape?: "rounded" | "pill" | "square";
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  shape = "rounded",
  dot = false,
  className = "",
}: BadgeProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium";

  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    sky: "bg-sky-500 text-white",
    sand: "bg-sand-500 text-white",
    water: "bg-water-500 text-white",
  };

  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-sm",
  };

  const shapeClasses = {
    rounded: "rounded-md",
    pill: "rounded-full",
    square: "rounded-none",
  };

  const dotColors = {
    default: "bg-gray-400",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    sky: "bg-sky-50",
    sand: "bg-sand-50",
    water: "bg-water-50",
  };

  const dotSizeClasses = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  return (
    <span
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${shapeClasses[shape]}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {dot && (
        <span
          className={`
            ${dotSizeClasses[size]}
            ${dotColors[variant]}
            rounded-full
            mr-1.5
          `
            .trim()
            .replace(/\s+/g, " ")}
        />
      )}
      {children}
    </span>
  );
}
