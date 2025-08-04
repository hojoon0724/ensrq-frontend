export function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[^a-z0-9\s]/g, "") // Remove remaining special characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}