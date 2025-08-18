"use client";

import { Season } from "@/types";
import { formatSeasonLabel } from "@/utils";
import { getCurrentSeason } from "../../utils/getData";
import BaseRandomColorHeader from "./BaseRandomColorHeader";
import { TicketLinks } from "./TicketLinks";
import { useRandomColors } from "./hooks/useRandomColors";

interface RandomColorSeasonHeaderProps {
  seasonId: string;
  seasonData: Season;
  children?: React.ReactNode;
}

const currentSeason = getCurrentSeason();

export default function RandomColorSeasonHeader({ seasonId, seasonData, children }: RandomColorSeasonHeaderProps) {
  const is_current_season = seasonId === currentSeason.seasonId;
  const colors = useRandomColors("dark");

  const ticketSection = is_current_season && seasonData?.ticketsLinks && (
    <TicketLinks
      liveTickets={seasonData.ticketsLinks.seasonLive}
      streamingTickets={seasonData.ticketsLinks.seasonStreaming}
      liveLabel="Purchase Live Season Pass"
      streamingLabel="Purchase Streaming Season Pass"
      color={colors.randomTextColor}
    />
  );

  const subtitle = seasonData?.year ? seasonData.year.toString() : undefined;

  return (
    <BaseRandomColorHeader
      title={formatSeasonLabel(seasonId)}
      subtitle={subtitle}
      forceTone="dark"
      headerSize="large"
      showTicketSection={!!seasonData?.ticketsLinks}
      ticketSection={ticketSection}
    >
      {children}
    </BaseRandomColorHeader>
  );
}
