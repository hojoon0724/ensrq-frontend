import { TopContainer } from "@/components/layouts";

interface SectionEmptyProps {
  children: React.ReactNode;
  themeColor?: string;
  tone?: "light" | "dark";
  white?: boolean;
  className?: string;
}

export function SectionEmpty({
  children,
  themeColor = "gray",
  tone = "light",
  white = false,
  className = "flex flex-col justify-center items-center w-full h-full gap-s",
}: SectionEmptyProps) {
  const toneValue = white ? 30 : tone === "dark" ? 700 : 50;

  return (
    <section className={className} style={{ backgroundColor: `var(--${themeColor}-${toneValue})` }}>
      <TopContainer className="flex flex-col justify-center items-center w-full h-full gap-s">{children}</TopContainer>
    </section>
  );
}
