import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Enable development mode for more aggressive JIT compilation
  mode: process.env.NODE_ENV === "production" ? "jit" : undefined,
  safelist: [
    // Always include custom spacing classes
    { pattern: /^(p|m|gap|space|top|right|bottom|left|inset)-(quarter|half|s|double|triple)$/ },
    // Include directional spacing classes (px, py, pl, pr, pt, pb, mx, my, ml, mr, mt, mb)
    { pattern: /^(p|m)(x|y|l|r|t|b)-(quarter|half|s|double|triple)$/ },
    // Include space-x and space-y classes
    { pattern: /^space-(x|y)-(quarter|half|s|double|triple)$/ },
    // Include negative spacing classes
    { pattern: /^-(p|m|gap|space|top|right|bottom|left|inset)-(quarter|half|s|double|triple)$/ },
    // Include negative directional spacing classes
    { pattern: /^-(p|m)(x|y|l|r|t|b)-(quarter|half|s|double|triple)$/ },
    // Include negative space-x and space-y classes
    { pattern: /^-space-(x|y)-(quarter|half|s|double|triple)$/ },
    // Include color classes for specific shades
    {
      pattern:
        /^(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|sand|water)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // Include transform classes (rotation, translation, scale, etc.)
    { pattern: /^-?(rotate|scale|translate-[xy]?|skew-[xy]?)-(0|1|2|3|6|12|45|90|180)$/ },
    { pattern: /^-?(translate-[xy]?)-(.+)$/ },
    // Include flex and justify classes
    { pattern: /^justify-(start|end|center|between|around|evenly)$/ },
    { pattern: /^items-(start|end|center|baseline|stretch)$/ },
    { pattern: /^flex-(row|col|wrap|nowrap)$/ },
    // Include opacity classes
    { pattern: /^opacity-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)$/ },
    // Include border-0 for ghost buttons
    "border-0",
    // Include text-white for filled buttons
    "text-white",
    "text-black",
    // Include transform classes that might not be detected in conditional statements
    "rotate-45",
    "-rotate-45",
    "translate-y-2",
    "-translate-y-2",
    "opacity-0",
    // Include common layout classes
    "justify-around",
    "justify-between",
    "justify-center",
    "justify-start",
    "justify-end",
  ],

  theme: {
    extend: {
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
        "10xl": "104rem",
      },
      screens: {
        xs: "480px",
      },
      spacing: {
        quarter: "var(--standard-space-quarter)",
        half: "var(--standard-space-half)",
        s: "var(--standard-space)",
        double: "var(--standard-space-double)",
        triple: "var(--standard-space-triple)",
      },
      colors: {
        blue: {
          950: "var(--sky-950)",
          900: "var(--sky-900)",
          800: "var(--sky-800)",
          700: "var(--sky-700)",
          600: "var(--sky-600)",
          500: "var(--sky-500)",
          400: "var(--sky-400)",
          300: "var(--sky-300)",
          200: "var(--sky-200)",
          100: "var(--sky-100)",
          50: "var(--sky-50)",
        },
        sand: {
          950: "var(--sand-950)",
          900: "var(--sand-900)",
          800: "var(--sand-800)",
          700: "var(--sand-700)",
          600: "var(--sand-600)",
          500: "var(--sand-500)",
          400: "var(--sand-400)",
          300: "var(--sand-300)",
          200: "var(--sand-200)",
          100: "var(--sand-100)",
          50: "var(--sand-50)",
        },
        water: {
          950: "var(--water-950)",
          900: "var(--water-900)",
          800: "var(--water-800)",
          700: "var(--water-700)",
          600: "var(--water-600)",
          500: "var(--water-500)",
          400: "var(--water-400)",
          300: "var(--water-300)",
          200: "var(--water-200)",
          100: "var(--water-100)",
          50: "var(--water-50)",
        },
        sky: {
          950: "var(--sky-950)",
          900: "var(--sky-900)",
          800: "var(--sky-800)",
          700: "var(--sky-700)",
          600: "var(--sky-600)",
          500: "var(--sky-500)",
          400: "var(--sky-400)",
          300: "var(--sky-300)",
          200: "var(--sky-200)",
          100: "var(--sky-100)",
          50: "var(--sky-50)",
        },
        "sand-muted": {
          950: "var(--sand-muted-950)",
          900: "var(--sand-muted-900)",
          800: "var(--sand-muted-800)",
          700: "var(--sand-muted-700)",
          600: "var(--sand-muted-600)",
          500: "var(--sand-muted-500)",
          400: "var(--sand-muted-400)",
          300: "var(--sand-muted-300)",
          200: "var(--sand-muted-200)",
          100: "var(--sand-muted-100)",
          50: "var(--sand-muted-50)",
        },
        "water-muted": {
          950: "var(--water-muted-950)",
          900: "var(--water-muted-900)",
          800: "var(--water-muted-800)",
          700: "var(--water-muted-700)",
          600: "var(--water-muted-600)",
          500: "var(--water-muted-500)",
          400: "var(--water-muted-400)",
          300: "var(--water-muted-300)",
          200: "var(--water-muted-200)",
          100: "var(--water-muted-100)",
          50: "var(--water-muted-50)",
        },
        "sky-muted": {
          950: "var(--sky-muted-950)",
          900: "var(--sky-muted-900)",
          800: "var(--sky-muted-800)",
          700: "var(--sky-muted-700)",
          600: "var(--sky-muted-600)",
          500: "var(--sky-muted-500)",
          400: "var(--sky-muted-400)",
          300: "var(--sky-muted-300)",
          200: "var(--sky-muted-200)",
          100: "var(--sky-muted-100)",
          50: "var(--sky-muted-50)",
        },
        "sand-bg": {
          black: "var(--sand-bg-black)",
          dark: "var(--sand-bg-dark)",
          neutral: "var(--sand-bg-neutral)",
          bright: "var(--sand-bg-bright)",
          white: "var(--sand-bg-white)",
        },
        "water-bg": {
          black: "var(--water-bg-black)",
          dark: "var(--water-bg-dark)",
          neutral: "var(--water-bg-neutral)",
          bright: "var(--water-bg-bright)",
          white: "var(--water-bg-white)",
        },
        "sky-bg": {
          black: "var(--sky-bg-black)",
          dark: "var(--sky-bg-dark)",
          neutral: "var(--sky-bg-neutral)",
          bright: "var(--sky-bg-bright)",
          white: "var(--sky-bg-white)",
        },
        gray: {
          970: "var(--gray-970)",
          950: "var(--gray-950)",
          900: "var(--gray-900)",
          800: "var(--gray-800)",
          700: "var(--gray-700)",
          600: "var(--gray-600)",
          500: "var(--gray-500)",
          400: "var(--gray-400)",
          300: "var(--gray-300)",
          200: "var(--gray-200)",
          100: "var(--gray-100)",
          50: "var(--gray-50)",
          30: "var(--gray-30)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
