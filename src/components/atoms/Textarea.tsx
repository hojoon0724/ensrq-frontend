import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "error" | "success";
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export function Textarea({
  variant = "default",
  inputSize = "md",
  fullWidth = false,
  resize = "vertical",
  className = "",
  ...props
}: TextareaProps): React.ReactNode {
  const baseClasses =
    "border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const resizeClasses = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <textarea
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[inputSize]} ${resizeClasses[resize]} ${widthClass} ${className}`}
      {...props}
    />
  );
};
