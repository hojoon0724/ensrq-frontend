"use client";

import { Button, Image } from "@/components/atoms";
import { SectionEmpty } from "@/components/sections";
import { useEffect, useRef, useState } from "react";

const PHOTOS = [
  "betsy-traba.webp",
  "bharat-chandra.webp",
  "conor-hanick.webp",
  "emily-levin.webp",
  "george-nickson.webp",
  "han-chen.webp",
  "jennifer-best-takeda.webp",
  "lucy-fitz-gibbon.webp",
  "marcelina-suchocka.webp",
  "michelle-gott.webp",
  "natalie-helm.webp",
  "samantha-bennett.webp",
];

const CARD_IMAGES = PHOTOS.map((name) => ({
  src: `/photos/flip-game-photos/${name}`,
  alt: name.replace(/[-_]/g, " ").replace(/\.webp$/, ""),
}));

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Card {
  id: number;
  image: { src: string; alt: string };
  matched: boolean;
}

const getInitialCards = (): Card[] => {
  const cards = CARD_IMAGES.flatMap((img, i) => [
    { id: i * 2, image: img, matched: false },
    { id: i * 2 + 1, image: img, matched: false },
  ]);
  return cards;
};

export function MatchGame() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [lock, setLock] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const flipBackTimeout = useRef<NodeJS.Timeout | null>(null);
  const earlyFlipAllowed = useRef(false);

  // Only shuffle and set cards on client
  useEffect(() => {
    setCards(shuffle(getInitialCards()));
  }, []);

  useEffect(() => {
    if (!cards) return;

    if (flipped.length === 2) {
      setLock(true);
      const [first, second] = flipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.image.src === secondCard.image.src) {
        flipBackTimeout.current = setTimeout(() => {
          setMatchedIds((prev) => {
            const newSet = new Set(prev);
            newSet.add(firstCard.id);
            newSet.add(secondCard.id);
            return newSet;
          });
          setFlipped([]);
          setLock(false);
        }, 700);
      } else {
        earlyFlipAllowed.current = true;
        flipBackTimeout.current = setTimeout(() => {
          setFlipped([]);
          setLock(false);
          earlyFlipAllowed.current = false;
        }, 900);
      }
    }

    // Cleanup only clears the timeout
    return () => {
      if (flipBackTimeout.current) {
        clearTimeout(flipBackTimeout.current);
        flipBackTimeout.current = null;
      }
    };
  }, [flipped, cards]);

  useEffect(() => {
    if (!cards) return;
    if (matchedIds.size === cards.length) {
      setTimeout(() => setGameWon(true), 600);
    }
  }, [matchedIds, cards]);

  const handleFlip = (idx: number) => {
    if (!cards) return;
    if (lock || flipped.includes(idx) || matchedIds.has(cards[idx].id)) return;
    if (flipped.length === 2) {
      if (flipBackTimeout.current) {
        clearTimeout(flipBackTimeout.current);
        flipBackTimeout.current = null;
      }
      if (earlyFlipAllowed.current) {
        setFlipped([]);
        setLock(false);
        earlyFlipAllowed.current = false;
        setTimeout(() => setFlipped([idx]), 0);
        return;
      }
      return;
    }
    setFlipped((prev) => [...prev, idx]);
  };

  const [fading, setFading] = useState(false);

  const handleRestart = () => {
    setFading(true); // Start fade-out
    setCards(null); // Prevent rendering stale cards
    setTimeout(() => {
      setFlipped([]); // Reset flipped state
      setCards(shuffle(getInitialCards()));
      setMatchedIds(new Set());
      setGameWon(false);
      setLock(false);
      setFading(false); // End fade
    }, 500); // Match fade duration
  };

  // Always render the grid container to preserve height and prevent scroll jumps

  // Responsive grid: 3x4 on mobile, 4x3 on md+
  return (
    <SectionEmpty className="flex flex-col items-center justify-center min-h-[40vh] w-full py-8">
      <div className="w-full flex flex-col items-center relative">
        <div
          className={`grid grid-cols-3 xs:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-half md:gap-s w-full transition-opacity duration-500 ${
            fading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ maxWidth: 1200, minHeight: "600px" }}
        >
          {cards && !fading
            ? cards.map((card, idx) => {
                const isFlipped = flipped.includes(idx) || matchedIds.has(card.id);
                const isMatched = matchedIds.has(card.id);
                const pointerEvents = lock || isFlipped || flipped.length === 2 ? "pointer-events-none" : "";
                return (
                  <div
                    key={card.id}
                    className={`relative aspect-[3/2] w-full max-w-[240px] md:max-w-[240px] group select-none cursor-pointer ${pointerEvents}`}
                    style={{ perspective: 900 }}
                    onClick={() => handleFlip(idx)}
                    role="button"
                    tabIndex={isMatched ? -1 : 0}
                    aria-disabled={isMatched || lock || isFlipped || flipped.length === 2}
                  >
                    <div
                      className={`transition-transform duration-500 ease-in-out w-full h-full absolute top-0 left-0 [backface-visibility:hidden] rounded-lg shadow-md flex items-stretch
                    ${isFlipped ? "rotate-y-180" : ""}
                  `}
                      style={{
                        transformStyle: "preserve-3d",
                        transition: "transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)",
                        minHeight: 0,
                      }}
                    >
                      {/* Card Back */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sand-50 to-sand-500 rounded-lg border border-sand-300 z-10
                      transition-opacity duration-300 ${isFlipped ? "opacity-0" : "opacity-100"} ${isMatched ? "opacity-60" : ""}`}
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <span className="text-3xl md:text-4xl text-sand-700 font-bold tracking-widest">?</span>
                      </div>
                      {/* Card Front */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center bg-white rounded-lg border-sand-300 border overflow-hidden
                      transition-opacity duration-300 ${isFlipped ? "opacity-100" : "opacity-0"} ${isMatched ? "opacity-60" : ""}`}
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <Image
                          src={card.image.src}
                          alt={card.image.alt}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover rounded-md min-w-0 min-h-0"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            : // Render invisible placeholders to preserve grid height during fade/reset
              Array.from({ length: 24 }).map((_, idx) => (
                <div
                  key={"placeholder-" + idx}
                  className="aspect-[3/2] w-full max-w-[240px] md:max-w-[240px] opacity-0 pointer-events-none"
                  style={{ perspective: 900 }}
                />
              ))}
        </div>
        {gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 animate-fade-in">
            <div className="text-card bg-white/80 flex flex-col items-center p-double rounded-lg shadow-lg backdrop-blur-md">
              <div className="text-xl font-semibold mb-4">🎉 You matched all the cards! 🎉</div>
              <Button onClick={handleRestart} size="lg" variant="filled" disabled={fading}>
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg) !important;
        }
        @media (max-width: 767px) {
          .grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (min-width: 768px) {
          .grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 2, 0.6, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </SectionEmpty>
  );
}
