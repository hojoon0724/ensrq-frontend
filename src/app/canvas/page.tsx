"use client";

import { MeshGradientManualCurves } from "@/components/organisms";
import { useCallback, useEffect, useMemo, useState } from "react";

const lightLineShadeVal = 50;
const darkLineShadeVal = 950;

const lightBgShadeVal = 400;
const darkBgShadeVal = 900;

const lineShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const blendModes = ["multiply", "source-over", "darken", "screen", "overlay", "lighten"];

export default function Canvas() {
  const [theme, setTheme] = useState("light");
  const [shade, setShade] = useState(theme === "dark" ? darkLineShadeVal : lightLineShadeVal);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [bgShade, setBgShade] = useState(theme === "dark" ? 400 : 900);
  const [groupCount, setGroupCount] = useState(1);
  const [lineCount, setLineCount] = useState(6);
  const [nodeCount, setNodeCount] = useState(4);
  const [baselineWidth, setBaselineWidth] = useState(200);
  const [nodes, setNodes] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const [lockedLines, setLockedLines] = useState<boolean[]>([]);
  const [lockedNodes, setLockedNodes] = useState<Array<Array<boolean>>>([]);
  const [lineColors, setLineColors] = useState<string[]>([]);
  const [nextNodeThreshold, setNextNodeThreshold] = useState(30);
  const [nextNodeRandomFromCurrent, setNextNodeRandomFromCurrent] = useState(10);
  const [showControls, setShowControls] = useState(true);
  const [blendMode, setBlendMode] = useState<"multiply" | "screen" | "source-over" | "overlay" | "darken" | "lighten">(
    "multiply"
  );

  const colorOptions = useMemo(() => ["sand", "sky", "water"], []);
  const backgroundColorOptions = ["sand", "sky", "water", "black", "white"];

  // Generate random coordinates when lineCount or nodeCount changes
  const generateRandomNodes = useCallback(
    (
      lines: number,
      nodesPerLine: number,
      preserveLocked = false,
      currentNodes?: Array<Array<{ x: number; y: number }>>,
      currentLockedLines?: boolean[],
      currentLockedNodes?: Array<Array<boolean>>,
      yDisplacementThreshold?: number,
      randomFromCurrentThreshold?: number
    ) => {
      const newNodes: Array<Array<{ x: number; y: number }>> = [];
      for (let i = 0; i < lines; i++) {
        const lineNodes: Array<{ x: number; y: number }> = [];
        for (let j = 0; j < nodesPerLine; j++) {
          let x = (j / (nodesPerLine - 1)) * 100; // Default X distribution
          let y = Math.random() * 100; // Random Y

          // Add offset to first and last nodes to avoid cut-off ends
          if (j === 0) {
            x -= 20; // First node: move 20 units to the left
          } else if (j === nodesPerLine - 1) {
            x += 20; // Last node: move 20 units to the right
          }

          // If preserveLocked is true and this specific node or line is locked, keep existing position
          const isLineLocked = preserveLocked && currentLockedLines?.[i];
          const isNodeLocked = preserveLocked && currentLockedNodes?.[i]?.[j];

          if ((isLineLocked || isNodeLocked) && currentNodes?.[i]?.[j]) {
            lineNodes.push({ ...currentNodes[i][j] });
            continue;
          }

          // If we have existing nodes and we're preserving (randomizing), keep the current X position
          if (preserveLocked && currentNodes?.[i]?.[j]) {
            x = currentNodes[i][j].x; // Preserve user-set X position

            // Use "randomFromCurrentThreshold" if provided and > 0 (supercedes neighbor-based displacement)
            if (randomFromCurrentThreshold !== undefined && randomFromCurrentThreshold > 0) {
              const currentY = currentNodes[i][j].y;
              const minY = Math.max(0, currentY - randomFromCurrentThreshold);
              const maxY = Math.min(100, currentY + randomFromCurrentThreshold);
              y = minY + Math.random() * (maxY - minY);
            } else if (j > 0 && lineNodes[j - 1] && yDisplacementThreshold !== undefined) {
              // Use neighbor-based displacement if randomFromCurrentThreshold is 0 or not provided
              const prevNode = lineNodes[j - 1];
              const minY = Math.max(0, prevNode.y - yDisplacementThreshold);
              const maxY = Math.min(100, prevNode.y + yDisplacementThreshold);
              y = minY + Math.random() * (maxY - minY);
            }
          } else if (preserveLocked && j > 0 && lineNodes[j - 1] && yDisplacementThreshold !== undefined) {
            // For new nodes during randomization, use neighbor-based displacement
            const prevNode = lineNodes[j - 1];
            const minY = Math.max(0, prevNode.y - yDisplacementThreshold);
            const maxY = Math.min(100, prevNode.y + yDisplacementThreshold);
            y = minY + Math.random() * (maxY - minY);
          }

          lineNodes.push({ x, y });
        }
        newNodes.push(lineNodes);
      }
      return newNodes;
    },
    []
  );

  // Initialize locked arrays
  const initializeLockArrays = useCallback((lines: number, nodesPerLine: number) => {
    setLockedLines(new Array(lines).fill(false));
    setLockedNodes(Array.from({ length: lines }, () => new Array(nodesPerLine).fill(false)));
  }, []);

  // Initialize line colors separately
  const initializeLineColors = useCallback(
    (lines: number) => {
      setLineColors((prevColors) => {
        const newColors = [...prevColors];
        while (newColors.length < lines) {
          newColors.push(colorOptions[newColors.length % colorOptions.length]);
        }
        return newColors.slice(0, lines);
      });
    },
    [colorOptions]
  );

  // Initialize nodes on component mount and when dimensions change
  useEffect(() => {
    const totalLines = groupCount * lineCount;
    setNodes(generateRandomNodes(totalLines, nodeCount));
    initializeLockArrays(totalLines, nodeCount);
  }, [lineCount, nodeCount, groupCount, generateRandomNodes, initializeLockArrays]);

  // Initialize line colors when line count or group count changes
  useEffect(() => {
    const totalLines = groupCount * lineCount;
    initializeLineColors(totalLines);
  }, [lineCount, groupCount, initializeLineColors]);

  // Function to update a line's color
  const updateLineColor = (lineIndex: number, color: string) => {
    const newColors = [...lineColors];
    newColors[lineIndex] = color;
    setLineColors(newColors);
  };

  function changeShade() {
    setShade(shade === darkLineShadeVal ? lightLineShadeVal : darkLineShadeVal);
    setBgShade(bgShade === lightBgShadeVal ? darkBgShadeVal : lightBgShadeVal);
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
      const allNodesLocked = newLockedNodes[lineIndex].every((locked) => locked);
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

    // No constraints during manual editing - allow free movement
    newNodes[lineIndex][nodeIndex][field] = value;
    setNodes(newNodes);
  };

  const updateGroupNodePosition = (groupIndex: number, nodeIndex: number, field: "x" | "y", value: number) => {
    const newNodes = [...nodes];
    const startLine = groupIndex * lineCount;
    const endLine = Math.min(startLine + lineCount, groupCount * lineCount);

    for (let lineIndex = startLine; lineIndex < endLine; lineIndex++) {
      if (!newNodes[lineIndex]) {
        newNodes[lineIndex] = [];
      }
      if (!newNodes[lineIndex][nodeIndex]) {
        newNodes[lineIndex][nodeIndex] = { x: 0, y: 0 };
      }
      // Only update if the node is not locked
      if (!lockedNodes[lineIndex]?.[nodeIndex]) {
        newNodes[lineIndex][nodeIndex][field] = value;
      }
    }
    setNodes(newNodes);
  };

  const updateGroupColor = (groupIndex: number, color: string) => {
    const newColors = [...lineColors];
    const startLine = groupIndex * lineCount;
    const endLine = Math.min(startLine + lineCount, groupCount * lineCount);

    for (let lineIndex = startLine; lineIndex < endLine; lineIndex++) {
      newColors[lineIndex] = color;
    }
    setLineColors(newColors);
  };

  const toggleGroupNodeLock = (groupIndex: number, nodeIndex: number) => {
    const newLockedNodes = [...lockedNodes];
    const newLockedLines = [...lockedLines];
    const startLine = groupIndex * lineCount;
    const endLine = Math.min(startLine + lineCount, groupCount * lineCount);

    // Check if any of the nodes at this position in this group are currently unlocked
    const hasUnlockedNode = newLockedNodes.some(
      (line, lineIndex) => lineIndex >= startLine && lineIndex < endLine && !line?.[nodeIndex]
    );

    // If any node is unlocked, lock all nodes at this position in this group
    // If all nodes are locked, unlock all nodes at this position in this group
    for (let lineIndex = startLine; lineIndex < endLine; lineIndex++) {
      if (!newLockedNodes[lineIndex]) {
        newLockedNodes[lineIndex] = new Array(nodeCount).fill(false);
      }
      newLockedNodes[lineIndex][nodeIndex] = hasUnlockedNode;

      // Update line lock status based on whether all nodes in the line are locked
      const allNodesLocked = newLockedNodes[lineIndex].every((locked) => locked);
      newLockedLines[lineIndex] = allNodesLocked;
    }

    setLockedNodes(newLockedNodes);
    setLockedLines(newLockedLines);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Controls Panel - shows above canvas when visible */}
      {showControls && (
        <div className="p-4 z-10 absolute" style={{ backgroundColor: `rgba(243, 244, 246, 0.5)` }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Mesh Controls</h3>
            <div className="background-color-switch-container flex gap-4">
              <div className="flex flex-col">
                <div className="flex">
                  {lineShades.map((lineShade) => (
                    <div
                      key={lineShade}
                      className={`flex px-2 py-1 items-center ${lineShade === shade ? "border-b-2 border-sky-400" : ""}`}
                    >
                      <button className="text-sm uppercase" onClick={() => setShade(lineShade)}>
                        {lineShade}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  {backgroundColorOptions.map((color) => (
                    <div
                      key={color}
                      className={`flex px-2 py-1 items-center ${backgroundColor === color ? "border-b-2 border-sky-400" : ""}`}
                    >
                      <button className="text-sm uppercase" onClick={() => setBackgroundColor(color)}>
                        {color}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-between">
            <div className="flex gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Groups:</label>
                <input
                  type="number"
                  value={groupCount}
                  onChange={(e) => setGroupCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                  max="20"
                />
              </div>
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
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Max Y Displacement:</label>
                <input
                  type="number"
                  value={nextNodeThreshold}
                  onChange={(e) => setNextNodeThreshold(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                  max="100"
                  title="Maximum vertical distance a node can be from its neighboring nodes"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Max Y Displacement From Current:</label>
                <input
                  type="number"
                  value={nextNodeRandomFromCurrent}
                  onChange={(e) => setNextNodeRandomFromCurrent(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full border rounded px-2 py-1"
                  min="0"
                  max="100"
                  title="Maximum vertical distance a node can move from its current position when randomizing (0 = use neighbor-based displacement)"
                />
              </div>
            </div>
            <div className="blend-modes flex gap-4 justify-center items-center">
              {blendModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() =>
                    setBlendMode(mode as "multiply" | "screen" | "source-over" | "overlay" | "darken" | "lighten")
                  }
                  className={`px-2 py-1 border text-sm ${blendMode === mode ? "bg-blue-500 text-white" : ""}`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {Array.from({ length: groupCount }, (_, groupIndex) => {
              const startLine = groupIndex * lineCount;
              const endLine = Math.min(startLine + lineCount, groupCount * lineCount);
              const groupLines = Array.from({ length: endLine - startLine }, (_, i) => startLine + i);

              // Get the most common color in this group
              const groupColors = groupLines.map((lineIndex) => lineColors[lineIndex] || colorOptions[0]);
              const mostCommonColor = groupColors.reduce((a, b, _, arr) =>
                arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length ? a : b
              );

              return (
                <div key={groupIndex} className="w-full">
                  <div className="flex gap-2 flex-wrap items-start">
                    {/* Group Control */}
                    <div className="border rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Group {groupIndex + 1}</h4>
                      </div>
                      <div className="mb-2 flex gap-4">
                        <label className="block text-sm font-medium mb-1">Color:</label>
                        <select
                          value={mostCommonColor}
                          onChange={(e) => updateGroupColor(groupIndex, e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        >
                          {colorOptions.map((color) => (
                            <option key={color} value={color}>
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-row gap-4">
                        {Array.from({ length: nodeCount }, (_, nodeIndex) => {
                          // Calculate average values across group lines for this node position
                          const avgX =
                            groupLines.length > 0
                              ? groupLines.reduce(
                                  (sum, lineIndex) => sum + (nodes[lineIndex]?.[nodeIndex]?.x || 0),
                                  0
                                ) / groupLines.length
                              : 0;
                          const avgY =
                            groupLines.length > 0
                              ? groupLines.reduce(
                                  (sum, lineIndex) => sum + (nodes[lineIndex]?.[nodeIndex]?.y || 0),
                                  0
                                ) / groupLines.length
                              : 0;

                          // Check if all nodes at this position in this group are locked
                          const allNodesLocked = groupLines.every(
                            (lineIndex) => lockedNodes[lineIndex]?.[nodeIndex] || false
                          );

                          return (
                            <div key={nodeIndex} className="flex flex-col items-center gap-2">
                              <span className="text-xs">N{nodeIndex + 1}:</span>
                              <input
                                type="text"
                                placeholder="X"
                                value={avgX.toFixed(1)}
                                onChange={(e) =>
                                  updateGroupNodePosition(groupIndex, nodeIndex, "x", parseFloat(e.target.value) || 0)
                                }
                                className="w-10 border rounded px-1 py-0.5 text-xs"
                                step="0.1"
                              />
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={avgY}
                                onChange={(e) =>
                                  updateGroupNodePosition(groupIndex, nodeIndex, "y", parseFloat(e.target.value) || 0)
                                }
                                className="border rounded px-1 py-0.5 text-xs w-2 rotate-180"
                                style={{ WebkitAppearance: "slider-vertical" }}
                                step="0.1"
                              />
                              <input
                                type="checkbox"
                                className="w-4 h-4"
                                id={`group-${groupIndex}-node-${nodeIndex}-lock`}
                                checked={allNodesLocked}
                                onChange={() => toggleGroupNodeLock(groupIndex, nodeIndex)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Individual line controls for this group */}
                    {groupLines.map((lineIndex) => (
                      <div key={lineIndex} className="border rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Line {lineIndex + 1}</h4>
                          <div className="flex gap-2 justify-end items-center">
                            Lock{" "}
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              id={`line-${lineIndex}-lock`}
                              checked={lockedLines[lineIndex] || false}
                              onChange={() => toggleLineLock(lineIndex)}
                            />
                          </div>
                        </div>
                        <div className="mb-2 flex gap-4">
                          <label className="block text-sm font-medium mb-1">Color:</label>
                          <select
                            value={lineColors[lineIndex] || colorOptions[0]}
                            onChange={(e) => updateLineColor(lineIndex, e.target.value)}
                            className="w-full border rounded px-2 py-1 text-sm"
                          >
                            {colorOptions.map((color) => (
                              <option key={color} value={color}>
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-row gap-4">
                          {Array.from({ length: nodeCount }, (_, nodeIndex) => (
                            <div key={nodeIndex} className="flex flex-col items-center gap-2">
                              <span className="text-xs">N{nodeIndex + 1}:</span>
                              <input
                                type="text"
                                placeholder="X"
                                value={nodes[lineIndex]?.[nodeIndex]?.x?.toFixed(1) || ""}
                                onChange={(e) =>
                                  updateNodePosition(lineIndex, nodeIndex, "x", parseFloat(e.target.value) || 0)
                                }
                                className="w-10 border rounded px-1 py-0.5 text-xs "
                                step="0.1"
                              />
                              <input
                                type="range"
                                placeholder="Y"
                                value={nodes[lineIndex]?.[nodeIndex]?.y?.toFixed(1) || ""}
                                onChange={(e) =>
                                  updateNodePosition(lineIndex, nodeIndex, "y", parseFloat(e.target.value) || 0)
                                }
                                className="border rounded px-1 py-0.5 text-xs w-2 rotate-180"
                                style={{ WebkitAppearance: "slider-vertical" }}
                                step="0.1"
                              />
                              <input
                                type="checkbox"
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
              );
            })}
          </div>
        </div>
      )}

      {/* Canvas Section - always takes full remaining height */}
      <div className="flex-1 relative">
        <section className={`h-full w-full p-0`}>
          <div className="w-full h-full">
            <MeshGradientManualCurves
              colorShades={lineColors.map((color) => [`var(--${color}-${shade})`])}
              speed={0}
              backgroundColor={`${backgroundColor === "black" || backgroundColor === "white" ? backgroundColor : `var(--${backgroundColor}-${bgShade})`}`}
              lineCount={groupCount * lineCount}
              baselineWidth={baselineWidth}
              nodeCount={nodeCount}
              nodes={nodes}
              blendMode={blendMode}
            />
          </div>
        </section>

        {/* Floating Control Buttons */}
        <div className="absolute top-4 right-4 space-x-2 flex justify-center items-center z-10 opacity-0 hover:opacity-100">
          <button
            className={`bg-${theme === "dark" ? "white" : "black"} text-${theme === "dark" ? "black" : "white"} p-2 rounded shadow`}
            onClick={changeShade}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded shadow"
            onClick={() => {
              const totalLines = groupCount * lineCount;
              const newNodes = generateRandomNodes(
                totalLines,
                nodeCount,
                true,
                nodes,
                lockedLines,
                lockedNodes,
                nextNodeThreshold,
                nextNodeRandomFromCurrent
              );
              setNodes(newNodes);
            }}
          >
            Randomize
          </button>
          <button className="bg-blue-500 text-white p-2 rounded shadow" onClick={() => setShowControls(!showControls)}>
            {showControls ? "Hide Controls" : "Show Controls"}
          </button>
        </div>
      </div>
    </div>
  );
}
