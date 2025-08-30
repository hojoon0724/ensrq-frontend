import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  publicDir: path.join(__dirname, "../public"),
  originalsDir: path.join(__dirname, "../src/original-jpg"),
  manifestFile: path.join(__dirname, "../src/data/graphic-assets-manifest.json"),
  baseDirs: ["photos", "graphics"],
  webpQuality: 80,
  detectFaces: true,    // set false to skip face detection
  dryRun: process.argv.includes("--dry-run") || process.argv.includes("-d"),
};
