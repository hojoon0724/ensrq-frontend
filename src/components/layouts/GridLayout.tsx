interface GridLayoutProps {
  minCols?: number;
  maxCols?: number;
  children: React.ReactNode;
  className?: string;
}

export function GridLayout({ minCols = 1, maxCols = 100, children, className = "gap-s" }: GridLayoutProps) {
  const gridClasses = `grid grid-cols-${minCols} md:grid-cols-${Math.min(maxCols, minCols + 1)} lg:grid-cols-${Math.min(maxCols, minCols + 2)} xl:grid-cols-${Math.min(maxCols, minCols + 3)} ${className}`;

  return <div className={gridClasses}>{children}</div>;
}
