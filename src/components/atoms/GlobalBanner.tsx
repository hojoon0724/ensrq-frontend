import { extractDateFromUtc } from "@/utils";
import Link from "next/link";
interface BannerData {
  id: string;
  title: string;
  eventDate: string;
  eventTime: string;
  content: string[];
  cta: { label: string; url?: string }[];
  image: { src: string; alt: string }[];
  showOnceEveryHours: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
}

interface GlobalBannerProps {
  bannerData?: BannerData[];
}

export function GlobalBanner({ bannerData }: GlobalBannerProps) {
  const activeBanner = bannerData?.find((banner) => {
    const now = new Date();
    const startDate = new Date(banner.startDate);
    const endDate = new Date(banner.endDate);
    return now >= startDate && now <= endDate;
  });

  if (!activeBanner) return null;

  return (
    <div className="global-banner-container bg-sand-50 w-full flex justify-center items-center museo-slab text-center">
      <div key={activeBanner.id} className="global-banner-content px-4 py-1">
        {activeBanner.title} – {extractDateFromUtc(activeBanner.eventDate)} @ {activeBanner.eventTime} {" – "}
        {activeBanner.cta && activeBanner.cta.length > 0 && (
          <Link className="underline" href={activeBanner.cta[0].url || "#"}>
            {activeBanner.cta[0].label || "Get your Tickets"}
          </Link>
        )}
      </div>
    </div>
  );
}
