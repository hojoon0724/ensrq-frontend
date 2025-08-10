import { Button, MovingGradientText } from "@/components/atoms";
import { SectionEmpty } from "@/components/sections";
import { SectionMeshGradient } from "@/components/sections/SectionMeshGradient";
import { formatSeasonLabel } from "@/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

// Static imports for repo JSON (faster, smaller runtime code)
import { ConcertTile } from "@/components/molecules";
import liveData from "@/data/live-data.json";
import allConcerts from "@/data/serve/concerts.json";
import { Concert } from "@/types";

export function generateStaticParams() {
  return liveData.map((season) => ({ seasonId: season.seasonId }));
}
export default async function SingleSeasonPage({ params }: { params: Promise<{ seasonId: string }> }) {
  const { seasonId } = await params;

  // Precompute valid IDs
  const validSeasonIds = new Set(liveData.map((season) => season.seasonId));
  const validConcertIds = new Set(liveData.flatMap((season) => season.concerts));

  // Validate season
  if (!validSeasonIds.has(seasonId)) {
    notFound();
  }

  // Load season data
  let seasonData = null;
  try {
    seasonData = (await import(`@/data/split/seasons/${seasonId}.json`)).default;
  } catch (error) {
    console.error(`Season data not found for ${seasonId}:`, error);
  }

  if (!seasonData) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-4">Season Not Found</h1>
        <p className="mb-4">The season &ldquo;{seasonId}&rdquo; could not be found.</p>
      </div>
    );
  }

  // Filter concert data from preloaded allConcerts
  const concertData = seasonData.concerts
    ?.filter((id: string) => validConcertIds.has(id))
    ?.map((id: string) => allConcerts.find((c) => c.concertId === id))
    ?.filter(Boolean);

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
          text={formatSeasonLabel(seasonId)}
          className="text-6xl lg:text-8xl font-bold"
          gradientColor={`${randomTextColor}`}
          tone={textTone}
        >
          <div className={`season-year text-2xl museo-slab text-${randomTextColor}-${textShade}`}>
            {seasonData?.year}
          </div>
        </MovingGradientText>
      </SectionMeshGradient>

      <SectionEmpty themeColor={`${randomColor}`} tone={`${randomTone}`}>
        <div className="tickets-link-container grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          <Button color={`${randomTextColor}`}>
            <Link href={seasonData?.ticketsLinks?.seasonLive.url}>Purchase Live Season Pass</Link>
          </Button>
          <Button color={`${randomTextColor}`}>
            <Link href={seasonData?.ticketsLinks?.seasonStreaming.url}>Purchase Streaming Season Pass</Link>
          </Button>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor={`${randomColor}`} tone={`${randomTone}`}>
        {concertData?.map((concert: Concert) => (
          <div key={concert.concertId} className="w-full">
            <ConcertTile concert={concert} />
          </div>
        ))}
      </SectionEmpty>
      {/* <SectionEmpty>
        
        <pre>{JSON.stringify(seasonData, null, 2)}</pre>
        {concertData?.map((concert: Concert) => (
          <div key={concert!.concertId} className="p-4 border rounded">
            <h2 className="text-xl font-bold">{concert!.title}</h2>
            <pre className="bg-gray-100 p-2 rounded mt-2">{JSON.stringify(concert, null, 2)}</pre>
          </div>
        ))}
      </SectionEmpty> */}
    </div>
  );
}
