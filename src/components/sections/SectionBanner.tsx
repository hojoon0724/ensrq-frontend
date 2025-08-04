export function SectionBanner({ children, themeColor }: Readonly<{ children: React.ReactNode; themeColor: string }>) {
  return (
    <section className="max-h-[30svw]" style={{ backgroundColor: `var(--${themeColor}-bg-dark)` }}>
      <div className="w-full h-full max-w-7xl">{children}</div>
    </section>
  );
}
