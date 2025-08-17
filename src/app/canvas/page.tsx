"use client";

import { useEffect, useState, useCallback } from "react";
import { MeshGradientManualCurves } from "../../components/organisms";

export default function Canvas() {
  const [color1, setColor1] = useState("sand");
  const [theme, setTheme] = useState("light");
  const [shade, setShade] = useState(theme === "dark" ? 950 : 50);
  const [bgShade, setBgShade] = useState(theme === "dark" ? 400 : 900);
  const [lineCount, setLineCount] = useState(6);
  const [nodeCount, setNodeCount] = useState(4);
  const [baselineWidth, setBaselineWidth] = useState(500);
  const [nodes, setNodes] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const [lockedLines, setLockedLines] = useState<boolean[]>([]);
  const [lockedNodes, setLockedNodes] = useState<Array<Array<boolean>>>([]);

  // Generate random coordinates when lineCount or nodeCount changes
  const generateRandomNodes = useCallback((lines: number, nodesPerLine: number, preserveLocked = false, currentNodes?: Array<Array<{ x: number; y: number }>>, currentLockedLines?: boolean[], currentLockedNodes?: Array<Array<boolean>>) => {
    const newNodes: Array<Array<{ x: number; y: number }>> = [];
    for (let i = 0; i < lines; i++) {
      const lineNodes: Array<{ x: number; y: number }> = [];
      for (let j = 0; j < nodesPerLine; j++) {
        // If preserveLocked is true and this node is locked, keep existing position
        if (preserveLocked && currentLockedLines?.[i]) {
          if (currentNodes?.[i]?.[j]) {
            lineNodes.push({ ...currentNodes[i][j] });
            continue;
          }
        }
        if (preserveLocked && currentLockedNodes?.[i]?.[j]) {
          if (currentNodes?.[i]?.[j]) {
            lineNodes.push({ ...currentNodes[i][j] });
            continue;
          }
        }

        let x = (j / (nodesPerLine - 1)) * 100; // Distribute X evenly

        // Add offset to first and last nodes to avoid cut-off ends
        if (j === 0) {
          x -= 20; // First node: move 20 units to the left
        } else if (j === nodesPerLine - 1) {
          x += 20; // Last node: move 20 units to the right
        }

        // If we're preserving locked nodes (randomizing), keep existing X value if it exists
        if (preserveLocked && currentNodes?.[i]?.[j]) {
          x = currentNodes[i][j].x;
        }

        const y = Math.random() * 100; // Random Y
        lineNodes.push({ x, y });
      }
      newNodes.push(lineNodes);
    }
    return newNodes;
  }, []);

  // Initialize locked arrays
  const initializeLockArrays = (lines: number, nodesPerLine: number) => {
    setLockedLines(new Array(lines).fill(false));
    setLockedNodes(Array.from({ length: lines }, () => new Array(nodesPerLine).fill(false)));
  };

  // Initialize nodes on component mount and when dimensions change
  useEffect(() => {
    setNodes(generateRandomNodes(lineCount, nodeCount));
    initializeLockArrays(lineCount, nodeCount);
  }, [lineCount, nodeCount, generateRandomNodes]);

  function changeShade() {
    setShade(shade === 950 ? 50 : 950);
    setBgShade(bgShade === 400 ? 900 : 400);
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const toggleLineLock = (lineIndex: number) => {
    const newLockedLines = [...lockedLines];
    newLockedLines[lineIndex] = !newLockedLines[lineIndex];
    setLockedLines(newLockedLines);

    const newLockedNodes = [...lockedNodes];
    if (!newLockedNodes[lineIndex]) {
      newLockedNodes[lineIndex] = new Array(nodeCount).fill(false);
    }

    // If locking the line, lock all its nodes
    if (newLockedLines[lineIndex]) {
      newLockedNodes[lineIndex] = new Array(nodeCount).fill(true);
    } else {
      // If unlocking the line, unlock all its nodes
      newLockedNodes[lineIndex] = new Array(nodeCount).fill(false);
    }
    setLockedNodes(newLockedNodes);
  };

  const toggleNodeLock = (lineIndex: number, nodeIndex: number) => {
    const newLockedNodes = [...lockedNodes];
    if (!newLockedNodes[lineIndex]) {
      newLockedNodes[lineIndex] = new Array(nodeCount).fill(false);
    }
    newLockedNodes[lineIndex][nodeIndex] = !newLockedNodes[lineIndex][nodeIndex];
    setLockedNodes(newLockedNodes);

    // If unlocking a node, unlock the line as well
    if (!newLockedNodes[lineIndex][nodeIndex]) {
      const newLockedLines = [...lockedLines];
      newLockedLines[lineIndex] = false;
      setLockedLines(newLockedLines);
    } else {
      // If all nodes in the line are locked, lock the line
      const allNodesLocked = newLockedNodes[lineIndex].every(locked => locked);
      if (allNodesLocked) {
        const newLockedLines = [...lockedLines];
        newLockedLines[lineIndex] = true;
        setLockedLines(newLockedLines);
      }
    }
  };

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
    <div className="flex flex-col">
      <div className="flex-1 overflow-auto">
        <section className={`h-full w-full p-0`}>
          <div className="w-full h-screen">
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
      </div>
      <div className="bg-gray-100 p-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-bold mb-4">Mesh Controls</h3>
          <div className="color-change-buttons space-x-2 flex justify-center items-center z-10">
            <button
              className={`bg-${theme === "dark" ? "white" : "black"} text-${theme === "dark" ? "black" : "white"} p-2 rounded shadow`}
              onClick={changeShade}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button className="bg-white p-2 rounded shadow" onClick={() => setColor1("sand")}>
              Sand
            </button>
            <button className="bg-white p-2 rounded shadow" onClick={() => setColor1("sky")}>
              Sky
            </button>
            <button className="bg-white p-2 rounded shadow" onClick={() => setColor1("water")}>
              Water
            </button>
            <button className="bg-green-500 p-2 rounded shadow" onClick={() => {
              const newNodes = generateRandomNodes(lineCount, nodeCount, true, nodes, lockedLines, lockedNodes);
              setNodes(newNodes);
            }}>
              Randomize
            </button>
          </div>
        </div>
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
              max="1000"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: lineCount }, (_, lineIndex) => (
            <div key={lineIndex} className="border rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Line {lineIndex + 1}</h4>
                <div className="flex gap-2 justify-end items-center">
                  Lock <input 
                    type="checkbox" 
                    className="w-4 h-4" 
                    id={`line-${lineIndex}-lock`}
                    checked={lockedLines[lineIndex] || false}
                    onChange={() => toggleLineLock(lineIndex)}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4">
                {Array.from({ length: nodeCount }, (_, nodeIndex) => (
                  <div key={nodeIndex} className="flex flex-col items-center gap-2">
                    <span className="text-xs">N{nodeIndex + 1}:</span>
                    <input
                      type="text"
                      placeholder="X"
                      value={nodes[lineIndex]?.[nodeIndex]?.x?.toFixed(1) || ""}
                      onChange={(e) => updateNodePosition(lineIndex, nodeIndex, "x", parseFloat(e.target.value) || 0)}
                      className="w-12 border rounded px-1 py-0.5 text-xs "
                      step="0.1"
                    />
                    <input
                      type="range"
                      placeholder="Y"
                      value={nodes[lineIndex]?.[nodeIndex]?.y?.toFixed(1) || ""}
                      onChange={(e) => updateNodePosition(lineIndex, nodeIndex, "y", parseFloat(e.target.value) || 0)}
                      className="border rounded px-1 py-0.5 text-xs w-2 rotate-180"
                      style={{ WebkitAppearance: "slider-vertical" }}
                      step="0.1"
                    />
                    <input type="checkbox" 
                      className="w-4 h-4" 
                      id={`node-${nodeIndex}-lock`}
                      checked={lockedNodes[lineIndex]?.[nodeIndex] || false}
                      onChange={() => toggleNodeLock(lineIndex, nodeIndex)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
