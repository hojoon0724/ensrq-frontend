import Image from "@/components/atoms/Image";
import MatchGame from "@/components/organisms/MatchGame";
import SectionEmpty from "@/components/sections/SectionEmpty";

export default function Root() {
  return (
    <SectionEmpty>
      <div className="max-w-2xl">
        <Image src="/graphics/ensrq-logo-for-bright.png" alt="alt" width={2500} height={1708} />
      </div>
      <div className="text-block text-center text-pretty">
        <h1>{`We're making some big updates`}</h1>
        <h3>{`here's a game you can play while you wait:`}</h3>
      </div>
      <div className="flip-game-container">
        <MatchGame/>
     </div>
    </SectionEmpty>
  );
}
