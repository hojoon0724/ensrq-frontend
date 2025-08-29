import { TopContainer } from "@/components/layouts";

interface SectionGridProps {
  children: React.ReactNode;
  className?: string;
  gridCols?: {
    base?: number;
    md?: number;
    lg?: number;
  };
}

export function SectionGrid({
  children,
  className = "gap-s p-s",
  gridCols = { base: 1, md: 2, lg: 3 },
}: SectionGridProps) {
  const gridClasses = `grid grid-cols-${gridCols.base || 1} md:grid-cols-${gridCols.md || 2} lg:grid-cols-${gridCols.lg || 3} ${className}`;

  return (
    <section>
      <TopContainer className={gridClasses}>{children}</TopContainer>
    </section>
  );
}
