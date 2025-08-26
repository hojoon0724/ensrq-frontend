import Image from "@/components/atoms/Image";
import MatchGame from "@/components/organisms/MatchGame";
import SectionEmpty from "@/components/sections/SectionEmpty";

export default function Root() {
  return (
    <SectionEmpty>
      <div className="max-w-xl">
        <Image src="/graphics/ensrq-logo-for-bright.png" alt="ensembleNewSRQ Logo" width={2500} height={1708} />
      </div>
      <div className="text-block text-center text-pretty">
        <h1>{`We're making some big updates`}</h1>
        <h3>{`We have a game for you to play while you wait`}</h3>
      </div>
      <div className="flip-game-container">
        <MatchGame />
      </div>
    </SectionEmpty>
  );
}
