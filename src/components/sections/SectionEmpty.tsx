export default function SectionEmpty({
  children,
  themeColor = "gray",
  className = "flex flex-col justify-center items-center w-full h-full",
}: Readonly<{ children: React.ReactNode; themeColor?: string; className?: string }>) {
  return (
    <section style={{ backgroundColor: `var(--${themeColor}-bg-white)` }}>
      <div className={`w-full h-full max-w-7xl ${className}`}>{children}</div>
    </section>
  );
}
