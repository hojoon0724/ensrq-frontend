export function TopContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`w-full max-w-7xl mx-auto ${className}`}>{children}</div>;
}
