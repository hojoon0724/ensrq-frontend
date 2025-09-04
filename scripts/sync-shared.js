#!/usr/bin/env node
// scripts/sync-shared.js
// Copies shared lib, models, and types into /src/

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function syncShared() {
  const sharedPath = path.resolve(__dirname, "../../shared");
  const srcPath = path.resolve(__dirname, "../src");

  try {
    const entries = await fs.readdir(sharedPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === ".DS_Store") continue; // skip macOS junk

      if (entry.isDirectory()) {
        const srcFolder = path.join(sharedPath, entry.name);
        const destFolder = path.join(srcPath, entry.name);
        console.log(`📦 Copying ${entry.name} → /src/${entry.name}`);
        await copyDir(srcFolder, destFolder);
      }
    }

    console.log("✅ Shared code synced successfully!");
  } catch (err) {
    console.error("⚠️ Error syncing shared folder:", err);
    process.exit(1);
  }
}

syncShared();
