import { Button } from "@/components/atoms";
import Link from "next/link";

interface TicketLinkData {
  url?: string;
  price?: number;
}

interface TicketLinksProps {
  liveTickets?: TicketLinkData;
  streamingTickets?: TicketLinkData;
  liveLabel?: string;
  streamingLabel?: string;
  color: "sand" | "sky" | "water";
}

export function TicketLinks({
  liveTickets,
  streamingTickets,
  liveLabel = "Purchase Live Tickets",
  streamingLabel = "Purchase Streaming",
  color,
}: TicketLinksProps) {
  const isLiveDisabled = liveTickets?.url === undefined || liveTickets.url === "";
  const isStreamingDisabled = streamingTickets?.url === undefined || streamingTickets.url === "";

  return (
    <div className="tickets-link-container grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      <Button color={color} disabled={isLiveDisabled}>
        {isLiveDisabled ? (
          <span>
            Live Tickets Not Yet Available
          </span>
        ) : (
          <Link href={liveTickets?.url || "#"}>
            {liveLabel}
            {liveTickets?.price && liveTickets.price > 0 ? ` - $${liveTickets.price}` : null}
          </Link>
        )}
      </Button>

      <Button color={color} disabled={isStreamingDisabled}>
        {isStreamingDisabled ? (
          <span>
            Streaming Tickets Not Yet Available
          </span>
        ) : (
          <Link href={streamingTickets?.url || "#"}>
            {streamingLabel}
            {streamingTickets?.price && streamingTickets?.price > 0 ? ` - $${streamingTickets?.price}` : null}
          </Link>
        )}
      </Button>
    </div>
  );
}
