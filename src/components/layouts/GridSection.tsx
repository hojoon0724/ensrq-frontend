import { TopContainer } from "@/components/layouts";

interface GridSectionProps {
  children: React.ReactNode;
  className?: string;
  gridCols?: {
    base?: number;
    md?: number;
    lg?: number;
  };
}

export function GridSection({
  children,
  className = "gap-s p-s",
  gridCols = { base: 1, md: 2, lg: 3 },
}: GridSectionProps) {
  const gridClasses = `grid grid-cols-${gridCols.base || 1} md:grid-cols-${gridCols.md || 2} lg:grid-cols-${gridCols.lg || 3} ${className}`;

  return (
    <section>
      <TopContainer className={gridClasses}>{children}</TopContainer>
    </section>
  );
}
