"use client";

import allSeasons from "@/data/serve/seasons.json";
import concerts from "@/data/serve/concerts.json";
import seasons from "@/data/serve/seasons.json";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./Button";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  // 1. Try to find matching concert
  const concertMatch = concerts.find((c) => c.streamingPageUrl === pathname);
  // 2. Try to find matching season from the serve data
  const seasonMatch = seasons.find((s) => s.seasonStreamingPageUrl === pathname);
  // 3. Try to find matching season from the live data (for season-pass pages)
  const liveSeasonMatch = allSeasons.find((s) => s.seasonStreamingPageUrl === pathname);

  const correctPassword =
    concertMatch?.streamingPagePassword ||
    seasonMatch?.seasonStreamingPagePassword ||
    liveSeasonMatch?.seasonStreamingPagePassword ||
    "";

  useEffect(() => {
    const stored = sessionStorage.getItem(`unlocked-${pathname}`);
    if (stored === "true") setUnlocked(true);
  }, [pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (input === correctPassword) {
        sessionStorage.setItem(`unlocked-${pathname}`, "true");
        setUnlocked(true);
        setLoading(false);
      } else {
        setLoading(false);
        setWrongPassword(true);
      }
    }, 400);
  };

  if (!correctPassword) {
    return <>{children}</>; // fallback to open page if not in data
  }

  if (unlocked) return <>{children}</>;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 delay-100 ${wrongPassword ? "animation-smh" : ""}`}
    >
      <h1 className="mb-4 text-xl font-bold">Enter Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="password" value={input} onChange={(e) => setInput(e.target.value)} className="border p-2" />
        <Button type="submit" variant="filled" size="md" color="sand" disabled={loading} loading={loading}>
          {loading ? "Unlocking..." : "Unlock"}
        </Button>
        <div
          className={` ${wrongPassword ? "opacity-100" : "opacity-0"} bg-red-600 px-s py-half text-white text-center text-sm kode-mono mt-s`}
        >
          Wrong password
        </div>
      </form>
    </div>
  );
}
