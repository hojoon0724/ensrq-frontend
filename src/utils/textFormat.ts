export function formatSeasonLabel(seasonId: string) {
    const seasonNumber = seasonId.replace("s", "").replace(/^0+/, "");
    return `Season ${seasonNumber}`;
  }