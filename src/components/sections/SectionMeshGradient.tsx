import { TopContainer } from "@/components/layouts";
import { MeshGradientCurves, MeshGradientStraight } from "@/components/organisms";
import { MeshGradientSCurve } from "../organisms/MeshGradientSCurve";

interface SectionMeshGradientProps {
  children: React.ReactNode;
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  tone?: "dark" | "light";
  backgroundColor?: string;
  variant?: "curved" | "straight" | "s-curve";
  // S-curve specific props
  nodes?: Array<Array<{ x: number; y: number }>>;
  baselineWidth?: number;
  lineCount?: number;
  nodeCount?: number;
  lockLastNodeX?: boolean;
  maxXMovement?: number;
  maxYMovement?: number;
  frozenNodeIndices?: number[];
  randomizeStart?: boolean;
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
  // S-curve specific props with defaults
  nodes = [
    [
      { x: 0, y: 10 },
      { x: 20, y: 10 },
    ],
    [
      { x: 0, y: 10 },
      { x: 20, y: 10 },
    ],
    [
      { x: 0, y: 10 },
      { x: 20, y: 10 },
    ],
    [
      { x: 0, y: 10 },
      { x: 20, y: 10 },
    ],
    [
      { x: 0, y: 10 },
      { x: 20, y: 10 },
    ],
    [
      { x: 0, y: 10 },
      { x: 20, y: 10 },
    ],
  ],
  baselineWidth = 200,
  lineCount = 6,
  nodeCount = 4,
  lockLastNodeX = true,
  maxXMovement = 10,
  maxYMovement = 50,
  frozenNodeIndices = [],
  randomizeStart = true,
}: SectionMeshGradientProps) {
  const toneShades = tone === "dark" ? 900 : 50;
  const backgroundShade = tone === "dark" ? 400 : 950;

  const commonProps = {
    colorShades: [
      [`var(--${color1}-${toneShades})`],
      color2 ? [`var(--${color2}-${toneShades})`] : [],
      color3 ? [`var(--${color3}-${toneShades})`] : [],
    ],
    tone,
    backgroundColor: backgroundColor === "transparent" ? "transparent" : `var(--${color1}-${backgroundShade})`,
  };

  const renderGradientComponent = () => {
    switch (variant) {
      case "curved":
        return <MeshGradientCurves {...commonProps} blendMode="blended" intensity={0.5} speed={1} />;
      case "s-curve":
        return (
          <MeshGradientSCurve
            {...commonProps}
            nodes={nodes}
            baselineWidth={baselineWidth}
            lineCount={lineCount}
            nodeCount={nodeCount}
            lockLastNodeX={lockLastNodeX}
            maxXMovement={maxXMovement}
            maxYMovement={maxYMovement}
            frozenNodeIndices={frozenNodeIndices}
            randomizeStart={randomizeStart}
            speed={1}
          />
        );
      case "straight":
      default:
        return <MeshGradientStraight {...commonProps} />;
    }
  };

  return (
    <section className={`relative w-full overflow-hidden ${className}`}>
      {renderGradientComponent()}
      {/* Ensure the inner container receives the same sizing/layout classes so children can use h-full and center correctly */}
      <TopContainer className={className}>{children}</TopContainer>
    </section>
  );
}
