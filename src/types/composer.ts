export interface Composer {
  composerId: string;
  name: string;
  nationality?: string;
  born?: number;
  died?: number;
  bio?: string;
  createdAt: string; // from timestamps
  updatedAt: string; // from timestamps
}
