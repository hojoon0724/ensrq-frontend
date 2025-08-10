import { TopContainer } from "./TopContainer";

export function SectionEmpty({
  children,
  themeColor = "gray",
  tone = "light",
  className = "flex flex-col justify-center items-center w-full h-full gap-s",
}: Readonly<{ children: React.ReactNode; themeColor?: string; className?: string; tone?: "light" | "dark" }>) {
  const toneValue = tone === "dark" ? 700 : 50;
  return (
    <section style={{ backgroundColor: `var(--${themeColor}-${toneValue})` }}>
      <TopContainer className={className}>{children}</TopContainer>
    </section>
  );
}
