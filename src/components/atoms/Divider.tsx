import React from "react";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  thickness?: "thin" | "medium" | "thick";
  color?: "default" | "light" | "dark" | "primary";
  spacing?: "none" | "sm" | "md" | "lg";
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  variant = "solid",
  thickness = "thin",
  color = "default",
  spacing = "md",
  className = "",
}) => {
  const baseClasses = "border-0";

  const orientationClasses = {
    horizontal: "w-full h-0",
    vertical: "h-full w-0",
  };

  const variantClasses = {
    solid: orientation === "horizontal" ? "border-t" : "border-l",
    dashed: orientation === "horizontal" ? "border-t border-dashed" : "border-l border-dashed",
    dotted: orientation === "horizontal" ? "border-t border-dotted" : "border-l border-dotted",
  };

  const thicknessClasses = {
    thin: "border-t-1",
    medium: "border-t-2",
    thick: "border-t-4",
  };

  const colorClasses = {
    default: "border-gray-300",
    light: "border-gray-200",
    dark: "border-gray-600",
    primary: "border-blue-500",
  };

  const spacingClasses = {
    none: "",
    sm: orientation === "horizontal" ? "my-2" : "mx-2",
    md: orientation === "horizontal" ? "my-4" : "mx-4",
    lg: orientation === "horizontal" ? "my-6" : "mx-6",
  };

  return (
    <hr
      className={`
        ${baseClasses}
        ${orientationClasses[orientation]}
        ${variantClasses[variant]}
        ${thicknessClasses[thickness]}
        ${colorClasses[color]}
        ${spacingClasses[spacing]}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    />
  );
};

export default Divider;
