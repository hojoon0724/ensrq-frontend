"use client";

import { useEffect, useState } from "react";
import { MeshGradientManualCurves } from "../../components/organisms";

export default function Canvas() {
  const [color1, setColor1] = useState("sand");
  const [theme, setTheme] = useState("light");
  const [shade, setShade] = useState(theme === "dark" ? 900 : 50);
  const [bgShade, setBgShade] = useState(theme === "dark" ? 400 : 950);
  const [lineCount, setLineCount] = useState(6);
  const [nodeCount, setNodeCount] = useState(4);
  const [baselineWidth, setBaselineWidth] = useState(500);
  const [nodes, setNodes] = useState<Array<Array<{ x: number; y: number }>>>([]);

  // Generate random coordinates when lineCount or nodeCount changes
  const generateRandomNodes = (lines: number, nodesPerLine: number) => {
    const newNodes: Array<Array<{ x: number; y: number }>> = [];
    for (let i = 0; i < lines; i++) {
      const lineNodes: Array<{ x: number; y: number }> = [];
      for (let j = 0; j < nodesPerLine; j++) {
        let x = (j / (nodesPerLine - 1)) * 100; // Distribute X evenly

        // Add offset to first and last nodes to avoid cut-off ends
        if (j === 0) {
          x -= 20; // First node: move 20 units to the left
        } else if (j === nodesPerLine - 1) {
          x += 20; // Last node: move 20 units to the right
        }

        const y = Math.random() * 100; // Random Y
        lineNodes.push({ x, y });
      }
      newNodes.push(lineNodes);
    }
    return newNodes;
  };

  // Initialize nodes on component mount and when dimensions change
  useEffect(() => {
    setNodes(generateRandomNodes(lineCount, nodeCount));
  }, [lineCount, nodeCount]);

  function changeShade() {
    setShade(shade === 900 ? 50 : 900);
    setBgShade(bgShade === 400 ? 950 : 400);
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const updateNodePosition = (lineIndex: number, nodeIndex: number, field: "x" | "y", value: number) => {
    const newNodes = [...nodes];
    if (!newNodes[lineIndex]) {
      newNodes[lineIndex] = [];
    }
    if (!newNodes[lineIndex][nodeIndex]) {
      newNodes[lineIndex][nodeIndex] = { x: 0, y: 0 };
    }
    newNodes[lineIndex][nodeIndex][field] = value;
    setNodes(newNodes);
  };

  return (
    <div className="flex">
      <div className="w-full h-[min(100svw,100svh)]">
        <section className={`relative h-[50%] w-full`}>
          <div className="">
            <MeshGradientManualCurves
              colorShades={[[`var(--${color1}-${shade})`]]}
              speed={0}
              backgroundColor={`var(--${color1}-${bgShade})`}
              lineCount={lineCount}
              baselineWidth={baselineWidth}
              nodeCount={nodeCount}
              nodes={nodes}
            />
          </div>
        </section>
        <div className="flex flex-col w-full">
          <div className="relative h-20 w-full flex items-center justify-center">
            <button className="absolute top-4 right-4 bg-white p-2 rounded shadow" onClick={changeShade}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <div className="color-change-buttons absolute top-4 left-4 space-x-2 flex justify-center items-center">
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
          <div className="bg-gray-100 p-4 w-full">
            <h3 className="font-bold mb-4">Mesh Controls</h3>
            <div className="flex gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Line Count:</label>
                <input
                  type="number"
                  value={lineCount}
                  onChange={(e) => setLineCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                  max="20"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nodes per Line:</label>
                <input
                  type="number"
                  value={nodeCount}
                  onChange={(e) => setNodeCount(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-full border rounded px-2 py-1"
                  min="2"
                  max="10"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Line thickness:</label>
                <input
                  type="number"
                  value={baselineWidth}
                  onChange={(e) => setBaselineWidth(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                  max="1000
                  "
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: lineCount }, (_, lineIndex) => (
                <div key={lineIndex} className="border rounded p-3 w-full">
                  <h4 className="font-medium">Line {lineIndex + 1}</h4>
                  <div className="space-y-2 flex w-full gap-8">
                    {Array.from({ length: nodeCount }, (_, nodeIndex) => (
                      <div key={nodeIndex} className="flex items-center space-x-2 w-full">
                        <span className="text-xs w-8">N{nodeIndex + 1}:</span>
                        <input
                          type="number"
                          placeholder="X"
                          value={nodes[lineIndex]?.[nodeIndex]?.x?.toFixed(1) || ""}
                          onChange={(e) =>
                            updateNodePosition(lineIndex, nodeIndex, "x", parseFloat(e.target.value) || 0)
                          }
                          className="w-16 border rounded px-1 py-0.5 text-xs"
                          step="0.1"
                        />
                        <input
                          type="range"
                          placeholder="Y"
                          value={nodes[lineIndex]?.[nodeIndex]?.y?.toFixed(1) || ""}
                          onChange={(e) =>
                            updateNodePosition(lineIndex, nodeIndex, "y", parseFloat(e.target.value) || 0)
                          }
                          className="border rounded px-1 py-0.5 text-xs w-full"
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
