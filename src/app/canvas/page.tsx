"use client";

import { useState } from "react";
import { MeshGradientManualCurves } from "../../components/organisms";

export default function Canvas() {
  const [color1, setColor1] = useState("sand");
  const [theme, setTheme] = useState("light");
  const [shade, setShade] = useState(theme === "dark" ? 900 : 50);
  const [bgShade, setBgShade] = useState(theme === "dark" ? 400 : 950);

  function changeShade() {
    setShade(shade === 900 ? 50 : 900);
    setBgShade(bgShade === 400 ? 950 : 400);
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div className="h-[100svw]">
      <section className={`relative h-full w-full`}>
        <div className="">
          <MeshGradientManualCurves
            colorShades={[[`var(--${color1}-${shade})`]]}
            blendMode="blended"
            speed={0}
            backgroundColor={`var(--${color1}-${bgShade})`}
          />
        </div>
      </section>
        <div className="relative">
          <button className="absolute top-4 right-4 bg-white p-2 rounded shadow" onClick={changeShade}>
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <div className="color-change-buttons absolute top-4 left-4 space-x-2">
            <button className="bg-white p-2 rounded shadow" onClick={() => setColor1("sand")}>
              Sand
            </button>
            <button className="bg-white p-2 rounded shadow" onClick={() => setColor1("sky")}>
              Sky
            </button>
            <button className="bg-white p-2 rounded shadow" onClick={() => setColor1("water")}>
              Water
            </button>
          </div>
        </div>
    </div>
  );
}
