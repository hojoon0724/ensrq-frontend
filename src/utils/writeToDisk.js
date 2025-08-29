import fs from "fs";
import path from "path";

export function writeToDisk(filePath, data) {
  const fullPath = path.resolve(filePath);
  const dir = path.dirname(fullPath);

  // Ensure the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the data to the file
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
}
