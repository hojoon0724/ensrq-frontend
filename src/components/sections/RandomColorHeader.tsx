"use client";

import BaseRandomColorHeader from "./BaseRandomColorHeader";

interface RandomColorHeaderProps {
  title: string;
  className?: string;
}

export default function RandomColorHeader({ title }: RandomColorHeaderProps) {
  return <BaseRandomColorHeader title={title} headerSize="large" />;
}
