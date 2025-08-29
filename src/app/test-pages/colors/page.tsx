const hues = ['sand', 'water', 'sky'];
const mutedHues = ['sand-muted', 'water-muted', 'sky-muted'];
const backgroundVariants = ['black', 'dark', 'neutral', 'bright', 'white'].reverse();
const backgroundHues = ['sand-bg', 'water-bg', 'sky-bg'];
const shades: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export default function ColorTest() {
  return (
    <div className="flex flex-col w-screen min-h-screen p-4 gap-8">
      {/* Regular Hues */}
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Regular Hues</h2>
        {hues.map((hue) => (
          <div key={hue} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 capitalize">{hue}</h3>
            <div className="flex flex-wrap gap-2">
              {shades.map((shade) => (
                <div 
                  key={`${hue}-${shade}`} 
                  className="w-28 h-28 flex items-center justify-center border border-gray-300"
                  style={{ backgroundColor: `var(--${hue}-${shade})` }}
                >
                  <span className="text-xs text-center font-mono bg-black bg-opacity-50 text-white px-1 py-0.5 rounded">
                    {`${hue}-${shade}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Muted Hues */}
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Muted Hues</h2>
        {mutedHues.map((hue) => (
          <div key={hue} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 capitalize">{hue}</h3>
            <div className="flex flex-wrap gap-2">
              {shades.map((shade) => (
                <div 
                  key={`${hue}-${shade}`} 
                  className="w-28 h-28 flex items-center justify-center border border-gray-300"
                  style={{ backgroundColor: `var(--${hue}-${shade})` }}
                >
                  <span className="text-xs text-center font-mono bg-black bg-opacity-50 text-white px-1 py-0.5 rounded">
                    {`${hue}-${shade}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Background Colors */}
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Background Colors</h2>
        {backgroundHues.map((hue) => (
          <div key={hue} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 capitalize">{hue}</h3>
            <div className="flex flex-wrap gap-2">
              {backgroundVariants.map((variant) => (
                <div 
                  key={`${hue}-${variant}`} 
                  className="w-28 h-28 flex items-center justify-center border border-gray-300"
                  style={{ backgroundColor: `var(--${hue}-${variant})` }}
                >
                  <span className="text-xs text-center font-mono bg-black bg-opacity-50 text-white px-1 py-0.5 rounded">
                    {`${hue}-${variant}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}