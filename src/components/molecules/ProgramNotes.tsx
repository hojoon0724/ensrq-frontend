"use client";

import { StandardAccordion } from "@/components/molecules";
import allComposers from "@/data/serve/composers.json";
import allWorks from "@/data/serve/works.json";
import { useState } from "react";
import Markdown from "react-markdown";
import { Image } from "../atoms/Image";

interface ProgramNotesProps {
  concertData: {
    program: Array<{
      workId: string;
    }>;
  };
  className: string;
  oneAccordionAtATime?: boolean;
  colorTheme: string;
}

export function ProgramNotes({ concertData, className, oneAccordionAtATime = true, colorTheme }: ProgramNotesProps) {
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);

  const handleAccordionToggle = (index: number) => {
    if (oneAccordionAtATime) {
      // If clicking the same accordion, close it; otherwise open the new one
      setOpenAccordionIndex(openAccordionIndex === index ? null : index);
    }
  };

  return (
    <div className={`program-notes-container ${className} relative z-0`}>
      <h4 className={`font-bold my-4`} style={{ color: `var(--${colorTheme}-500)` }}>
        Program Notes
      </h4>

      {concertData.program.map((work, index) => {
        const workData = allWorks.find((w) => w.workId === work.workId);
        if (!workData) return null;
        return (
          <StandardAccordion
            key={index}
            isOpen={openAccordionIndex === index}
            showIcon={false}
            showBorder={false}
            onToggleAction={() => handleAccordionToggle(index)}
            accordionTitle={`${allComposers.find((c) => c.composerId === workData.composerId)?.name || workData.composerId} - ${workData.title}`}
            header={
              <div
                className={`group work-header-container flex items-center justify-start px-2 py-2 w-full m-0`}
                style={
                  index === openAccordionIndex
                    ? { backgroundColor: `color-mix(in srgb, var(--${colorTheme}-50) 40%, transparent)` }
                    : undefined
                }
              >
                <div className="composer-photo-container relative w-24 h-24 mr-4 flex-shrink-0">
                  <Image
                    src={`/photos/portraits/${workData.composerId}.webp`}
                    alt={allComposers.find((c) => c.composerId === workData.composerId)?.name || workData.composerId}
                    className={`w-24 h-24 rounded-full object-cover transition-all duration-200 ${index === openAccordionIndex ? "saturation-100 opacity-100" : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"}`}
                  />
                </div>
                <div className="flex flex-col items-baseline">
                  <div className="work-name text-lg museo font-semibold">{workData.title}</div>
                  <div className="composer-name text-sm museo-slab font-light">
                    {allComposers.find((c) => c.composerId === workData.composerId)?.name || workData.composerId}
                  </div>
                </div>
              </div>
            }
          >
            {workData.description && (
              <div
                className={`program-note w-[min(100%, 72ch)] mb-8 ${index === openAccordionIndex ? "p-s" : "p-s"}`}
                style={
                  index === openAccordionIndex
                    ? { backgroundColor: `color-mix(in srgb, var(--${colorTheme}-50) 20%, transparent)` }
                    : undefined
                }
              >
                <Markdown>{workData.description}</Markdown>
              </div>
            )}
          </StandardAccordion>
        );
      })}
    </div>
  );
}
