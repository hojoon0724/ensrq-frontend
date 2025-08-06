import { MovingGradientText } from "@/components/atoms";
import { SectionMeshGradient } from "@/components/sections";

export default function MeshGradientPage() {
  return (
    <div className="flex w-screen h-[40svh] flex-col items-center justify-center overflow-clip">
      <SectionMeshGradient
        className="absolute flex flex-col items-center justify-center"
        color1="sand"
        // color2="sky"
        // color3="water"
        backgroundColor="var(--sand-600)"
      >
        <MovingGradientText
          text="Perpetual Motion"
          className="text-8xl font-bold"
          gradientColor="sand"
          tone="dark"
        />
      </SectionMeshGradient>
    </div>
  );
}
