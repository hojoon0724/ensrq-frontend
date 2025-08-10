import { TopContainer } from "./TopContainer";

export function SectionBanner({
  children,
  themeColor,
  tone,
}: Readonly<{ children: React.ReactNode; themeColor: string; tone: string }>) {
  return (
    <section className="max-h-[30svw]" style={{ backgroundColor: `var(--${themeColor}-${tone})` }}>
      <TopContainer>{children}</TopContainer>
    </section>
  );
}
