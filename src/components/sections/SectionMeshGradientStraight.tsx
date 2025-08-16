import { TopContainer } from "@/components/sections";
import { MeshGradientStraight } from "../organisms";

interface SectionMeshGradientStraightProps {
  children: React.ReactNode;
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  tone?: "dark" | "light";
  backgroundColor?: string;
}

export function SectionMeshGradientStraight({
  color1 = "sand",
  color2,
  color3,
  tone = "light",
  backgroundColor,
  children,
  className = "flex flex-col justify-center items-center w-full h-full",
}: SectionMeshGradientStraightProps) {
  const toneShades = tone === "dark" ? 900 : 50;
  const backgroundShade = tone === "dark" ? 400 : 950;

  return (
    <section className={`relative w-full overflow-hidden ${className}`}>
      <MeshGradientStraight
        colorShades={[
          [`var(--${color1}-${toneShades})`],
          color2 ? [`var(--${color2}-${toneShades})`] : [],
          color3 ? [`var(--${color3}-${toneShades})`] : [],
        ]}
        blendMode="blended"
        intensity={0.5}
        tone={tone}
        backgroundColor={`var(--${backgroundColor}-${backgroundShade})`}
      />
      {/* Ensure the inner container receives the same sizing/layout classes so children can use h-full and center correctly */}
      <TopContainer className={className}>{children}</TopContainer>
    </section>
  );
}
