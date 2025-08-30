import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Scans the /photos/portraits/ directory and adds photo arrays to composer and musician JSON files
 * based on available image variants.
 */
export async function addAvailablePhotos() {
  console.log("🖼️  Adding available photos to composers and musicians...");

  const projectRoot = path.resolve(__dirname, "../..");
  const portraitsDir = path.join(projectRoot, "public/photos/portraits");
  const composersPath = path.join(projectRoot, "src/data/serve/composers.json");
  const musiciansPath = path.join(projectRoot, "src/data/serve/musicians.json");

  try {
    // Read portrait files
    const portraitFiles = await fs.readdir(portraitsDir);
    const webpFiles = portraitFiles.filter((file) => file.endsWith(".webp"));

    // Group files by base name
    const photoGroups = groupPhotosByBaseName(webpFiles);

    // Read existing JSON files
    const composers = JSON.parse(await fs.readFile(composersPath, "utf-8"));
    const musicians = JSON.parse(await fs.readFile(musiciansPath, "utf-8"));

    // Update composers with photo arrays
    const updatedComposers = addPhotosToEntities(composers, photoGroups, "composerId");

    // Update musicians with photo arrays
    const updatedMusicians = addPhotosToEntities(musicians, photoGroups, "musicianId");

    // Write updated files
    await fs.writeFile(composersPath, JSON.stringify(updatedComposers, null, 2));
    await fs.writeFile(musiciansPath, JSON.stringify(updatedMusicians, null, 2));

    console.log(`✅ Updated ${composersPath}`);
    console.log(`✅ Updated ${musiciansPath}`);

    // Log summary
    const composersWithPhotos = updatedComposers.filter((c) => c.photos && c.photos.length > 0);
    const musiciansWithPhotos = updatedMusicians.filter((m) => m.photos && m.photos.length > 0);

    console.log(`📊 Summary:`);
    console.log(`   - ${composersWithPhotos.length} composers with photos`);
    console.log(`   - ${musiciansWithPhotos.length} musicians with photos`);
    console.log(`   - ${Object.keys(photoGroups).length} unique photo groups found`);
  } catch (error) {
    console.error("❌ Error adding available photos:", error);
    throw error;
  }
}

/**
 * Groups photo files by their base name, handling variants like -1, -2, etc.
 * @param {string[]} webpFiles - Array of .webp filenames
 * @returns {Object} - Object with base names as keys and arrays of variants as values
 */
function groupPhotosByBaseName(webpFiles) {
  const photoGroups = {};

  for (const file of webpFiles) {
    const baseName = file.replace(".webp", "");

    // Check if this is a variant (ends with -number)
    const variantMatch = baseName.match(/^(.+)-(\d+)$/);

    if (variantMatch) {
      // This is a variant like "angelica-negron-1"
      const baseId = variantMatch[1];

      if (!photoGroups[baseId]) {
        photoGroups[baseId] = [];
      }

      // Add the variant
      photoGroups[baseId].push(baseName);
    } else {
      // This is the base file like "angelica-negron"
      if (!photoGroups[baseName]) {
        photoGroups[baseName] = [];
      }

      // Add the base name (it will be sorted first later)
      photoGroups[baseName].push(baseName);
    }
  }

  // Sort each group so the base name comes first, then variants in order
  for (const baseId in photoGroups) {
    photoGroups[baseId].sort((a, b) => {
      // Base name (no variant) should come first
      const aIsBase = !a.match(/-\d+$/);
      const bIsBase = !b.match(/-\d+$/);

      if (aIsBase && !bIsBase) return -1;
      if (!aIsBase && bIsBase) return 1;

      // Both are variants, sort by number
      if (!aIsBase && !bIsBase) {
        const aNum = parseInt(a.match(/-(\d+)$/)[1]);
        const bNum = parseInt(b.match(/-(\d+)$/)[1]);
        return aNum - bNum;
      }

      // Both are base names, sort alphabetically
      return a.localeCompare(b);
    });
  }

  return photoGroups;
}

/**
 * Adds photo arrays to entities (composers or musicians) based on available photos
 * @param {Array} entities - Array of composer or musician objects
 * @param {Object} photoGroups - Grouped photos by base name
 * @param {string} idField - Field name for the ID ('composerId' or 'musicianId')
 * @returns {Array} - Updated entities array
 */
function addPhotosToEntities(entities, photoGroups, idField) {
  return entities.map((entity) => {
    const entityId = entity[idField];

    if (photoGroups[entityId] && photoGroups[entityId].length > 0) {
      // Create a copy of the entity and add photos array
      return {
        ...entity,
        photos: [...photoGroups[entityId]],
      };
    }

    // Return entity as-is if no photos found
    return entity;
  });
}
