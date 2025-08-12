import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import liveData from "@/data/live-data.json";
import concerts from "@/data/serve/concerts.json";
import type { Season } from "@/types/season";
import { extractDateFromUtc } from "@/utils/convertTime";
import { useMemo } from "react";

interface ConcertData {
  concertId: string;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  time?: string;
  seasonId?: string;
  venueId?: string;
  ticketsLinks: {
    singleLive?: {
      price: number;
      url: string;
    };
    singleStreaming?: {
      price: number;
      url: string;
    };
  };
  sponsors?: string;
  program?: { workId: string; musicians: string[] }[];
  status?: string;
}

interface TicketTableRowProps {
  concert: ConcertData;
  isPast: boolean;
  showTicketType: "live" | "streaming";
}

function TicketTableRow({ concert, isPast, showTicketType }: TicketTableRowProps) {
  const ticketOption =
    showTicketType === "live" ? concert.ticketsLinks.singleLive : concert.ticketsLinks.singleStreaming;

  const hasTicketLink = ticketOption?.url && ticketOption.url.trim() !== "";
  const ticketPrice = ticketOption?.price ?? 0;

  return (
    <>
      {/* Desktop table row */}
      <tr className={`hidden md:table-row border-b border-gray-200 ${isPast ? "opacity-60" : ""}`}>
        <td className="py-4 px-3 md:px-6">
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900">{concert.title}</h3>
            {concert.subtitle && <p className="text-sm text-gray-600 mt-1">{concert.subtitle}</p>}
          </div>
        </td>
        <td className="py-4 px-3 md:px-6 text-gray-700">{extractDateFromUtc(concert.date)}</td>
        <td className="py-4 px-3 md:px-6">
          {isPast ? (
            <Badge variant="default">Event Passed</Badge>
          ) : hasTicketLink ? (
            <Button variant="filled" color="sky" size="sm" onClick={() => window.open(ticketOption.url, "_blank")}>
              {ticketPrice > 0 ? `Buy Tickets - $${ticketPrice}` : "Get Free Tickets"}
            </Button>
          ) : (
            <Badge variant="default">Coming Soon</Badge>
          )}
        </td>
      </tr>

      {/* Mobile card layout */}
      <tr className={`md:hidden ${isPast ? "opacity-60" : ""}`}>
        <td colSpan={3} className="p-0">
          <div className="bg-white border-b border-gray-200 p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-base">{concert.title}</h3>
              {concert.subtitle && <p className="text-sm text-gray-600 mt-1">{concert.subtitle}</p>}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">{extractDateFromUtc(concert.date)}</span>
            </div>

            <div className="flex justify-end">
              {isPast ? (
                <Badge variant="default">Event Passed</Badge>
              ) : hasTicketLink ? (
                <Button
                  variant="filled"
                  color="sky"
                  size="sm"
                  className="text-xs px-3 py-2"
                  onClick={() => window.open(ticketOption.url, "_blank")}
                >
                  {ticketPrice > 0 ? `$${ticketPrice}` : "Free"}
                </Button>
              ) : (
                <Badge variant="default">Coming Soon</Badge>
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

interface SeasonPassRowProps {
  season: Season;
  showTicketType: "live" | "streaming";
}

function SeasonPassRow({ season, showTicketType }: SeasonPassRowProps) {
  const ticketOption =
    showTicketType === "live" ? season.ticketsLinks?.seasonLive : season.ticketsLinks?.seasonStreaming;

  const hasTicketLink = ticketOption?.url && ticketOption.url.trim() !== "";
  const ticketPrice = ticketOption?.price ?? 0;

  // Get concerts for this season
  const seasonConcerts = concerts.filter((c) => season.concerts.includes(c.concertId));

  const upcomingConcerts = seasonConcerts.filter((c) => new Date(c.date) > new Date()).length;

  return (
    <>
      {/* Desktop table row */}
      <tr className="hidden md:table-row border-b border-gray-200">
        <td className="py-4 px-3 md:px-6">
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900">Season Pass</h3>
            <p className="text-sm text-gray-600 mt-1">
              {season.year} • {seasonConcerts.length} concerts
            </p>
            {upcomingConcerts > 0 && <p className="text-xs text-sky-600 mt-1">{upcomingConcerts} upcoming events</p>}
          </div>
        </td>
        <td className="py-4 px-3 md:px-6 text-gray-700">All Season Events</td>
        <td className="py-4 px-3 md:px-6">
          {upcomingConcerts === 0 ? (
            <Badge variant="default">Season Ended</Badge>
          ) : hasTicketLink ? (
            <Button variant="filled" color="water" size="sm" onClick={() => window.open(ticketOption.url, "_blank")}>
              {ticketPrice > 0 ? `Buy Season Pass - $${ticketPrice}` : "Get Season Pass"}
            </Button>
          ) : (
            <Badge variant="default">Coming Soon</Badge>
          )}
        </td>
      </tr>

      {/* Mobile card layout */}
      <tr className="md:hidden">
        <td colSpan={3} className="p-0">
          <div className="bg-white border-b border-gray-200 p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Season Pass</h3>
              <p className="text-sm text-gray-600 mt-1">
                {season.year} • {seasonConcerts.length} concerts
              </p>
              {upcomingConcerts > 0 && <p className="text-xs text-sky-600 mt-1">{upcomingConcerts} upcoming events</p>}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">All Season Events</span>
            </div>

            <div className="flex justify-end">
              {upcomingConcerts === 0 ? (
                <Badge variant="default">Season Ended</Badge>
              ) : hasTicketLink ? (
                <Button
                  variant="filled"
                  color="water"
                  size="sm"
                  className="text-xs px-3 py-2"
                  onClick={() => window.open(ticketOption.url, "_blank")}
                >
                  {ticketPrice > 0 ? `Season $${ticketPrice}` : "Free Season"}
                </Button>
              ) : (
                <Badge variant="default">Coming Soon</Badge>
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

export function LiveSeasonPassTicketsTable({ seasonId }: { seasonId?: string }) {
  const sortedSeasons = useMemo(() => {
    const seasonsToShow = seasonId ? liveData.filter((season) => season.seasonId === seasonId) : liveData;

    const seasonsWithConcerts = seasonsToShow.map((season) => {
      const seasonConcerts = concerts.filter((c) => season.concerts.includes(c.concertId));
      const upcomingConcerts = seasonConcerts.filter((c) => new Date(c.date) > new Date()).length;

      return { ...season, upcomingConcerts };
    });

    // Sort: seasons with upcoming concerts first, then by season ID descending
    return seasonsWithConcerts.sort((a, b) => {
      if (a.upcomingConcerts > 0 && b.upcomingConcerts === 0) return -1;
      if (a.upcomingConcerts === 0 && b.upcomingConcerts > 0) return 1;
      return b.seasonId.localeCompare(a.seasonId);
    });
  }, [seasonId]);

  return (
    <div className="live-season-pass-tickets-section w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Live Season Passes</h2>
          <p className="text-sm text-gray-600 mt-1">Get access to all concerts in a season</p>
        </div>

        <div className="md:overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Season</th>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Period</th>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Purchase</th>
              </tr>
            </thead>
            <tbody>
              {sortedSeasons.map((season) => (
                <SeasonPassRow key={season.seasonId} season={season} showTicketType="live" />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StreamingSeasonPassTicketsTable({ seasonId }: { seasonId?: string }) {
  const sortedSeasons = useMemo(() => {
    const seasonsToShow = seasonId ? liveData.filter((season) => season.seasonId === seasonId) : liveData;

    const seasonsWithConcerts = seasonsToShow.map((season) => {
      const seasonConcerts = concerts.filter((c) => season.concerts.includes(c.concertId));
      const upcomingConcerts = seasonConcerts.filter((c) => new Date(c.date) > new Date()).length;

      return { ...season, upcomingConcerts };
    });

    // Sort: seasons with upcoming concerts first, then by season ID descending
    return seasonsWithConcerts.sort((a, b) => {
      if (a.upcomingConcerts > 0 && b.upcomingConcerts === 0) return -1;
      if (a.upcomingConcerts === 0 && b.upcomingConcerts > 0) return 1;
      return b.seasonId.localeCompare(a.seasonId);
    });
  }, [seasonId]);

  return (
    <div className="streaming-season-pass-tickets-section w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Streaming Season Passes</h2>
          <p className="text-sm text-gray-600 mt-1">Watch all concerts from home with streaming access</p>
        </div>

        <div className="md:overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Season</th>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Period</th>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Purchase</th>
              </tr>
            </thead>
            <tbody>
              {sortedSeasons.map((season) => (
                <SeasonPassRow key={season.seasonId} season={season} showTicketType="streaming" />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function LiveConcertTicketsTable({ seasonId }: { seasonId: string }) {
  const season = liveData.find((s) => s.seasonId === seasonId);

  const sortedConcerts = useMemo(() => {
    if (!season) return [];

    const seasonConcerts = concerts.filter((c) => season.concerts.includes(c.concertId));

    const now = new Date();
    const upcoming = seasonConcerts.filter((c) => new Date(c.date) >= now);
    const past = seasonConcerts.filter((c) => new Date(c.date) < now);

    // Sort upcoming by date ascending (soonest first)
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Sort past by date descending (most recent first)
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Return upcoming first, then past
    return [...upcoming, ...past];
  }, [season]);

  if (!season) {
    return (
      <div className="live-concert-tickets-section w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <p className="text-gray-500 text-center">Season not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-concert-tickets-section w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Live Concert Tickets - Season {seasonId.toUpperCase()}
          </h2>
          <p className="text-sm text-gray-600 mt-1">Individual concert tickets for live attendance • {season.year}</p>
        </div>

        <div className="md:overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Concert</th>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Date</th>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Purchase</th>
              </tr>
            </thead>
            <tbody>
              {sortedConcerts.map((concert) => {
                const isPast = new Date(concert.date) < new Date();
                return (
                  <TicketTableRow key={concert.concertId} concert={concert} isPast={isPast} showTicketType="live" />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StreamingConcertTicketsTable({ seasonId }: { seasonId: string }) {
  const season = liveData.find((s) => s.seasonId === seasonId);

  const sortedConcerts = useMemo(() => {
    if (!season) return [];

    const seasonConcerts = concerts.filter((c) => season.concerts.includes(c.concertId));

    const now = new Date();
    const upcoming = seasonConcerts.filter((c) => new Date(c.date) >= now);
    const past = seasonConcerts.filter((c) => new Date(c.date) < now);

    // Sort upcoming by date ascending (soonest first)
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Sort past by date descending (most recent first)
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Return upcoming first, then past
    return [...upcoming, ...past];
  }, [season]);

  if (!season) {
    return (
      <div className="streaming-concert-tickets-section w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <p className="text-gray-500 text-center">Season not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="streaming-concert-tickets-section w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Streaming Concert Tickets - Season {seasonId.toUpperCase()}
          </h2>
          <p className="text-sm text-gray-600 mt-1">Individual concert tickets for streaming • {season.year}</p>
        </div>

        <div className="md:overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Concert</th>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Date</th>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Purchase</th>
              </tr>
            </thead>
            <tbody>
              {sortedConcerts.map((concert) => {
                const isPast = new Date(concert.date) < new Date();
                return (
                  <TicketTableRow
                    key={concert.concertId}
                    concert={concert}
                    isPast={isPast}
                    showTicketType="streaming"
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Additional components for displaying all concerts in a season with sorting logic
interface SeasonConcertsTableProps {
  seasonId: string;
  ticketType: "live" | "streaming";
}

export function SeasonConcertsTable({ seasonId, ticketType }: SeasonConcertsTableProps) {
  const season = liveData.find((s) => s.seasonId === seasonId);

  const sortedConcerts = useMemo(() => {
    if (!season) return [];

    const seasonConcerts = concerts.filter((c) => season.concerts.includes(c.concertId));

    const now = new Date();
    const upcoming = seasonConcerts.filter((c) => new Date(c.date) >= now);
    const past = seasonConcerts.filter((c) => new Date(c.date) < now);

    // Sort upcoming by date ascending (soonest first)
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Sort past by date descending (most recent first)
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Return upcoming first, then past
    return [...upcoming, ...past];
  }, [season]);

  if (!season) {
    return (
      <div className="season-concerts-table">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <p className="text-gray-500 text-center">Season not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="season-concerts-table">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Season {seasonId.toUpperCase()} - {ticketType === "live" ? "Live" : "Streaming"} Tickets
          </h2>
          <p className="text-sm text-gray-600 mt-1">{season.year} • Individual concert tickets</p>
        </div>

        <div className="md:overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Concert</th>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Date</th>
                <th className="text-left py-3 px-3 md:px-6 font-medium text-gray-700 text-sm">Purchase</th>
              </tr>
            </thead>
            <tbody>
              {sortedConcerts.map((concert) => {
                const isPast = new Date(concert.date) < new Date();
                return (
                  <TicketTableRow
                    key={concert.concertId}
                    concert={concert}
                    isPast={isPast}
                    showTicketType={ticketType}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Specialized components for showing only live or streaming concerts from a specific season
export function LiveSeasonConcertsTable({ seasonId }: { seasonId: string }) {
  return <SeasonConcertsTable seasonId={seasonId} ticketType="live" />;
}

export function StreamingSeasonConcertsTable({ seasonId }: { seasonId: string }) {
  return <SeasonConcertsTable seasonId={seasonId} ticketType="streaming" />;
}
