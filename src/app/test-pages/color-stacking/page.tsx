const layers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const shades: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export default function colorStacking() {
  return (
    <div className="container w-full min-h-[80svh]">
      <div className="sky w-full h-[500px] relative">
        <div className="background bg-black absolute w-full h-full inset-0 top-0 left-0"></div>
        {layers.map((layer) => (
          <div
            key={layer}
            className={`layer bg-sky-${50} absolute h-full inset-0 top-0 opacity-10`}
            style={{ width: `${((layer + 1) * 100) / layers.length}%`, zIndex: layer }}
          ></div>
        ))}
      </div>
      <div className="w-full flex justify-between">
        {shades.map((shade) => (
          <div key={shade} className={`layer bg-sky-${shade} w-20 h-20`}></div>
        ))}
      </div>

      <div className="sand w-full h-80 relative">
        <div className="background bg-sand-950 absolute w-full h-full inset-0 top-0 left-0"></div>
        {layers.map((layer) => (
          <div
            key={layer}
            className={`layer bg-sand-${50} absolute h-full inset-0 top-0 left-0 opacity-10`}
            style={{ width: `${((layer + 1) * 100) / layers.length}%`, zIndex: layer }}
          ></div>
        ))}
      </div>
      <div className="w-full flex justify-between">
        {shades.map((shade) => (
          <div key={shade} className={`layer bg-sand-${shade} w-20 h-20`}></div>
        ))}
      </div>

      <div className="water w-full h-80 relative">
        <div className="background bg-black absolute w-full h-full inset-0 top-0 left-0"></div>
        {layers.map((layer) => (
          <div
            key={layer}
            className={`layer bg-water-${50} absolute h-full inset-0 top-0 left-0 opacity-10`}
            style={{ width: `${((layer + 1) * 100) / layers.length}%`, zIndex: layer }}
          ></div>
        ))}
      </div>
      <div className="w-full flex justify-between">
        {shades.map((shade) => (
          <div key={shade} className={`layer bg-water-${shade} w-20 h-20`}></div>
        ))}
      </div>
    </div>
  );
}
