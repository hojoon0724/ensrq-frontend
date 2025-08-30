import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function loadModels() {
  const modelPath = path.join(__dirname, "./models");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
}

async function detectFaceFocus(imagePath) {
  try {
    const img = await canvas.loadImage(imagePath);
    const detection = await faceapi.detectSingleFace(img);
    if (!detection) return null;

    const { box } = detection;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    return {
      x: +(centerX / img.width).toFixed(4),
      y: +(centerY / img.height).toFixed(4),
    };
  } catch (error) {
    console.error(`Face detection error for ${path.basename(imagePath)}:`, error.message);
    return null;
  }
}

function getAllJpgFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(getAllJpgFiles(filePath));
    } else if (file.toLowerCase().endsWith(".jpg")) {
      results.push(filePath);
    }
  }

  return results;
}

async function main() {
  await loadModels();

  const publicDir = path.join(__dirname, "../public");
  const jpgFiles = getAllJpgFiles(publicDir);

  if (jpgFiles.length === 0) {
    console.log("No JPG files found in the public folder.");
    return;
  }

  console.log(`Found ${jpgFiles.length} JPG files in public folder and subfolders.`);

  for (const filePath of jpgFiles) {
    const relativePath = path.relative(publicDir, filePath);
    const focus = await detectFaceFocus(filePath);
    if (focus) {
      console.log(`${relativePath}: Face focus point → x=${focus.x}, y=${focus.y}`);
    } else {
      console.log(`${relativePath}: No face detected.`);
    }
  }
}

main();
