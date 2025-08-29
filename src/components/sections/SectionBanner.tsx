import { TopContainer } from "@/components/layouts";

interface SectionBannerProps {
  children: React.ReactNode;
  themeColor: string;
  tone: "light" | "dark";
  className?: string;
}

export function SectionBanner({ children, themeColor, tone, className = "" }: SectionBannerProps) {
  const toneValue = tone === "dark" ? 700 : 50;

  return (
    <section className={`max-h-[30svw] ${className}`} style={{ backgroundColor: `var(--${themeColor}-${toneValue})` }}>
      <TopContainer>{children}</TopContainer>
    </section>
  );
}
