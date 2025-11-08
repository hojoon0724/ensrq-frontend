"use client";

import { useEffect, useRef, useState } from "react";

type StandardAccordionProps = {
  className?: string;
  isOpen: boolean;
  showBorder?: boolean;
  showIcon?: boolean;
  accordionTitle?: string;
  header?: React.ReactNode;
  useCustomTemplate?: boolean;
  onToggleAction?: () => void;
  children: React.ReactNode;
};

export function StandardAccordion({
  className,
  isOpen = false,
  showBorder = true,
  showIcon = true,
  accordionTitle,
  header,
  useCustomTemplate = false,
  onToggleAction,
  children,
}: StandardAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(isOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Update internal state when isOpen prop changes
  useEffect(() => {
    setIsExpanded(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, isExpanded]);

  const handleToggle = () => {
    if (onToggleAction) {
      onToggleAction();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const baseContentClasses = "accordion-content p-s";

  return (
    <div className={`standard-accordion-container ${className} relative`}>
      <div className={`accordion-header ${showBorder ? "border px-s py-half" : ""}`} onClick={handleToggle}>
        {/* accordion header */}
        {header ? (
          <div className="flex items-center cursor-pointer">
            {showIcon && (
              <div
                className={`accordion-icon mr-2 transition-transform duration-300 ease-in-out text-xs ${isExpanded ? "transform rotate-90" : ""}`}
              >
                ▶
              </div>
            )}
            <div className="accordion-custom-header w-full">{header}</div>
          </div>
        ) : (
          <div className="accordion-icon-and-title flex items-center cursor-pointer">
            {showIcon && (
              <div
                className={`accordion-icon mr-2 transition-transform duration-300 ease-in-out text-xs ${isExpanded ? "transform rotate-90" : ""}`}
              >
                ▶
              </div>
            )}
            <div className="accordion-title">{accordionTitle}</div>
          </div>
        )}
      </div>
      <div
        ref={contentRef}
        className={`accordion-content-wrapper overflow-hidden transition-all duration-300 ease-in-out ${useCustomTemplate ? baseContentClasses : ""} ${showBorder ? "border-t-0 border px-s" : ""}`}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : "0px",
          opacity: isExpanded ? 1 : 0,
          paddingTop: isExpanded ? "" : "0",
          paddingBottom: isExpanded ? "" : "0",
        }}
      >
        <div className={showBorder ? "py-half" : ""}>{children}</div>
      </div>
    </div>
  );
}
