import fs from "fs/promises";
import path from "path";

/**
 * Cross-checks the manifest against actual files and marks missing files
 * @param {Object} manifest - The current manifest object
 * @param {string} publicDir - Path to the public directory
 * @returns {Object} - Updated manifest with missing files marked
 */
export async function checkForMissingFiles(manifest, publicDir) {
  console.log("🔍 Checking for missing files in manifest...");

  let missingCount = 0;
  let foundCount = 0;
  const updatedManifest = { ...manifest };

  for (const [filePath, fileInfo] of Object.entries(manifest)) {
    // Convert manifest path to actual file system path
    const fullPath = path.join(publicDir, filePath);

    try {
      // Check if file exists
      await fs.access(fullPath);

      // File exists - remove missing flag if it was previously set
      if (fileInfo.missing) {
        updatedManifest[filePath] = Object.fromEntries(Object.entries(fileInfo).filter(([key]) => key !== "missing"));
        console.log(`✅ File restored: ${filePath}`);
      }
      foundCount++;
    } catch {
      // File doesn't exist - mark as missing
      if (!fileInfo.missing) {
        updatedManifest[filePath] = {
          ...fileInfo,
          missing: true,
        };
        console.log(`❌ File missing: ${filePath}`);
        missingCount++;
      } else {
        // Already marked as missing
        missingCount++;
      }
    }
  }

  console.log(`📊 File check summary:`);
  console.log(`   - ${foundCount} files found`);
  console.log(`   - ${missingCount} files missing`);
  console.log(`   - ${Object.keys(manifest).length} total entries in manifest`);

  if (missingCount > 0) {
    console.log(`⚠️  ${missingCount} files are marked as missing in the manifest`);
  }

  return updatedManifest;
}

/**
 * Removes entries marked as missing from the manifest for a given duration
 * @param {Object} manifest - The current manifest object
 * @param {number} daysThreshold - Number of days to keep missing files before removing
 * @returns {Object} - Cleaned manifest with old missing entries removed
 */
export function cleanupOldMissingFiles(manifest, daysThreshold = 30) {
  console.log(`🧹 Cleaning up missing files older than ${daysThreshold} days...`);

  const now = new Date();
  const cleanedManifest = {};
  let removedCount = 0;

  for (const [filePath, fileInfo] of Object.entries(manifest)) {
    if (fileInfo.missing && fileInfo.missingDate) {
      const missingDate = new Date(fileInfo.missingDate);
      const daysDiff = (now - missingDate) / (1000 * 60 * 60 * 24);

      if (daysDiff > daysThreshold) {
        console.log(`🗑️  Removing old missing file: ${filePath} (missing for ${Math.round(daysDiff)} days)`);
        removedCount++;
        continue; // Don't add to cleaned manifest
      }
    }

    cleanedManifest[filePath] = fileInfo;
  }

  if (removedCount > 0) {
    console.log(`✅ Removed ${removedCount} old missing files from manifest`);
  } else {
    console.log(`✅ No old missing files to remove`);
  }

  return cleanedManifest;
}

/**
 * Enhanced version that also tracks when files first went missing
 * @param {Object} manifest - The current manifest object
 * @param {string} publicDir - Path to the public directory
 * @param {Object} previousManifest - Previous version of manifest for comparison
 * @returns {Object} - Updated manifest with missing files marked and dates tracked
 */
export async function checkForMissingFilesWithTracking(manifest, publicDir, previousManifest = {}) {
  console.log("🔍 Checking for missing files with date tracking...");

  let missingCount = 0;
  let foundCount = 0;
  let newlyMissingCount = 0;
  const updatedManifest = { ...manifest };
  const now = new Date().toISOString();

  for (const [filePath, fileInfo] of Object.entries(manifest)) {
    // Convert manifest path to actual file system path
    const fullPath = path.join(publicDir, filePath);

    try {
      // Check if file exists
      await fs.access(fullPath);

      // File exists - remove missing flags if they were previously set
      if (fileInfo.missing) {
        updatedManifest[filePath] = Object.fromEntries(
          Object.entries(fileInfo).filter(([key]) => key !== "missing" && key !== "missingDate")
        );
        console.log(`✅ File restored: ${filePath}`);
      }
      foundCount++;
    } catch {
      // File doesn't exist - mark as missing with date tracking
      const previousInfo = previousManifest[filePath];

      if (!fileInfo.missing) {
        // Newly missing file
        updatedManifest[filePath] = {
          ...fileInfo,
          missing: true,
          missingDate: now,
        };
        console.log(`❌ File newly missing: ${filePath}`);
        newlyMissingCount++;
        missingCount++;
      } else if (previousInfo && previousInfo.missingDate) {
        // Keep existing missing date
        updatedManifest[filePath] = {
          ...fileInfo,
          missing: true,
          missingDate: previousInfo.missingDate,
        };
        missingCount++;
      } else {
        // Missing but no previous date info
        updatedManifest[filePath] = {
          ...fileInfo,
          missing: true,
          missingDate: now,
        };
        missingCount++;
      }
    }
  }

  console.log(`📊 File check summary:`);
  console.log(`   - ${foundCount} files found`);
  console.log(`   - ${missingCount} files missing (${newlyMissingCount} newly missing)`);
  console.log(`   - ${Object.keys(manifest).length} total entries in manifest`);

  return updatedManifest;
}
