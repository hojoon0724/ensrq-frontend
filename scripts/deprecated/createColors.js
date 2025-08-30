import fs from "fs";
import path from "path";
import colorsJson from "../data/colors.js";

const hue = colorsJson.hues;
const bgLightness = colorsJson.bgLightness;
const lightnessRanges = colorsJson.lightnessRanges;
const bgChroma = colorsJson.bgChroma;
const lowChroma = colorsJson.lowChroma;
const highChroma = colorsJson.highChroma;
const steps = colorsJson.steps;

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

const colorScale = [950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50];
const backgroundColorScale = ["black", "dark", "neutral", "bright", "white"];

function getLightnessRamp(lightnessRangeArr, steps) {
  const [minL, maxL] = lightnessRangeArr;
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    // const eased = Math.pow(t, 0.6); // ease-out
    const eased = Math.pow(t, 0.8); // ease-out
    return +(minL + eased * (maxL - minL)).toFixed(4); // clamp precision
  });
}

function getChromaRamp(chroma, steps) {
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return +(chroma * t).toFixed(4); // clamp precision
  });
}

function makeColors(hue, lightnessRange, chroma, steps) {
  const lightnessRamp = getLightnessRamp(lightnessRange, steps);
  const chromaRamp = getChromaRamp(chroma, steps);
  return lightnessRamp.map((l, i) => `oklch(${l} ${chromaRamp[i]} ${hue})`);
}

function generateColors() {
  const hues = {
    sand: hue.sand,
    water: hue.water,
    sky: hue.sky,
  };

  Object.keys(hues).forEach((color) => {
    const hueValue = hues[color];
    const lightnessRange = lightnessRanges[color];

    oklchValues.mainColors[color] = makeColors(hueValue, lightnessRange, highChroma, steps);
    oklchValues.mutedColors[color] = makeColors(hueValue, lightnessRange, lowChroma, steps);

    oklchValues.backgroundColors[color] = [
      `oklch(${bgLightness.black} ${bgChroma} ${hueValue})`,
      `oklch(${bgLightness.dark} ${bgChroma} ${hueValue})`,
      `oklch(${bgLightness.neutral} ${bgChroma} ${hueValue})`,
      `oklch(${bgLightness.bright} ${bgChroma} ${hueValue})`,
      `oklch(${bgLightness.white} ${bgChroma} ${hueValue})`,
    ];
  });
}

generateColors();
// console.log("Generated Oklch Colors:", oklchValues);

function oklchToHex(oklchString) {
  // Extract values from oklch string like "oklch(0.5 0.1 180)"
  const match = oklchString.match(/oklch\(([^)]+)\)/);
  if (!match) return "#000000";

  const [l, c, h] = match[1].split(" ").map(Number);

  // Convert OKLCH to OKLab
  const hRad = ((h || 0) * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // Convert OKLab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Convert linear RGB to sRGB
  function linearToSrgb(c) {
    return c >= 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
  }

  r = linearToSrgb(r);
  g = linearToSrgb(g);
  bl = linearToSrgb(bl);

  // Clamp to 0-255
  r = Math.max(0, Math.min(255, Math.round(r * 255)));
  g = Math.max(0, Math.min(255, Math.round(g * 255)));
  bl = Math.max(0, Math.min(255, Math.round(bl * 255)));

  // Convert to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

function generateCSSVariables() {
  let cssContent = ":root {\n";

  // Main colors
  Object.keys(oklchValues.mainColors).forEach((colorName) => {
    oklchValues.mainColors[colorName].forEach((value, index) => {
      const scale = colorScale[index];
      const hexFallback = oklchToHex(value);
      cssContent += `  --${colorName}-${scale}: ${hexFallback}; /* fallback */\n`;
      cssContent += `  --${colorName}-${scale}: ${value};\n`;
    });
  });

  // Muted colors
  Object.keys(oklchValues.mutedColors).forEach((colorName) => {
    oklchValues.mutedColors[colorName].forEach((value, index) => {
      const scale = colorScale[index];
      const hexFallback = oklchToHex(value);
      cssContent += `  --${colorName}-muted-${scale}: ${hexFallback}; /* fallback */\n`;
      cssContent += `  --${colorName}-muted-${scale}: ${value};\n`;
    });
  });

  // Background colors
  Object.keys(oklchValues.backgroundColors).forEach((colorName) => {
    oklchValues.backgroundColors[colorName].forEach((value, index) => {
      const bgScale = backgroundColorScale[index];
      const hexFallback = oklchToHex(value);
      cssContent += `  --${colorName}-bg-${bgScale}: ${hexFallback}; /* fallback */\n`;
      cssContent += `  --${colorName}-bg-${bgScale}: ${value};\n`;
    });
  });

  cssContent += "}\n";

  return cssContent;
}

function writeCSSFile() {
  const cssContent = generateCSSVariables();
  const outputPath = path.join(process.cwd(), "src", "styles", "_colors.css");

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, cssContent, "utf8");
  console.log("CSS color variables written to:", outputPath);
}

writeCSSFile();
