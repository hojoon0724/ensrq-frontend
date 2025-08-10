import Venues from "@/data/serve/venues.json";
import Works from "@/data/serve/works.json";
import Composers from "@/data/serve/composers.json";
import Musicians from "@/data/serve/musicians.json";
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