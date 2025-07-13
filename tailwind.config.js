/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        museo: ["museo", "serif"],
        "museo-slab-rounded": ["museo-slab-rounded", "serif"],
        "museo-slab": ["museo-slab", "serif"],
        "kode-mono": ["Kode Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
