import { Concert } from "@/types/concert";

/**
 * Get the start of today in local timezone as a timestamp
 * This is used as the reference point for comparing concert dates
 */
export function getTodayLocal(): number {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
}

/**
 * Convert a UTC date string to a local date timestamp (ignoring time component)
 * This treats the UTC date as if it were a local date
 * @param utcDateString - ISO date string (e.g., "2024-12-25T00:00:00.000Z")
 */
export function convertUtcDateToLocal(utcDateString: string): number {
  const concertDate = new Date(utcDateString);
  return new Date(concertDate.getUTCFullYear(), concertDate.getUTCMonth(), concertDate.getUTCDate()).getTime();
}

/**
 * Check if a concert date is in the future (today or later)
 * @param concertDateString - Concert date in UTC format
 */
export function isConcertUpcoming(concertDateString: string): boolean {
  const todayLocal = getTodayLocal();
  const concertLocal = convertUtcDateToLocal(concertDateString);
  return concertLocal >= todayLocal;
}

/**
 * Check if a concert date is in the past
 * @param concertDateString - Concert date in UTC format
 */
export function isConcertPast(concertDateString: string): boolean {
  return !isConcertUpcoming(concertDateString);
}

/**
 * Filter and sort concerts into upcoming and past arrays
 * @param concerts - Array of concerts to filter
 * @returns Object with upcomingConcerts and pastConcerts arrays, both sorted by date
 */
export function filterConcertsByDate(concerts: Concert[]): {
  upcomingConcerts: Concert[];
  pastConcerts: Concert[];
} {
  const todayLocal = getTodayLocal();

  const upcoming = concerts
    .filter((concert) => {
      const concertLocal = convertUtcDateToLocal(concert.date);
      return concertLocal >= todayLocal;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = concerts
    .filter((concert) => {
      const concertLocal = convertUtcDateToLocal(concert.date);
      return concertLocal < todayLocal;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return { upcomingConcerts: upcoming, pastConcerts: past };
}

/**
 * Get the next upcoming concert from an array of concerts
 * @param concerts - Array of concerts
 * @returns The next concert or undefined if none upcoming
 */
export function getNextConcert(concerts: Concert[]): Concert | undefined {
  const { upcomingConcerts } = filterConcertsByDate(concerts);
  return upcomingConcerts[0];
}

/**
 * Get the most recent past concert from an array of concerts
 * @param concerts - Array of concerts
 * @returns The most recent past concert or undefined if none
 */
export function getMostRecentPastConcert(concerts: Concert[]): Concert | undefined {
  const { pastConcerts } = filterConcertsByDate(concerts);
  return pastConcerts[pastConcerts.length - 1];
}

export function isConcertTonight(concertDateString: string): boolean {
  const todayLocal = getTodayLocal();
  const concertLocal = convertUtcDateToLocal(concertDateString);
  return concertLocal === todayLocal;
}