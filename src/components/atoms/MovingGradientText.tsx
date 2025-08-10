export function MovingGradientText({
  children,
  text,
  className = "text-8xl font-bold",
  gradientColor = "sand",
  tone = "default",
}: Readonly<{
  children?: React.ReactNode;
  text: string;
  className?: string;
  gradientColor: string;
  tone?: "default" | "dark" | "light";
}>) {
  function getToneValues(tone: "default" | "dark" | "light") {
    switch (tone) {
      case "dark":
        return [700, 800, 600, 800];
      case "light":
        return [100, 300, 50, 200];
      default:
        return [400, 600, 300, 500];
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center ">
      <div
        className={`bg-clip-text text-transparent ${className}`}
        style={{
          backgroundImage: `
          linear-gradient(45deg,
          var(--${gradientColor}-${getToneValues(tone)[0]}),
          var(--${gradientColor}-${getToneValues(tone)[1]}),
          var(--${gradientColor}-${getToneValues(tone)[2]}),
          var(--${gradientColor}-${getToneValues(tone)[3]})
          )`,
          backgroundSize: "500% 500%",
          animation: "gradient 4s ease infinite",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        {text}
      </div>
      {children}
    </div>
  );
}
