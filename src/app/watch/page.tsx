import SectionBanner from "@/components/sections/SectionBanner";
import SectionEmpty from "@/components/sections/SectionEmpty";

export default function Watch(){
  return (
    <div>
      <SectionBanner color="blue">
        <h1>Watch</h1>
      </SectionBanner>
      <SectionEmpty color="sand">
        <div className="flex h-[50svh]">
          <h1>Watch</h1>
        </div>
      </SectionEmpty>
      <SectionEmpty color="water">
        <div className="flex h-[50svh]">
          <h1>Watch</h1>
        </div>
      </SectionEmpty>
      <SectionEmpty color="sand">
        <div className="flex h-[50svh]">
          <h1>Watch</h1>
        </div>
      </SectionEmpty>
    </div>
  );
}