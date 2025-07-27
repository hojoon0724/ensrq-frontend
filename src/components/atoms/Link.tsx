import NextLink from "next/link";
import React from "react";

export interface LinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "danger" | "unstyled";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  underline?: "none" | "hover" | "always";
  className?: string;
}

const Link: React.FC<LinkProps> = ({
  href,
  children,
  variant = "default",
  size = "md",
  external = false,
  underline = "hover",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-sm";

  const variantClasses = {
    default: "text-blue-600 hover:text-blue-800 focus:ring-blue-500",
    primary: "text-blue-600 hover:text-blue-800 focus:ring-blue-500",
    secondary: "text-gray-600 hover:text-gray-800 focus:ring-gray-500",
    danger: "text-red-600 hover:text-red-800 focus:ring-red-500",
    unstyled: "text-inherit hover:text-inherit focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const underlineClasses = {
    none: "no-underline",
    hover: "no-underline hover:underline",
    always: "underline",
  };

  const linkClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${underlineClasses[underline]} ${className}`;

  const externalProps = external
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={linkClasses} {...externalProps} {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={linkClasses} {...props}>
      {children}
    </NextLink>
  );
};

export default Link;
