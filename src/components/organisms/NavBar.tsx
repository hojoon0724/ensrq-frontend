"use client";

import { FullLogo } from "@/assets";
import { Icon } from "@/components/atoms";
import seasonData from "@/data/live-data.json";
import { formatSeasonLabel } from "@/utils/textFormat";
import Link from "next/link";
import { useRef, useState } from "react";

const links_active = true;

const navItems = links_active
  ? [
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
          name: formatSeasonLabel(season),
          url: `/schedule/${season}`,
        })),
        is_cta: false,
      },
      {
        name: "Watch",
        url: "/streaming",
        dropdown: true,
        dropdownItems: [
          { name: "Season 10", url: "/streaming/s10" },
          { name: "Season 9", url: "/streaming/s09" },
          { name: "Season 8", url: "/streaming/s08" },
          { name: "Season 7", url: "/streaming/s07" },
          { name: "Season 6", url: "/streaming/s06" },
        ],
        is_cta: false,
      },
      { name: "Tickets", url: "/tickets", is_cta: true },
    ]
  : [];

export function NavBar({ className = "" }: Readonly<{ className?: string }>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdown((prev) => (prev === itemName ? null : itemName));
  };

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
      {/* <SectionMeshGradient color1="water" backgroundColor="var(--water-100)"> */}
      <div className="nav-contents-container w-full max-w-7xl flex justify-between items-center h-[80px] p-double lg:h-[100px] lg:p-s">
        {/* Logo */}
        <div className="nav-left-logo-container h-full aspect-[20/9]">
          <Link href="/">
            <FullLogo color="var(--water-600)" />
          </Link>
        </div>

        {/* Desktop */}
        <div className="nav-right-links-container museo hidden lg:flex">
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
                      <Link
                        key={dropdownItem.name}
                        href={dropdownItem.url}
                        className="block px-half hover:bg-gray-100 dark:hover:bg-water-500 text-nowrap"
                      >
                        <li className="text-right flex justify-end">{dropdownItem.name}</li>
                      </Link>
                    ))}
                  </ul>
                </li>
              ) : item.is_cta ? (
                <li key={item.name}>
                  <Link
                    href={item.url}
                    className="block px-s py-half bg-gradient-to-br from-water-400 to-water-700 text-gray-30 hover:bg-gradient-to-tl transition-all timing-300"
                  >
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

        {/* Mobile Menu Toggle */}
        <div className="nav-mobile-menu-toggle flex lg:hidden">
          <button
            className="p-s rounded-md hover:bg-gray-100 dark:hover:bg-water-500 "
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon name="hamburger" size="lg" color="stroke-gray-950" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="overflow-clip absolute top-full left-0 w-screen h-screen shadow-lg transition-transform duration-300 ease-in-out lg:hidden">
          <div
            className={`nav-mobile-menu-container  top-full left-0 w-screen h-full pb-[100px] bg-gray-30 shadow-lg transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            } lg:hidden`}
          >
            <div className="links-container h-full flex flex-col justify-between">
              <ul className="flex flex-col items-end space-y-s p-double museo-slab text-lg">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <li key={item.name} className="relative" onClick={() => toggleDropdown(item.name)}>
                      <div className={`block w-full text-center px-s py-half ${openDropdown === item.name ? "" : ""}`}>
                        <div className="item-container w-full flex items-center justify-end gap-s">
                          <Icon
                            name="chevronLeft"
                            size="md"
                            color="stroke-gray-950"
                            className={`transition-transform duration-300 ${
                              openDropdown === item.name ? "-rotate-90" : "-rotate-0"
                            }`}
                          />
                          {item.name}
                        </div>
                      </div>
                      <ul
                        className={`museo-slab w-full flex flex-col items-end gap-s transition-all duration-300 overflow-hidden text-base ${
                          openDropdown === item.name ? "max-h-[500px] py-half" : "max-h-0"
                        }`}
                      >
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.url}
                            className="block px-half text-nowrap"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <li>{dropdownItem.name}</li>
                          </Link>
                        ))}
                      </ul>
                    </li>
                  ) : item.is_cta ? null : (
                    <li key={item.name}>
                      <Link
                        href={item.url}
                        className="block w-full text-center px-s py-half hover:bg-gray-100 dark:hover:bg-water-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                )}
              </ul>
              <ul className="flex flex-col items-end space-y-s p-double museo-slab text-xl">
                {navItems.map((item) =>
                  item.is_cta ? (
                    <li key={item.name}>
                      <Link
                        href={item.url}
                        className="block w-full text-center px-double py-s bg-gradient-to-br from-water-400 to-water-700 text-gray-30 hover:bg-gradient-to-tl transition-all timing-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* </SectionMeshGradient> */}
    </nav>
  );
}
