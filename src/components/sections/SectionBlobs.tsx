import { MeshGradientCanvas } from "@/components/organisms";

interface SectionBlobsProps {
  children?: React.ReactNode;
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  backgroundColor?: string;
}

export function SectionBlobs({
  color1 = "sand",
  color2,
  color3,
  backgroundColor,
  children,
  className = "flex flex-col justify-center items-center w-full h-full",
}: SectionBlobsProps) {
  const toneShades = 50;
  const backgroundShade = 50;

  return (
    <section className={`relative w-full overflow-hidden ${className}`}>
      <MeshGradientCanvas
        colorShades={[
          [`var(--${color1}-${toneShades})`],
          color2 ? [`var(--${color2}-${toneShades})`] : [],
          color3 ? [`var(--${color3}-${toneShades})`] : [],
        ]}
        blendMode="blended"
        intensity={0.5}
        speed={1}
        backgroundColor={`var(--${backgroundColor}-${backgroundShade})`}
      />
      <div className={`w-full h-full flex justify-center items-center text-center`}>{children}</div>
    </section>
  );
}
