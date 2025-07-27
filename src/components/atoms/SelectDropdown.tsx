import React, { useState } from "react";
import Icon from "./Icon";

export interface SelectDropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  variant?: "default" | "error" | "success";
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  placeholder = "Select an option",
  variant = "default",
  inputSize = "md",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const baseClasses =
    "relative border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white appearance-none";

  const variantClasses = {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm pr-8",
    md: "px-4 py-2 text-sm pr-10",
    lg: "px-4 py-3 text-base pr-12",
  };

  const iconSizeClasses = {
    sm: "right-2 top-1.5",
    md: "right-3 top-2.5",
    lg: "right-3 top-4",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <div className={`relative ${widthClass}`}>
      <select
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[inputSize]} ${widthClass} ${className}`}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <div className={`absolute ${iconSizeClasses[inputSize]} pointer-events-none`}>
        <Icon
          name={isOpen ? "chevronUp" : "chevronDown"}
          size={inputSize === "sm" ? "sm" : "md"}
          color="rgb(107 114 128)"
        />
      </div>
    </div>
  );
};

export default SelectDropdown;
