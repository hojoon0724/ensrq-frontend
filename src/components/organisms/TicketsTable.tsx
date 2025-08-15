import { SectionEmpty } from "@/components/sections";
import { Concert, Season } from "@/types";
import { Button } from "../atoms";

import ConcertData from "@/data/serve/concerts.json";
import { removeSeasonNumberFromConcertId,extractDateFromUtc } from "@/utils";
import Link from "next/link";

export function IndividualTicket({ concert, type, colorTheme }: { concert: Concert; type: "live" | "streaming"; colorTheme: "sky" | "sand" | "water" }) {
  const ticketType = () => {
    switch (type) {
      case "live":
        return "singleLive";
      case "streaming":
        return "singleStreaming";
    }
  };

  return (
    <>
    <Link href={`/seasons/${concert.seasonId}/${removeSeasonNumberFromConcertId(concert.concertId)}`} className={`text-black `}>
      <div className={`concert-text-container flex flex-col items-end justify-center ${new Date() > new Date(concert.date) ? "opacity-30" : "opacity-100"}`}>
        <h3 className="text-2xl md:text-3xl">{concert.title}</h3>
        <p>{extractDateFromUtc(concert.date)} @ {concert.time}</p>
      </div>
      </Link>

      <a href={concert.ticketsLinks[ticketType()]?.url} target="_blank" rel="noopener noreferrer">
        <Button disabled={new Date() > new Date(concert.date)} size="lg" color={colorTheme} className={`${new Date() > new Date(concert.date) ? "saturate-0" : ""} w-full`}>
          {new Date() > new Date(concert.date) ? "Concert Ended" : `
          Buy ${ticketType() === "singleLive" ? "Live Ticket" : "Livestream Pass"}`}
        </Button>
      </a>
    </>
  );
}

export function TicketsTable({ season }: { season: Season }) {
  const { concerts, ticketsLinks } = season;

  return (
    <>
      <SectionEmpty themeColor="sky" className="min-h-[min(60svh,800px)] flex flex-col items-center justify-center">
        <a className="anchor scroll-mt-[80px]" id="live-streaming"></a>
        <div className="season-pass-live flex flex-col items-center gap-s text-center">
          <h2>Live Season Pass</h2>
          <h3>{concerts.length} Live Concerts + Archival Streaming</h3>
          <h4 className="price">${ticketsLinks?.seasonLive?.price}</h4>
          <a href={ticketsLinks?.seasonLive?.url} target="_blank" rel="noopener noreferrer">
            <Button size="lg" color="sand">Buy Season Pass</Button>
          </a>
        </div>
      </SectionEmpty>
      <SectionEmpty themeColor="sand" className="min-h-[min(60svh,800px)] flex flex-col items-center justify-center">
        <a className="anchor scroll-mt-[80px]" id="live-streaming"></a>
        <div className="season-pass-streaming flex flex-col items-center gap-s text-center">
          <h2>Live Streaming Season Pass</h2>
          <h4 className="price">${ticketsLinks?.seasonStreaming?.price}</h4>
          <a href={ticketsLinks?.seasonStreaming?.url} target="_blank" rel="noopener noreferrer">
            <Button size="lg" color="water">Buy Streaming Season Pass</Button>
          </a>
        </div>
      </SectionEmpty>
      <SectionEmpty
        themeColor="water"
        className="min-h-[min(60svh,800px)] flex flex-col items-center justify-center w-full"
      >
        <a className="anchor scroll-mt-[80px]" id="individual-tickets"></a>
        <div className="season-pass-streaming flex flex-col justify-center items-center gap-s text-center">
          <h2>Single Live Tickets</h2>
          <h4>$30</h4>
          <div className="h-[1px] border-t border-gray-900 w-full py-s"></div>
          <div className="tickets-container grid grid-cols-[auto,1fr] gap-x-double items-center gap-y-s">
            {concerts.map((concertRef) => {
              const matched = (ConcertData as Concert[]).find((c) => c.concertId === concertRef);
              if (!matched) return null;
              return <IndividualTicket key={matched.concertId} concert={matched} type="live" colorTheme="sand" />;
            })}
          </div>
        </div>
      </SectionEmpty>
      <SectionEmpty
        themeColor="sky"
        className="min-h-[min(60svh,800px)] flex flex-col items-center justify-center w-full"
      >
        <a className="anchor scroll-mt-[80px]" id="individual-tickets"></a>
        <div className="season-pass-streaming flex flex-col justify-center items-center gap-s text-center">
          <h2>Livestream Pass</h2>
          <h4>$10</h4>
          <div className="h-[1px] border-t border-gray-900 w-full py-s"></div>
          <div className="tickets-container grid grid-cols-[auto,1fr] gap-x-double items-center gap-y-s">
            {concerts.map((concertRef) => {
              const matched = (ConcertData as Concert[]).find((c) => c.concertId === concertRef);
              if (!matched) return null;
              return <IndividualTicket key={matched.concertId} concert={matched} type="streaming" colorTheme="water" />;
            })}
          </div>
        </div>
      </SectionEmpty>
    </>
  );
}
