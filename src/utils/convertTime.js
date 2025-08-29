export function extractDateFromUtc(datetime) {
  const dateString = String(datetime.split("T")[0]);
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
}

// Helper function to convert date to YYYY-MM-DD format for date input
export function formatDateForInput(dateString) {
  if (!dateString) return "";

  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // If it's an ISO string (with time), extract just the date part
  if (dateString.includes("T")) {
    return dateString.split("T")[0];
  }

  // Handle other date formats if needed
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      // Use getFullYear, getMonth, getDate to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  } catch {
    console.warn("Could not parse date:", dateString);
  }

  return "";
}
