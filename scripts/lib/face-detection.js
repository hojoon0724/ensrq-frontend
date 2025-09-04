import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import path from "path";
import { fileURLToPath } from "url";
import { CONFIG } from "../config.js";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadFaceApiModels() {
  const modelPath = path.join(__dirname, "models");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  // load other models here if needed
}

export async function getFaceFocusPoint(imagePath) {
  if (!CONFIG.detectFaces) return null;

  try {
    const img = await canvas.loadImage(imagePath);
    const detection = await faceapi.detectSingleFace(img);
    if (!detection) return null;

    const { box } = detection;
    return {
      x: +((box.x + box.width / 2) / img.width).toFixed(4),
      y: +((box.y + box.height / 2) / img.height).toFixed(4),
    };
  } catch (err) {
    console.warn(`Face detection failed for ${imagePath}: ${err.message}`);
    return null;
  }
}
