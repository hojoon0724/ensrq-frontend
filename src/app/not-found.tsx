"use client";
import { SectionBlobs } from "@/components/sections/SectionBlobs";
// app/not-found.tsx
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [randomColor, setRandomColor] = useState("sand");

  useEffect(() => {
    const colors = ["sand", "sky", "water"];
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    setRandomColor(selectedColor);
  }, []);

  return (
    <SectionBlobs color1={randomColor} backgroundColor={`${randomColor}`}>
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 text-center overflow-hidden">
        <h1 className="text-8xl font-bold text-gray-900 opacity-0 drop-shadow-lg mb-4 animate-fadeIn">404</h1>
        <div className="text-box opacity-0 animate-fadeIn delay-200 border py-s px-double border-gray-970 mb-8">
          <p className="text-lg text-gray-800 font-serif italic">
            {`This page has been left blank to avoid an awkward page turn.`}
          </p>
        </div>
        <p className="text-sm opacity-0 animate-fadeIn delay-400 mb-8 font-serif">{`... and yet here we are. You should turn the page.`}</p>

        <div className="inline-block px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition animate-fadeIn opacity-0 delay-600">
          <Link href="/">Back to Home</Link>
        </div>
      </div>
    </SectionBlobs>
  );
}
