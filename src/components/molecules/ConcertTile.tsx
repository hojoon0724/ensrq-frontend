import { Concert } from "@/types";
import { getComposerData, getVenueData, getWorkData, removeSeasonNumberFromConcertId } from "@/utils";
import Link from "next/link";

interface ConcertTileProps {
  concert: Concert;
}

export function ConcertTile({ concert }: ConcertTileProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link href={`/seasons/${concert.seasonId}/${removeSeasonNumberFromConcertId(concert.concertId)}`}>
      <div className="group relative h-full bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 hover:border-gray-300">
        {/* Concert Title */}
        <div className="mb-4 pr-16">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
            {concert.title}
          </h3>
          {concert.subtitle && <p className="text-sm text-gray-600">{concert.subtitle}</p>}
        </div>

        {/* Date and Time */}
        <div className="">
          <p className="text-sm font-semibold text-gray-800 mb-1">{formatDate(concert.date)}</p>
          {concert.time && <p className="text-sm text-gray-600">{concert.time}</p>}
        </div>

        {/* Venue */}
        {concert.venueId && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">{getVenueData(concert.venueId)?.name || concert.venueId}</p>
          </div>
        )}

        {/* Program Preview */}
        <div className="pt-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Program</p>
          <div className="space-y-3">
            {concert.program.map((item, index) => (
              <div key={index} className="work-info-container">
                <p className="work-composer font-bold text-sm text-gray-700 truncate leading-3">
                  {getWorkData(item.workId)?.composerId
                    ? getComposerData(getWorkData(item.workId)!.composerId)?.name || ""
                    : ""}
                </p>
                <p className="work-title text-sm text-gray-700 truncate">
                  {getWorkData(item.workId)?.title || item.workId}
                  {" ("}
                  {getWorkData(item.workId)?.year || ""}
                  {")"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
      </div>
    </Link>
  );
}
