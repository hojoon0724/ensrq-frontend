export interface TicketOption {
  price: number;
  url: string;
}

export interface ProgramWork {
  workId: string;
  is_premiere?: boolean;
  premiere_text?: string;
  is_commission?: boolean;
  commission_text?: string;
  musicians: string[]; // Array of musician IDs
}

export interface Concert {
  _id?: string;
  seasonId?: string;
  concertId: string;

  title: string;
  subtitle?: string;
  description?: string;
  shortDescription?: string;
  oneLiner?: string;
  date: string; // ISO string
  time?: string;
  venueId?: string;

  ticketsLinks: {
    singleLive?: TicketOption;
    singleStreaming?: TicketOption;
  };
  youTubeUrl?: string;
  streamingPageUrl?: string;
  streamingPagePassword?: string;
  sponsors: string;

  program: ProgramWork[];
  status: string;

  createdAt?: string;
  updatedAt?: string;
}
