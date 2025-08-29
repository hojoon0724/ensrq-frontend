import Venues from "@/data/serve/venues.json";
import Works from "@/data/serve/works.json";
import Composers from "@/data/serve/composers.json";
import Musicians from "@/data/serve/musicians.json";
import allSeasons from '@/data/serve/seasons.json';
import { Composer, Musician, Venue, Work } from "@/types";


export function getVenueData(venueId: string): Venue | null {
  const venue = Venues.find((v) => v.venueId === venueId);
  return venue ? venue as Venue : null;
}

export function getComposerData(composerId: string): Composer | null {
  const composer = Composers.find((c) => c.composerId === composerId);
  return composer ? composer as Composer : null;
}

export function getWorkData(workId: string): Work | null {
  const work = Works.find((w) => w.workId === workId);
  return work ? work as Work : null;
}

export function getMusicianData(musicianId: string): Musician | null {
  const musician = Musicians.find((m) => m.musicianId === musicianId);
  return musician ? musician as Musician : null;
}

export function getCurrentSeason(){
  if (!allSeasons || allSeasons.length === 0) {
    throw new Error("No seasons data available");
  }

  // Sort by seasonId to ensure correct order (s01, s02, ..., s10)
  const sortedSeasons = [...allSeasons].sort((a, b) => {
    const aNum = parseInt(a.seasonId.replace("s", ""));
    const bNum = parseInt(b.seasonId.replace("s", ""));
    return aNum - bNum;
  });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JS months are 0-indexed

  // Find season based on year range (e.g., "2024-2025" means Aug 2024 to July 2025)
  const activeSeason = sortedSeasons.find((season) => {
    const [startYear, endYear] = season.year.split("-").map(Number);

    // Season typically runs from August of start year to July of end year
    if (currentYear === startYear && currentMonth >= 8) return true;
    if (currentYear === endYear && currentMonth <= 7) return true;
    if (currentYear > startYear && currentYear < endYear) return true;

    return false;
  });

  // If no active season found (e.g., during summer break), return the latest season
  return activeSeason || sortedSeasons[sortedSeasons.length - 1];
};
