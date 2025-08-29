import React from "react";

export interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "primary" | "success" | "danger";
  inputSize?: "sm" | "md" | "lg";
  label?: string;
}

export function RadioButton({
  variant = "default",
  inputSize = "md",
  label,
  className = "",
  ...props
}: RadioButtonProps): React.ReactNode {
  const baseClasses = "border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-colors";

  const variantClasses = {
    default: "text-blue-600 focus:ring-blue-500",
    primary: "text-blue-600 focus:ring-blue-500",
    success: "text-green-600 focus:ring-green-500",
    danger: "text-red-600 focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const radio = (
    <input
      type="radio"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[inputSize]} ${className}`}
      {...props}
    />
  );

  if (label) {
    return (
      <div className="flex items-center space-x-2">
        {radio}
        <label className="text-sm text-gray-700 cursor-pointer">{label}</label>
      </div>
    );
  }

  return radio;
};
