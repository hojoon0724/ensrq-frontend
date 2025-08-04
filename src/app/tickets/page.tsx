"use client";
import { SectionBanner, SectionEmpty } from "@/components/sections";

export default function Tickets() {
  return (
    <div>
      <SectionBanner themeColor="blue">
        <h1>Tickets</h1>
      </SectionBanner>
      <SectionEmpty themeColor="sand">
        <div className="flex h-[10svh]">
          <h1>Tickets</h1>
        </div>
      </SectionEmpty>
      {/* <SectionEmpty themeColor="water">
        <div className="flex h-[50svh]">
          <h1>Tickets</h1>
        </div>
      </SectionEmpty>
      <SectionEmpty themeColor="sand">
        <div className="flex h-[50svh]">
          <h1>Tickets</h1>
        </div>
      </SectionEmpty> */}
    </div>
  );
}
