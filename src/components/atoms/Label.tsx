import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: "default" | "required" | "disabled";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ variant = "default", size = "md", children, className = "", ...props }) => {
  const baseClasses = "font-medium";

  const variantClasses = {
    default: "text-gray-700",
    required: 'text-gray-700 after:content-["*"] after:ml-1 after:text-red-500',
    disabled: "text-gray-400 cursor-not-allowed",
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <label className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </label>
  );
};

export default Label;
