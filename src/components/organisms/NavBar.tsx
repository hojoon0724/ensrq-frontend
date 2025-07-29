"use client";

import Logo from "@/assets/logo";
import seasonData from "@/data/seasons.json";
import Link from "next/link";
import { useRef, useState } from "react";

const navItems = [
  {
    name: "About",
    url: "/about",
    dropdown: true,
    dropdownItems: [
      { name: "mission", url: "/mission" },
      { name: "artistic directors", url: "/artistic-directors" },
      { name: "enSRQ artists", url: "/ensrq-artists" },
      { name: "guest artists", url: "/guest-artists" },
      { name: "contact", url: "/contact" },
      { name: "board of directors", url: "/board-of-directors" },
      { name: "diversity policy", url: "/diversity-policy" },
      { name: "our donors", url: "/our-donors" },
      { name: "donate", url: "/donate" },
    ],
  },
  {
    name: "Schedule",
    url: `/schedule/${Object.keys(seasonData)[0]}`,
    dropdown: true,
    dropdownItems: Object.keys(seasonData).map((season) => ({
      name: season,
      url: `/schedule/${season}`,
    })),
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
  },
  { name: "Tickets", url: "/tickets" },
];

export default function NavBar() {
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
    <nav className="flex justify-center items-center w-full">
      <div className="nav-contents-container w-full max-w-7xl p-s flex justify-between items-center h-[100px] max-h-[100px]">
        <div className="nav-left-logo-container h-full aspect-[20/9]">
          <Logo color="var(--water-50)" />
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
                  <Link href={item.url} className="block px-s py-half hover:bg-gray-100 dark:hover:bg-water-500">
                    {item.name}
                  </Link>
                  <ul
                    className={`absolute bg-white dark:bg-water-500 museo-slab shadow-lg mt-half right-0 flex flex-col gap-quarter ${
                      activeDropdown === item.name ? "block" : "hidden"
                    }`}
                  >
                    {item.dropdownItems.map((dropdownItem) => (
                      <li key={dropdownItem.name} className="text-right flex justify-end">
                        <Link href={dropdownItem.url} className="block px-half hover:bg-gray-100 dark:hover:bg-water-500 text-nowrap">
                          {dropdownItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
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
