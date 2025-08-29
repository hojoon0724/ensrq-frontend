export interface Venue {
  venueId: string;
  name: string;

  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  createdAt?: string;
  updatedAt?: string;
}
