import { Image } from "@/components/atoms/";
import { MatchGame } from "@/components/organisms/";
import { SectionEmpty } from "@/components/sections";

export default function Root() {
  return (
    <SectionEmpty className="flex flex-col bg-green-900 h-full">
      <div className="main-content w-full min-h-[300px]">
        MAIN CONTENT
      </div>
      {/* <div className="relative max-w-2xl h-[max(300px,20svh)] w-[max(300px,20svh)]">
        <Image src="/graphics/ensrq-logo-for-bright.webp" alt="alt" objectFit="contain" />
      </div>
      <div className="text-block text-center text-pretty">
        <h1>{`We're making some big updates`}</h1>
        <h3>{`Here's a game you can play while you wait`}</h3>
      </div>
      <MatchGame /> */}
    </SectionEmpty>
  );
}
