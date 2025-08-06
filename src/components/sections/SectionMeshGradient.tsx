import { MeshGradientCanvas } from "../organisms";
import { MeshGradientCurves } from "../organisms/MeshGradientCurves";

export function SectionMeshGradient({
  color1 = "sand",
  color2,
  color3,
  backgroundColor,
  children,
  className = "flex flex-col justify-center items-center w-full h-full",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  backgroundColor?: string;
}>) {
  return (
    <section className="relative w-full h-full overflow-hidden">
      {/* <MeshGradientCanvas */}
      <MeshGradientCurves
        colorShades={[
          [
            // `var(--${color1}-950)`,
            // `var(--${color1}-900)`,
            // `var(--${color1}-800)`,
            `var(--${color1}-700)`,
            `var(--${color1}-600)`,
            `var(--${color1}-500)`,
            `var(--${color1}-400)`,
            `var(--${color1}-300)`,
            `var(--${color1}-200)`,
            `var(--${color1}-100)`,
            `var(--${color1}-50)`,
          ],
          color2
            ? [
                // `var(--${color2}-950)`,
                // `var(--${color2}-900)`,
                // `var(--${color2}-800)`,
                `var(--${color2}-700)`,
                `var(--${color2}-600)`,
                `var(--${color2}-500)`,
                `var(--${color2}-400)`,
                `var(--${color2}-300)`,
                `var(--${color2}-200)`,
                `var(--${color2}-100)`,
                `var(--${color2}-50)`,
              ]
            : [],
          color3
            ? [
                // `var(--${color3}-950)`,
                // `var(--${color3}-900)`,
                // `var(--${color3}-800)`,
                `var(--${color3}-700)`,
                `var(--${color3}-600)`,
                `var(--${color3}-500)`,
                `var(--${color3}-400)`,
                `var(--${color3}-300)`,
                `var(--${color3}-200)`,
                `var(--${color3}-100)`,
                `var(--${color3}-50)`,
              ]
            : [],
        ]}
        blendMode="blended"
        intensity={0.5}
        speed={1}
        backgroundColor={backgroundColor}
      />
      <div className={`w-full h-full ${className}`}>{children}</div>
    </section>
  );
}
