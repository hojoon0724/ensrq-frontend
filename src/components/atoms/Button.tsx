export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outline" | "ghost";
  color?: "sky" | "blue" | "red" | "green" | "gray" | "sand" | "water";
  textColor?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  includeBaseClasses?: boolean;
  className?: string;
}
export function Button({
  variant = "filled",
  color = "sky",
  textColor,
  size = "md",
  loading = false,
  disabled,
  children,
  includeBaseClasses = true,
  className = "",
  ...props
}: ButtonProps): React.ReactNode {
  const base =
    "inline-flex items-center justify-center font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Define color variants with complete class names to ensure Tailwind includes them
  const colorVariants = {
    sky: {
      filled: "border-0 border-sky-500 bg-sky-500 text-white hover:bg-sky-50 hover:text-sky-950 focus:ring-sky-300",
      outline: "border-2 border-sky-600 text-sky-600 hover:bg-sky-600 hover:border-sky-600 hover:text-white focus:ring-sky-300",
      ghost: "border-0 text-sky-600 hover:bg-sky-50 hover:text-sky-950 focus:ring-sky-300",
    },
    sand: {
      filled: "border-0 border-sand-500 bg-sand-500 text-white hover:bg-sand-50 hover:text-sand-950 focus:ring-sand-300",
      outline: "border-2 border-sand-600 text-sand-600 hover:bg-sand-600 hover:border-sand-600 hover:text-white focus:ring-sand-300",
      ghost: "border-0 text-sand-600 hover:bg-sand-50 hover:text-sand-950 focus:ring-sand-300",
    },
    water: {
      filled: "border-0 border-water-500 bg-water-500 text-white hover:bg-water-50 hover:text-water-950 focus:ring-water-300",
      outline: "border-2 border-water-600 text-water-600 hover:bg-water-600 hover:border-water-600 hover:text-white focus:ring-water-300",
      ghost: "border-0 text-water-600 hover:bg-water-50 hover:text-water-950 focus:ring-water-300",
    },
    red: {
      filled: "border-0 border-red-600 bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
      outline: "border-2 border-red-600 text-red-600 hover:bg-red-700 hover:border-red-700 hover:text-white focus:ring-red-300",
      ghost: "border-0 text-red-600 hover:bg-red-200 hover:text-red-950 hover:text-red-950 focus:ring-red-300",
    },
    gray: {
      filled: "border-0 border-gray-500 bg-gray-500 text-white hover:bg-gray-700 focus:ring-gray-300",
      outline: "border-2 border-gray-500 text-gray-500 hover:bg-gray-700 hover:border-gray-700 hover:text-white focus:ring-gray-300",
      ghost: "border-0 text-gray-600 hover:bg-gray-200 hover:text-gray-950 focus:ring-gray-300",
    },
  };

  const variantClasses = {
    filled: colorVariants[color as keyof typeof colorVariants]?.filled || colorVariants.sky.filled,
    outline: colorVariants[color as keyof typeof colorVariants]?.outline || colorVariants.sky.outline,
    ghost: colorVariants[color as keyof typeof colorVariants]?.ghost || colorVariants.sky.ghost,
  };

  // Apply custom text color if provided
  const finalVariantClass = textColor
    ? variantClasses[variant].replace(/text-\w+-\w+|text-white/, textColor)
    : variantClasses[variant];

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const allClasses = `${includeBaseClasses ? base : ""} ${finalVariantClass} ${sizeClasses[size]} ${className}`;

  return (
    <button className={allClasses} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}