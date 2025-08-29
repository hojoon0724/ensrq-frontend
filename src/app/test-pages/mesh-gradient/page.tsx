import { SectionMeshGradient } from "@/components/sections";

export default function MeshGradientPage() {
  return (
    <div className="flex w-full h-[80svh] flex-col items-center justify-center overflow-clip">
      <SectionMeshGradient
        color1="sand"
        tone="light"
        variant="s-curve"
        baselineWidth={700}
        lockLastNodeX={true}
        lineCount={6}
        nodeCount={4}
        nodes={[
          [
            { x: 0, y: 0 },
            { x: 20, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 20, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 20, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 20, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 20, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 20, y: 0 },
          ],
        ]}
      >
        <></>
      </SectionMeshGradient>
      {/* <MeshGradientSCurve
        colorShades={[[getColor(color1)]]}
        intensity={0.5}
        speed={1}
        backgroundColor={getBackgroundColor("background")}
        tone={tone}
        baselineWidth={200}
        lockLastNodeX={true}
        maxXMovement={10}
        maxYMovement={40}
        lineCount={6}
        nodeCount={4}
        nodes={[
          [
            { x: 0, y: 0 },
            { x: 30, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 30, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 30, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 30, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 30, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 30, y: 0 },
          ],
        ]}
      /> */}
    </div>
  );
}
