import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env.local") });
dotenv.config({ path: path.join(__dirname, "../.env") });

// Set environment variable explicitly if loaded from dotenv
if (process.env.MONGODB_URI) {
  console.log("✓ MONGODB_URI loaded successfully");
} else {
  console.error("✗ MONGODB_URI not found in environment");
  process.exit(1);
}

// Now dynamically import and run the migration
const { default: migrate } = await import("./migrate-to-mongodb.js");
