import { TopContainer } from "./TopContainer";

interface SectionEmptyProps {
  children: React.ReactNode;
  themeColor?: string;
  tone?: "light" | "dark";
  className?: string;
}

export function SectionEmpty({
  children,
  themeColor = "gray",
  tone = "light",
  className = "flex flex-col justify-center items-center w-full h-full gap-s",
}: SectionEmptyProps) {
  const toneValue = tone === "dark" ? 700 : 50;

  return (
    <section style={{ backgroundColor: `var(--${themeColor}-${toneValue})` }}>
      <TopContainer className={className}>{children}</TopContainer>
    </section>
  );
}
