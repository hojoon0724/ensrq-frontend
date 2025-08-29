export function formatSeasonLabel(seasonId: string) {
  const seasonNumber = seasonId.replace("s", "").replace(/^0+/, "");
  return `Season ${seasonNumber}`;
}

export function removeSeasonNumberFromConcertId(concertId: string) {
  return concertId.replace(/^s\d{2}-/, "");
}
