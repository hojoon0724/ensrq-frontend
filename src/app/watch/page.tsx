import SectionBanner from "@/components/sections/SectionBanner";
import SectionEmpty from "@/components/sections/SectionEmpty";

export default function Watch() {
  return (
    <div>
      <SectionBanner themeColor="blue">
        <h1>Watch</h1>
      </SectionBanner>
      <SectionEmpty themeColor="sand">
        <div className="flex h-[50svh]">
          <h1>Watch</h1>
        </div>
      </SectionEmpty>
      <SectionEmpty themeColor="water">
        <div className="flex h-[50svh]">
          <h1>Watch</h1>
        </div>
      </SectionEmpty>
      <SectionEmpty themeColor="sand">
        <div className="flex h-[50svh]">
          <h1>Watch</h1>
        </div>
      </SectionEmpty>
    </div>
  );
}
