import { Image } from "@/components/atoms/";
import { MatchGame } from "@/components/organisms/";
import { SectionEmpty } from "@/components/sections";

export default function Root() {
  return (
    <SectionEmpty>
      <div className="max-w-2xl">
        <Image src="/graphics/ensrq-logo-for-bright.webp" alt="alt" width={2500} height={1708} />
      </div>
      <div className="text-block text-center text-pretty">
        <h1>{`We're making some big updates`}</h1>
        <h3>{`Here's a game you can play while you wait`}</h3>
      </div>
      <MatchGame />
    </SectionEmpty>
  );
}
