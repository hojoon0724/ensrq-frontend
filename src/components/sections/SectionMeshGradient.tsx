import { TopContainer } from "@/components/layouts";
import { MeshGradientCurves, MeshGradientStraight } from "@/components/organisms";

interface SectionMeshGradientProps {
  children: React.ReactNode;
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  tone?: "dark" | "light";
  backgroundColor?: string;
  variant?: "curved" | "straight";
}

export function SectionMeshGradient({
  color1 = "sand",
  color2,
  color3,
  tone = "light",
  backgroundColor,
  children,
  className = "flex flex-col justify-center items-center w-full h-full",
  variant = "curved",
}: SectionMeshGradientProps) {
  const toneShades = tone === "dark" ? 900 : 50;
  const backgroundShade = tone === "dark" ? 400 : 950;

  const GradientComponent = variant === "curved" ? MeshGradientCurves : MeshGradientStraight;

  return (
    <section className={`relative w-full overflow-hidden ${className}`}>
      <GradientComponent
        colorShades={[
          [`var(--${color1}-${toneShades})`],
          color2 ? [`var(--${color2}-${toneShades})`] : [],
          color3 ? [`var(--${color3}-${toneShades})`] : [],
        ]}
        blendMode="blended"
        intensity={variant === "curved" ? 0.5 : undefined}
        speed={variant === "curved" ? 1 : undefined}
        tone={tone}
        backgroundColor={`var(--${backgroundColor}-${backgroundShade})`}
      />
      {/* Ensure the inner container receives the same sizing/layout classes so children can use h-full and center correctly */}
      <TopContainer className={className}>{children}</TopContainer>
    </section>
  );
}
