import React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "primary" | "success" | "danger";
  inputSize?: "sm" | "md" | "lg";
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  variant = "default",
  inputSize = "md",
  label,
  className = "",
  ...props
}) => {
  const baseClasses = "rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-colors";

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

  const checkbox = (
    <input
      type="checkbox"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[inputSize]} ${className}`}
      {...props}
    />
  );

  if (label) {
    return (
      <div className="flex items-center space-x-2">
        {checkbox}
        <label className="text-sm text-gray-700 cursor-pointer">{label}</label>
      </div>
    );
  }

  return checkbox;
};

export default Checkbox;
