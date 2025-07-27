import React from "react";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "white";
  variant?: "circular" | "dots" | "pulse";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", color = "primary", variant = "circular", className = "" }) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
    white: "text-white",
  };

  const CircularSpinner = () => (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const DotsSpinner = () => {
    const dotSize =
      size === "xs"
        ? "w-1 h-1"
        : size === "sm"
          ? "w-1.5 h-1.5"
          : size === "md"
            ? "w-2 h-2"
            : size === "lg"
              ? "w-2.5 h-2.5"
              : "w-3 h-3";

    return (
      <div className={`flex space-x-1 ${className}`}>
        <div
          className={`${dotSize} ${colorClasses[color]} bg-current rounded-full animate-pulse`}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={`${dotSize} ${colorClasses[color]} bg-current rounded-full animate-pulse`}
          style={{ animationDelay: "150ms" }}
        />
        <div
          className={`${dotSize} ${colorClasses[color]} bg-current rounded-full animate-pulse`}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    );
  };

  const PulseSpinner = () => (
    <div
      className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        bg-current
        rounded-full
        animate-pulse
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    />
  );

  switch (variant) {
    case "dots":
      return <DotsSpinner />;
    case "pulse":
      return <PulseSpinner />;
    case "circular":
    default:
      return <CircularSpinner />;
  }
};

export default Spinner;
