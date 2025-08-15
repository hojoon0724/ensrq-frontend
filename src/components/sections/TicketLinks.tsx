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
  const isLiveDisabled = liveTickets?.price !== undefined && liveTickets.price <= 0;
  const isStreamingDisabled = streamingTickets?.price !== undefined && streamingTickets.price <= 0;

  return (
    <div className="tickets-link-container grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {liveTickets?.url && (
        <Button color={color} disabled={isLiveDisabled}>
          {isLiveDisabled ? (
            <span>
              {liveLabel}
              {liveTickets.price && liveTickets.price > 0 ? ` - $${liveTickets.price}` : null}
            </span>
          ) : (
            <Link href={liveTickets.url}>
              {liveLabel}
              {liveTickets.price && liveTickets.price > 0 ? ` - $${liveTickets.price}` : null}
            </Link>
          )}
        </Button>
      )}
      {streamingTickets?.url && (
        <Button color={color} disabled={isStreamingDisabled}>
          {isStreamingDisabled ? (
            <span>
              {streamingLabel}
              {streamingTickets.price && streamingTickets.price > 0 ? ` - $${streamingTickets.price}` : null}
            </span>
          ) : (
            <Link href={streamingTickets.url}>
              {streamingLabel}
              {streamingTickets.price && streamingTickets.price > 0 ? ` - $${streamingTickets.price}` : null}
            </Link>
          )}
        </Button>
      )}
    </div>
  );
}
