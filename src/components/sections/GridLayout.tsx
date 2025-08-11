export function GridLayout({
  minCols = 1,
  maxCols = 100,
  children,
}: {
  minCols?: number;
  maxCols?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-${minCols} md:grid-cols-${Math.min(maxCols, minCols + 1)} lg:grid-cols-${Math.min(maxCols, minCols + 2)} xl:grid-cols-${Math.min(maxCols, minCols + 3)} gap-s`}
    >
      {children}
    </div>
  );
}
