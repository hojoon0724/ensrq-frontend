export interface Performer {
  _id: string;
  instrument: string;
}

export interface Musician {
  musicianId: string;
  name: string;
  instrument: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}
