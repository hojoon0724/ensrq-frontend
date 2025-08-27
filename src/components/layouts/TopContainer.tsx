interface TopContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function TopContainer({ children, className = "" }: TopContainerProps) {
  return <div className={`w-full max-w-7xl mx-auto ${className}`}>{children}</div>;
}
