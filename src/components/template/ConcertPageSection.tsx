"use client";

import { ShowMarkdownText } from "@/components/atoms/ShowMarkdownText";
import { ProgramTile } from "@/components/molecules";
import { SectionEmpty, TicketLinks, useRandomColors } from "@/components/sections";
import BaseRandomColorHeader from "@/components/sections/BaseRandomColorHeader";
import { Concert } from "@/types";
import { extractDateFromUtc, getCurrentSeason, getVenueData } from "@/utils";

interface ConcertPageSectionProps {
  concertData: Concert;
}

export function ConcertPageSection({ concertData }: ConcertPageSectionProps) {
  const currentSeason = getCurrentSeason();
  const colors = useRandomColors("dark");
  const is_current_season = concertData.seasonId === currentSeason.seasonId;

  const formatDateFromRaw = (rawDateString: string, timeString?: string) => {
    // rawDateString is in MM/DD/YYYY format from extractDateFromUtc
    const date = new Date(rawDateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (timeString) {
      return `${formattedDate} at ${timeString}`;
    }
    return formattedDate;
  };

  // Concert details subtitle
  const concertSubtitle = (
    <>
      <div
        className={`concert-date-time text-lg lg:text-2xl museo-slab text-center text-${colors.randomTextColor}-${colors.textShade} mt-4`}
      >
        {formatDateFromRaw(extractDateFromUtc(concertData.date), concertData.time)}
      </div>
      {concertData.venueId && (
        <div
          className={`concert-venue text-base lg:text-xl museo-slab text-center text-${colors.randomTextColor}-${colors.textShade} mt-2`}
        >
          {getVenueData(concertData.venueId)?.name}
        </div>
      )}
    </>
  );

  // Ticket section
  const ticketSection = is_current_season && concertData.ticketsLinks && (
    <TicketLinks
      liveTickets={concertData.ticketsLinks.singleLive}
      streamingTickets={concertData.ticketsLinks.singleStreaming}
      color={colors.randomTextColor}
    />
  );

  return (
    <>
      <BaseRandomColorHeader
        title={concertData.title}
        subtitle={concertSubtitle}
        forceTone="dark"
        headerSize="normal"
        showTicketSection={!!ticketSection}
        ticketSection={ticketSection}
      />

      <div className={`bg-${colors.randomColor}-${colors.textShade} h-[1px] w-full`} style={{ height: "3px" }}>
        &nbsp;
      </div>

      {concertData.subtitle && (
        <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone}>
          <div className="text-center max-w-3xl mx-auto px-4">
            <p className={`text-lg text-${colors.randomColor}-100 italic`}>{concertData.subtitle}</p>
          </div>
        </SectionEmpty>
      )}

      {concertData.description && (
        <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone}>
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className={`text-lg text-${colors.randomColor}-100`}>
              <ShowMarkdownText>{concertData.description}</ShowMarkdownText>
            </div>
          </div>
        </SectionEmpty>
      )}

      <SectionEmpty themeColor={colors.randomColor} tone={colors.randomTone} className="flex-1">
        <div className="w-full max-w-4xl mx-auto">
          <h2 className={`font-bold text-center mb-8 text-${colors.randomColor}-${colors.textShade}`}>Program</h2>
          <div>
            {concertData.program.map((programWork, index) => {
              return (
                <ProgramTile
                  key={index}
                  programWork={programWork}
                  color={colors.randomColor as "sand" | "sky" | "water"}
                  tone={colors.randomTone}
                />
              );
            })}
          </div>
        </div>
      </SectionEmpty>
    </>
  );
}
