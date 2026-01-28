"use client";

import { Button } from "@/components/atoms";
import { useGlobalPopup } from "@/components/providers";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const POPUP_STORAGE_KEY = "lastPopupShown";
const POPUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface PopupData {
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

interface GlobalPopupProps {
  popupData?: PopupData[];
}

export function GlobalPopup({ popupData }: GlobalPopupProps) {
  const { open, show, hide } = useGlobalPopup();
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dev = true; // Set to true to always show popup in development

  const activePopup = popupData?.find((popup) => {
    const now = new Date();
    const startDate = new Date(popup.startDate);
    const endDate = new Date(popup.endDate);
    return now >= startDate && now <= endDate;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger rules
  useEffect(() => {
    if (!mounted) return;

    // In dev mode, always show the popup
    if (dev) {
      show();
      return;
    }

    const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
    const now = Date.now();

    // Show if never shown or 24 hours have passed
    if (!lastShown || now - parseInt(lastShown) >= POPUP_INTERVAL_MS) {
      show();
      localStorage.setItem(POPUP_STORAGE_KEY, String(now));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Trigger fade-in/out animation when popup opens/closes
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      // Small delay to trigger CSS transition
      const timer = setTimeout(() => setShouldRender(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${shouldRender ? "opacity-100" : "opacity-0"}`}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 transition-opacity duration-300" onClick={hide} />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center max-w-screen p-s">
        <div
          className="popup-container flex flex-col items-stretch justify-center p-6 max-w-screen transform transition-all duration-300 ease-out"
          style={{ transform: shouldRender ? "scale(1)" : "scale(0.95)" }}
        >
          <div className="bg-sand-500 top-row-text-close-container flex justify-between items-stretch min-h-[2ch]">
            <h3 className="w-full p-s">{activePopup?.title}</h3>
            <div className="button-container aspect-[1/1]">
              <Button onClick={hide}>X</Button>
            </div>
          </div>
          <div className="image-container w-full relative bg-gray-50 aspect-[3/2]">
            <Image src={activePopup?.image[0].src || ""} alt={activePopup?.image[0].alt || ""} fill />
          </div>
          <div className="bg-sky-50 p-s text-center flex justify-center">
            <div className="text-container max-w-prose">
              {activePopup?.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div
            className={`cta-container w-full bg-water-50 p-s gap-s museo-slab grid ${activePopup?.cta.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
          >
            {activePopup?.cta.map((cta, index) => (
              <Button key={index} onClick={hide} color="sand" className="uppercase">
                <Link href={cta.url || "#"}>{cta.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
