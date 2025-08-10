import { Button, MovingGradientText } from "@/components/atoms";
import { ProgramTile } from "@/components/molecules";
import { SectionEmpty } from "@/components/sections";
import { SectionMeshGradient } from "@/components/sections/SectionMeshGradient";
import { getVenueData } from "@/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

// Static imports for repo JSON (faster, smaller runtime code)
import liveData from "@/data/live-data.json";
import allConcerts from "@/data/serve/concerts.json";

export function generateStaticParams() {
  return liveData.flatMap((season) =>
    season.concerts.map((concertId) => ({
      seasonId: season.seasonId,
      concertId: concertId.replace(/^s\d{2}-/, ""),
    }))
  );
}

export default async function SingleConcertPage({
  params,
}: {
  params: Promise<{ seasonId: string; concertId: string }>;
}) {
  const { seasonId, concertId } = await params;

  // Reconstruct the full concert ID
  const fullConcertId = `${seasonId}-${concertId}`;

  // Precompute valid IDs
  const validSeasonIds = new Set(liveData.map((season) => season.seasonId));
  const validConcertIds = new Set(liveData.flatMap((season) => season.concerts));

  // Validate season and concert
  if (!validSeasonIds.has(seasonId)) {
    notFound();
  }

  // Find the concert data
  const concertData = allConcerts.find((c) => c.concertId === fullConcertId);

  if (!concertData || !validConcertIds.has(fullConcertId)) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-4">Concert Not Found</h1>
        <p className="mb-4">
          The concert &ldquo;{concertId}&rdquo; could not be found in season {seasonId}.
        </p>
        <Link href={`/seasons/${seasonId}`} className="text-blue-600 hover:underline">
          Return to Season {seasonId.replace("s", "").replace(/^0+/, "")}
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    const formattedDate = formatDate(dateString);
    if (timeString) {
      return `${formattedDate} at ${timeString}`;
    }
    return formattedDate;
  };

  const colors = ["sand", "sky", "water"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomTextColor = colors[Math.floor(Math.random() * colors.length)];

  // Easy to change: just modify this line to "light" or "dark" as needed
  const randomTone = "dark" as "light" | "dark"; // or "light" - change this to switch tones
  const textTone = randomTone === "light" ? "dark" : "light";
  const textShade = randomTone === "light" ? 700 : 200;

  return (
    <div>
      <SectionMeshGradient
        color1={randomColor}
        backgroundColor={randomColor}
        className="h-[max(30svh,400px)] flex flex-col justify-center items-center"
        tone={randomTone}
      >
        <MovingGradientText
          text={concertData.title}
          className="text-4xl lg:text-6xl font-bold text-center px-4"
          gradientColor={`${randomTextColor}`}
          tone={textTone}
        >
          <div
            className={`concert-date-time text-lg lg:text-2xl museo-slab text-center text-${randomTextColor}-${textShade} mt-4`}
          >
            {formatDateTime(concertData.date, concertData.time)}
          </div>
          {concertData.venueId && (
            <div
              className={`concert-venue text-base lg:text-xl museo-slab text-center text-${randomTextColor}-${textShade} mt-2`}
            >
              {getVenueData(concertData.venueId)?.name}
            </div>
          )}
        </MovingGradientText>
      </SectionMeshGradient>

      <SectionEmpty themeColor={`${randomColor}`} tone={`${randomTone}`}>
        <div className="tickets-link-container grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {concertData.ticketsLinks?.singleLive?.url && (
            <Button color={`${randomTextColor}`}>
              <Link href={concertData.ticketsLinks.singleLive.url}>
                Purchase Live Tickets
                {concertData.ticketsLinks.singleLive.price > 0 && ` - $${concertData.ticketsLinks.singleLive.price}`}
              </Link>
            </Button>
          )}
          {concertData.ticketsLinks?.singleStreaming?.url && (
            <Button color={`${randomTextColor}`}>
              <Link href={concertData.ticketsLinks.singleStreaming.url}>
                Purchase Streaming
                {concertData.ticketsLinks.singleStreaming.price > 0 &&
                  ` - $${concertData.ticketsLinks.singleStreaming.price}`}
              </Link>
            </Button>
          )}
        </div>
      </SectionEmpty>
      <div className={`bg-${randomColor}-${textShade} h-[1px] w-full`} style={{height: "3px"}} >&nbsp;</div>

      {concertData.subtitle && (
        <SectionEmpty themeColor={`${randomColor}`} tone={`${randomTone}`}>
          <div className="text-center max-w-3xl mx-auto px-4">
            <p className="text-lg text-gray-600 italic">{concertData.subtitle}</p>
          </div>
        </SectionEmpty>
      )}

      {concertData.description && (
        <SectionEmpty themeColor={`${randomColor}`} tone={`${randomTone}`}>
          <div className="text-center max-w-4xl mx-auto px-4">
            <p className="text-gray-700">{concertData.description}</p>
          </div>
        </SectionEmpty>
      )}

      <SectionEmpty themeColor={`${randomColor}`} tone={`${randomTone}`} className="flex-1">
        <div className="max-w-4xl mx-auto">
          <h2 className={`font-bold text-center mb-8 text-${randomColor}-${textShade}`}>Program</h2>
          <div className="space-y-s">
            {concertData.program.map((programWork, index) => {
              return (
                <ProgramTile
                  key={index}
                  programWork={programWork}
                  color={randomColor as "sand" | "sky" | "water"}
                  tone={randomTone}
                />
              );
            })}
          </div>
        </div>
      </SectionEmpty>
    </div>
  );
}
