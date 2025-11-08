import { LogoIcon } from "@/assets/logoIcon";
import { ProgramNotes, VideoWithCustomThumbnail } from "@/components/molecules";
import { SectionEmpty } from "@/components/sections";
import s10ConcertColorThemes from "@/data/s10-concert-color-themes.json";
import { Concert } from "@/types";
import { extractDateFromUtc } from "@/utils/convertTime";

interface ConcertLivestreamProps {
  concert: Concert;
  isUpcoming: boolean;
}

const concertColorThemes: Record<string, string> = s10ConcertColorThemes;

export function ConcertLivestream({ concert, isUpcoming }: ConcertLivestreamProps) {
  const concertColorTheme = concertColorThemes[concert.concertId] || "water";

  return (
    <SectionEmpty className="min-h-screen" white={true}>
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] w-full gap-x-s items-start mb-0">
        <div className="video-container sticky top-32 bg-gray-30 z-10">
          <div className="concert-time-date-container col-span-2 w-full flex flex-col gap-2 justify-end pl-half z-20 bg-gray-30">
            <div className="title-date-container flex flex-col justify-between items-baseline gap-0">
              <h2 className="leading-none mb-1">{concert.title}</h2>
              <div className="font-mono text-xs m-0">
                {isUpcoming ? "Streaming on: " : "Originally streamed on: "}
                {extractDateFromUtc(concert.date)}
              </div>
            </div>
          </div>
          <VideoWithCustomThumbnail
            className="w-full aspect-video mt-4"
            key={concert.concertId}
            thumbnail={`/graphics/${concert.seasonId}/streaming-thumbnails/${concert.concertId}.webp`}
            icon={<LogoIcon color="var(--water-600)" />}
            youtubeUrl={concert.youTubeUrl || ""}
          />
        </div>
        <div className="program-notes-container w-full h-full">
          <ProgramNotes className="w-full h-full" concertData={concert} colorTheme={concertColorTheme} />
        </div>
      </div>
    </SectionEmpty>
  );
}
