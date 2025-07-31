"use client";
import Logo from "@/assets/logo";
import seasonData from "@/data/seasons.json";
import Link from "next/link";
import { useRef, useState } from "react";

const links_active = false

const navItems = links_active? [
  {
    name: "About",
    url: "/about",
    dropdown: true,
    dropdownItems: [
      { name: "mission", url: "/about#mission" },
      { name: "artistic directors", url: "/about#artistic-directors" },
      { name: "enSRQ artists", url: "/about#ensrq-artists" },
      { name: "guest artists", url: "/about#guest-artists" },
      { name: "contact", url: "/about#contact" },
      { name: "board of directors", url: "/about#board-of-directors" },
      { name: "diversity policy", url: "/about#diversity-policy" },
      { name: "our donors", url: "/about#our-donors" },
      { name: "donate", url: "/about#donate" },
    ],
    is_cta: false,
  },
  {
    name: "Schedule",
    url: `/schedule/${Object.keys(seasonData)[0]}`,
    dropdown: true,
    dropdownItems: Object.keys(seasonData).map((season) => ({
      name: season,
      url: `/schedule/${season}`,
    })),
    is_cta: false,
  },
  {
    name: "Watch",
    url: "/watch",
    dropdown: true,
    dropdownItems: [
      { name: "Season 10", url: "/watch/season-10" },
      { name: "Season 9", url: "/watch/season-9" },
      { name: "Season 8", url: "/watch/season-8" },
      { name: "Season 7", url: "/watch/season-7" },
      { name: "Season 6", url: "/watch/season-6" },
    ],
    is_cta: false,
  },
  { name: "Tickets", url: "/tickets", is_cta: true },
] : [];

export default function NavBar({ className = "" }: Readonly<{ className?: string }>) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (itemName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before hiding
  };

  return (
    <nav
      className={`sticky top-0 z-50 flex justify-center items-center w-full  bg-slate-700/30 backdrop-blur-xl ${className}`}
    >
      <div className="nav-contents-container w-full max-w-7xl p-s flex justify-between items-center h-[100px] max-h-[100px]">
        <div className="nav-left-logo-container h-full aspect-[20/9]">
          <Link href="/">
            <Logo color="var(--water-600)" />
          </Link>
        </div>
        <div className="nav-right-links-container museo">
          <ul className="flex center-all space-x-s">
            {navItems.map((item) =>
              item.dropdown ? (
                <li
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.url}
                    className={`block px-s py-half hover:bg-gray-100 dark:hover:bg-water-500 ${
                      activeDropdown === item.name ? "bg-gray-100 dark:bg-water-500" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                  <ul
                    className={`absolute bg-white dark:bg-water-500 museo-slab shadow-lg mt-half right-0 flex flex-col gap-quarter ${
                      activeDropdown === item.name ? "block" : "hidden"
                    }`}
                  >
                    {item.dropdownItems.map((dropdownItem) => (
                      <li key={dropdownItem.name} className="text-right flex justify-end">
                        <Link
                          href={dropdownItem.url}
                          className="block px-half hover:bg-gray-100 dark:hover:bg-water-500 text-nowrap"
                        >
                          {dropdownItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : item.is_cta ? (
                <li key={item.name}>
                  <Link href={item.url} className="block px-s py-half bg-gradient-to-br from-water-400 to-water-700 text-gray-30 hover:bg-gradient-to-tl transition-all timing-300">
                    {item.name}
                  </Link>
                </li>
              ) : (
                <li key={item.name}>
                  <Link href={item.url} className="block px-s py-half hover:bg-gray-100 dark:hover:bg-water-500">
                    {item.name}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
