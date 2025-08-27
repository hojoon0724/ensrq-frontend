import { SectionMeshGradient } from "@/components/sections";

export default function MeshGradientPage() {
  return (
    <div className="flex w-full h-[80svh] flex-col items-center justify-center overflow-clip">
      <SectionMeshGradient
        className="absolute flex flex-col items-center justify-center"
        color1="sky"
        backgroundColor="sky"
        tone="light"
        variant="straight"
      >
        <></>
      </SectionMeshGradient>
    </div>
  );
}
