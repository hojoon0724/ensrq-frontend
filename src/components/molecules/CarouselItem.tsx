import React from "react";

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export function CarouselItem({ children, className = "" }: CarouselItemProps) {
  return <div className={`w-full h-full flex items-center justify-center ${className}`}>{children}</div>;
}
