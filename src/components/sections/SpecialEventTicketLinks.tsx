import { Button } from "@/components/atoms";
import Link from "next/link";

interface SpecialEventTicketLinkData {
  label: string;
  url?: string;
  price?: number;
}

interface SpecialEventTicketLinksProps {
  tickets?: SpecialEventTicketLinkData[];
  color: "sand" | "sky" | "water";
}

export function SpecialEventTicketLinks({ tickets, color }: SpecialEventTicketLinksProps) {
  const ticketOptions = tickets || [];

  return (
    <div
      className={`tickets-link-container grid grid-cols-1 ${(ticketOptions.length > 1 && ticketOptions[1].label === "hidden") || "" ? "" : "sm:grid-cols-2"}  gap-4 p-4`}
    >
      {ticketOptions.map((ticket, index) => {
        const hidden = ticket.label.toLowerCase() === "hidden";
        if (hidden) {
          return null;
        }
        const isDisabled = ticket.url === undefined || ticket.url === "";
        return (
          <Button key={index} color={color} disabled={isDisabled}>
            {isDisabled ? (
              <span>{ticket.label} Not Yet Available</span>
            ) : (
              <Link href={ticket.url || "#"}>
                Purchase {ticket.label}
                {ticket.price && ticket.price > 0 ? ` - $${ticket.price}` : null}
              </Link>
            )}
          </Button>
        );
      })}
    </div>
  );
}
