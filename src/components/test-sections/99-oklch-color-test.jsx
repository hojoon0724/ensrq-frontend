import colorsJson from "@/data/colors.js";

const hue = colorsJson.hues;
const bgLightness = colorsJson.bgLightness;
const bgChroma = colorsJson.bgChroma;

// You can tune these based on perception
const lightnessRanges = colorsJson.lightnessRanges;

// Fixed chroma values (OKLCH uses 0–0.4+ depending on display; 0.1–0.3 is safe for most cases)
const chromas = [colorsJson.lowChroma, colorsJson.highChroma];
const lowChroma = colorsJson.lowChroma;
const highChroma = colorsJson.highChroma;

const steps = colorsJson.steps;
function getLightnessRamp(minL, maxL, steps) {
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    const eased = Math.pow(t, 0.8); // ease-out
    return +(minL + eased * (maxL - minL)).toFixed(4); // clamp precision
  });
}

function Square({ bgColor }) {
  return <div className="w-6 h-6" style={{ backgroundColor: bgColor }} />;
}

export default function OklchColorTest({
  sand = hue.sand,
  water = hue.water,
  sky = hue.sky,
}) {
  let oklchValues = {
    mainColors: {
      sand: [],
      water: [],
      sky: [],
    },
    mutedColors: {
      sand: [],
      water: [],
      sky: [],
    },
    backgroundColors: {
      sand: [],
      water: [],
      sky: [],
    },
  };
  const hues = {
    sand,
    water,
    sky,
  };
  function backgrounds(hue) {
    return {
      black: `oklch(${bgLightness.black} ${bgChroma} ${hue})`,
      dark: `oklch(${bgLightness.dark} ${bgChroma} ${hue})`,
      neutral: `oklch(${bgLightness.neutral} ${bgChroma} ${hue})`,
      bright: `oklch(${bgLightness.bright} ${bgChroma} ${hue})`,
      white: `oklch(${bgLightness.white} ${bgChroma} ${hue})`,
    };
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {Object.entries(hues).map(([key, hue]) => {
        const bgColors = backgrounds(hue);
        oklchValues.backgroundColors[key] = bgColors;
        return (
          <div key={key} className="color-block flex flex-row w-full">
            {Object.entries(bgColors).map(([bgKey, bgColor]) => (
              <div
                key={bgKey}
                className=" flex flex-col items-center w-full"
                style={{ backgroundColor: bgColor }}
              >
                <div className="flex flex-row gap-8 p-8">
                  {Object.entries(hues).map(([key, hue]) => {
                    const [minL, maxL] = lightnessRanges[key];
                    const lightnessRamp = getLightnessRamp(minL, maxL, steps);
                    oklchValues.backgroundColors[key] = bgColors;
                    return (
                      <div
                        key={key}
                        className="color-block flex flex-row gap-1"
                      >
                        {chromas.map((chroma) => (
                          <div
                            className="color-row flex flex-col gap-1"
                            key={chroma}
                          >
                            {lightnessRamp.map((l, i) => (
                              <Square
                                key={`${key}-${i}-${chroma}`}
                                bgColor={`oklch(${l} ${chroma} ${hue})`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
