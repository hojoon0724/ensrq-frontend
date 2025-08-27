"use client";

import { Season } from "@/types";
import { formatSeasonLabel, getCurrentSeason } from "@/utils";
import BaseRandomColorHeader from "./BaseRandomColorHeader";
import { TicketLinks } from "./TicketLinks";
import { useRandomColors } from "./hooks/useRandomColors";

interface RandomColorPageHeaderProps {
  title?: string;
  subtitle?: string | React.ReactNode;
  headerSize?: "normal" | "large";
  forceTone?: "light" | "dark";
  seasonId?: string;
  seasonData?: Season;
  children?: React.ReactNode;
}

export default function RandomColorPageHeader({
  title,
  subtitle,
  headerSize = "large",
  forceTone = "dark",
  seasonId,
  seasonData,
  children,
}: RandomColorPageHeaderProps) {
  const currentSeason = getCurrentSeason();
  const colors = useRandomColors(forceTone);

  // Handle season-specific logic
  let displayTitle = title || "";
  let displaySubtitle = subtitle;
  let ticketSection = null;

  if (seasonId && seasonData) {
    displayTitle = formatSeasonLabel(seasonId);
    displaySubtitle = seasonData.year ? seasonData.year.toString() : undefined;

    const is_current_season = seasonId === currentSeason.seasonId;
    if (is_current_season && seasonData.ticketsLinks) {
      ticketSection = (
        <TicketLinks
          liveTickets={seasonData.ticketsLinks.seasonLive}
          streamingTickets={seasonData.ticketsLinks.seasonStreaming}
          liveLabel="Purchase Live Season Pass"
          streamingLabel="Purchase Streaming Season Pass"
          color={colors.randomTextColor}
        />
      );
    }
  }

  return (
    <BaseRandomColorHeader
      title={displayTitle}
      subtitle={displaySubtitle}
      headerSize={headerSize}
      forceTone={forceTone}
      showTicketSection={!!ticketSection}
      ticketSection={ticketSection}
    >
      {children}
    </BaseRandomColorHeader>
  );
}
