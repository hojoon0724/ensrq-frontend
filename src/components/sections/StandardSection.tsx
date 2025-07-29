export default function StandardSection(
  { children }: Readonly<{ children: React.ReactNode }>,
  { color }: Readonly<{ color: string }>
) {
  return (
    <section className="w-full" style={{ backgroundColor: color }}>
      <div className="w-full max-w-7xl">{children}</div>
    </section>
  );
}
