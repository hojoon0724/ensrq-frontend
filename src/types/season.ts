export interface Season {
  seasonId: string;
  year?: string;
  concerts: string[]; // Array of concert IDs
  ticketsLinks?: {
    seasonLive?: {
      price?: number;
      url?: string;
    };
    seasonStreaming?: {
      price?: number;
      url?: string;
    };
  };
  youTubeUrl?: string; // YouTube URL for the season
  seasonStreamingPagePassword?: string; // Password for the streaming page
  seasonStreamingPageUrl?: string; // URL for the streaming page

  createdAt?: string;
  updatedAt?: string;
}
