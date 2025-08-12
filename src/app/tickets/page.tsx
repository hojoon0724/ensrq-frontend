"use client";
import { RandomColorHeader,SectionEmpty } from "@/components/sections";
import {LiveConcertTicketsTable,
  LiveSeasonPassTicketsTable,
  StreamingConcertTicketsTable,
  StreamingSeasonPassTicketsTable,
} from "@/components/organisms";

export default function Tickets() {
  return (
    <>
      <RandomColorHeader title="Tickets" className="h-[max(30svh,400px)] flex flex-col justify-center items-center"/>
      <SectionEmpty>
        <LiveSeasonPassTicketsTable seasonId="s10" />
        <StreamingSeasonPassTicketsTable seasonId="s10" />
        <LiveConcertTicketsTable seasonId="s10" />
        <StreamingConcertTicketsTable seasonId="s10" />
      </SectionEmpty>
    </>
  );
}
