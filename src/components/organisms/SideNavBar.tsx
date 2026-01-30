"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { FullLogo, WordmarkVertical } from "@/assets";
import { Icon } from "@/components/atoms";
import concertData from "@/data/serve/concerts.json";
import seasonData from "@/data/serve/seasons.json";
import { formatSeasonLabel, removeSeasonNumberFromConcertId } from "@/utils";

const descendingSeasons = seasonData.reverse();

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
        name: "Season 10 (25-26)",
        url: `/seasons/${descendingSeasons[0].seasonId}`,
        dropdown: true,
        dropdownItems: descendingSeasons[0].concerts
          .map((concertId) => {
            const concert = concertData.filter((concert) => concert.concertId === concertId)[0];
            return { concertId, concert };
          })
          .filter(({ concert }) => Boolean(concert) && !concert?.isNonConcertEvent)
          .map(({ concertId, concert }) => ({
            name: concert.title,
            url: `/seasons/${descendingSeasons[0].seasonId}/${removeSeasonNumberFromConcertId(concertId)}`,
          })),
        is_cta: false,
      },

      {
        name: "Past Seasons",
        url: `/seasons/`,
        dropdown: true,
        dropdownItems: descendingSeasons.slice(1).map((season) => ({
          name: formatSeasonLabel(season.seasonId),
          url: `/seasons/${season.seasonId}`,
        })),
        is_cta: false,
      },

      {
        name: "Streaming",
        url: "/streaming/",
        dropdown: true,
        dropdownItems: [
          { name: "Season 10", url: "/streaming/s10" },
          { name: "Season 9", url: "/streaming/s09" },
          { name: "Season 8", url: "/streaming/s08" },
          { name: "Season 7", url: "/streaming/s07" },
          { name: "Season 6", url: "/streaming/s06" },
          { name: "Season 5", url: "/streaming/s05" },
        ],
        is_cta: false,
      },
      { name: "Tickets", url: "/tickets", is_cta: true },
      { name: "Donate", url: "/about#donate", is_cta: true },
    ]
  : [];

export function SideNavBar() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdown((prev) => (prev === itemName ? null : itemName));
  };

  const handleMouseEnter = (idx: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(idx);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before hiding
  };

  return (
    <>
      {/* Backdrop overlay for main content */}

      <div
        className={`fixed inset-0  transition-all duration-300 z-10 lg:block hidden ${isNavOpen ? "bg-gray-900/20 backdrop-blur-xl" : "pointer-events-none"}`}
        onClick={() => setIsNavOpen(false)}
      />

      <div className={`sticky top-0 z-50 flex justify-center items-center w-screen bg-gray-900/10 transition-all`}>
        <div className="nav-contents-container w-full max-w-7xl flex justify-between items-center h-[80px] bg-white p-double lg:p-0 lg:h-0">
          {/* Logo */}
          <div className="nav-left-logo-container h-full aspect-[20/9] lg:hidden">
            <Link href="/">
              <FullLogo color="var(--water-600)" />
            </Link>
          </div>

          {/* desktop */}
          {/* 80px Sidebar */}
          <aside className="absolute top-0 left-0 h-screen w-20 bg-white z-20 hidden lg:flex flex-col items-center justify-between shadow-lg">
            {/* Hamburger Toggle */}
            <button
              id="sr-toggler"
              aria-label={isNavOpen ? "Close Navigation Menu" : "Show Navigation Menu"}
              aria-expanded={isNavOpen}
              aria-controls="sr-nav"
              onClick={() => setIsNavOpen((open) => !open)}
              className="mt-4 mb-8 w-10 h-10 flex items-center justify-center relative cursor-pointer"
            >
              <div className="w-8 h-8 flex flex-col items-center justify-center">
                <span
                  className={`block h-1 w-8 bg-black rounded transition-all duration-300 ${
                    isNavOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block h-1 w-8 rounded my-1 transition-all duration-300 ${isNavOpen ? "" : "bg-black"}`}
                ></span>
                <span
                  className={`block h-1 w-8 bg-black rounded transition-all duration-300 ${
                    isNavOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>

            {/* Tickets CTA */}
            <Link
              className="button-icon mb-4 hidden lg:flex flex-col justify-center items-center group"
              href="/tickets"
              title="Go to Tickets"
              onClick={() => setIsNavOpen(false)}
            >
              <svg aria-hidden="true" width="26" viewBox="0 0 26 15" className="group">
                <path d="M25.7,14.1H.6v-4.8h.7c.6,0,1.1-.3,1.5-.7.4-.4.6-1,.6-1.5s-.2-1.1-.6-1.5c-.4-.4-.9-.7-1.5-.7h-.7V.1h25v4.8h-.7c-.6,0-1.1.3-1.5.7-.4.4-.6,1-.6,1.5s.2,1.1.6,1.5c.4.4.9.7,1.5.7h.7v4.8ZM2,12.7h22.3v-2.1c-.8-.2-1.5-.6-2-1.3-.5-.6-.8-1.4-.8-2.3s.3-1.6.8-2.3c.5-.6,1.2-1.1,2-1.3V1.5H2v2.1c.8.2,1.5.6,2,1.3.5.6.8,1.4.8,2.3s-.3,1.6-.8,2.3c-.5.6-1.2,1.1-2,1.3v2.1Z" />
                <path
                  d="M2,12.7h22.3v-2.1c-.8-.2-1.5-.6-2-1.3-.5-.6-.8-1.4-.8-2.3s.3-1.6.8-2.3c.5-.6,1.2-1.1,2-1.3V1.5H2v2.1c.8.2,1.5.6,2,1.3.5.6.8,1.4.8,2.3s-.3,1.6-.8,2.3c-.5.6-1.2,1.1-2,1.3v2.1Z"
                  fill="var(--sky-50)"
                  className="opacity-0 transition-all duration-300 group-hover:opacity-100"
                />
              </svg>
              <span className="mt-1" style={{ fontSize: "12px" }}>
                Tickets
              </span>
            </Link>

            {/* Logo */}
            <Link className="mb-8" href="/" onClick={() => setIsNavOpen(false)}>
              <WordmarkVertical color="black" />
            </Link>

            {/* Donate CTA */}
            <Link
              className="button-icon mb-4 hidden lg:flex flex-col justify-center items-center heartbeat scale-125"
              href="/about#donate"
              title="Go to Donate"
              onClick={() => setIsNavOpen(false)}
            >
              <svg aria-hidden="true" width="20" viewBox="0 0 20 19">
                <path d="M10.2,18.5c-.1,0-.3,0-.4-.1-.4-.3-9.4-7-9.4-12.5C.5,2.7,2.8.5,5.9.5c.8,0,1.7.2,2.4.6.7.4,1.4,1,1.9,1.6.5-.7,1.1-1.3,1.9-1.6.7-.4,1.6-.6,2.4-.6,3.2,0,5.4,2.2,5.4,5.4,0,5.5-9,12.2-9.4,12.5-.1,0-.2.1-.4.1ZM5.9,1.8C3.1,1.8,1.8,3.9,1.8,5.9c0,2,1.5,4.5,4.4,7.5,1.3,1.3,2.7,2.5,4.1,3.7,1.4-1.1,2.8-2.4,4.1-3.7,2.9-2.9,4.4-5.5,4.4-7.5s-1.3-4.1-4.2-4.1-3.7,2.4-3.7,2.4c0,.1-.1.2-.2.3-.1,0-.2,0-.3,0-.1,0-.2,0-.3,0-.1,0-.2-.2-.2-.3,0,0-1.2-2.4-3.7-2.4Z" />
                <path
                  d="M5.9,1.8C3.1,1.8,1.8,3.9,1.8,5.9c0,2,1.5,4.5,4.4,7.5,1.3,1.3,2.7,2.5,4.1,3.7,1.4-1.1,2.8-2.4,4.1-3.7,2.9-2.9,4.4-5.5,4.4-7.5s-1.3-4.1-4.2-4.1-3.7,2.4-3.7,2.4c0,.1-.1.2-.2.3-.1,0-.2,0-.3,0-.1,0-.2,0-.3,0-.1,0-.2-.2-.2-.3,0,0-1.2-2.4-3.7-2.4Z"
                  fill="#ef4444"
                  className="heartbeat-opacity"
                />
              </svg>
              <span className="mt-1" style={{ fontSize: "12px" }}>
                Donate
              </span>
            </Link>
            <div></div>
          </aside>

          {/* Main Menu (outside sidebar, to the right) */}
          {isNavOpen && (
            <nav
              id="sr-nav"
              className="fixed top-0 left-20 h-screen w-64 bg-white z-30 flex flex-col justify-between items-start"
            >
              {/* Menu Top Section */}
              <ul className="w-full py-8">
                {navItems.map((item, idx) =>
                  !item.is_cta ? (
                    <li
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(idx)}
                      onMouseLeave={() => handleMouseLeave()}
                    >
                      <Link
                        href={item.url}
                        className={`
                        px-6 py-3 text-lg flex justify-between group items-center w-full font-medium transition 
                        ${
                          item.is_cta
                            ? "text-blue-600 font-bold hover:bg-sand-50"
                            : "text-gray-900 hover:bg-sky-muted-100"
                        } 
                        ${activeDropdown === idx ? "bg-sky-muted-100" : ""}
                      `}
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsNavOpen(false)}
                      >
                        <div className="menu-name">{item.name}</div>
                        <div
                          className={`flex menu-icon transition-all duration-300 
                          ${activeDropdown === idx ? "pr-2" : "pr-4"}`}
                        >
                          {item.dropdown ? <Icon name="arrowRight" size="sm" color="stroke-gray-900" /> : null}
                        </div>
                      </Link>
                    </li>
                  ) : null,
                )}
              </ul>

              {/* Menu Bottom Section */}
              <ul className="w-full py-8">
                {navItems.map((item, idx) =>
                  item.is_cta ? (
                    <li key={item.name} className="relative">
                      <Link
                        href={item.url}
                        className={`
                        px-6 py-3 text-lg flex justify-between group items-center w-full transition-all duration-300 font-bold 
                           hover:bg-sky-700 hover:text-sky-50
                        ${item.name === "Tickets" ? "text-sky-600 bg-sand-50" : "text-sky-600 bg-water-50"}

                      
                      `}
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsNavOpen(false)}
                      >
                        <div className="menu-name">{item.name}</div>
                        <div
                          className={`
                            flex menu-icon transition-all duration-300 
                            ${activeDropdown === idx ? "pr-2" : "pr-4"}
                          `}
                        ></div>
                      </Link>
                    </li>
                  ) : null,
                )}
              </ul>
            </nav>
          )}

          {/* Dropdown Menu (to the right of main menu) */}
          {isNavOpen && activeDropdown !== null && navItems[activeDropdown]?.dropdown && (
            <div
              className="fixed top-0 left-[calc(320px+16px)] w-64 h-screen bg-white z-40
              "
              onMouseEnter={() => handleMouseEnter(activeDropdown)}
              onMouseLeave={() => handleMouseLeave()}
            >
              <div className="py-8">
                <h3 className="px-6 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {navItems[activeDropdown]?.name}
                </h3>
                <ul>
                  {navItems[activeDropdown]?.dropdownItems?.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.url}
                        className="block px-6 py-2 text-gray-700 hover:bg-sky-muted-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsNavOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

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
          <div className="overflow-clip absolute top-full left-0 w-screen h-[calc(100vh-80px)] shadow-lg transition-transform duration-300 ease-in-out lg:hidden pointer-events-none">
            <div
              className={`nav-mobile-menu-container  top-full left-0 w-screen h-full pb-[100px] bg-gray-30 shadow-lg transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              } lg:hidden`}
            >
              <div className="links-container h-full flex flex-col justify-between pointer-events-auto">
                <ul className="flex flex-col items-end space-y-s p-double museo-slab text-lg">
                  {navItems.map((item) =>
                    item.dropdown ? (
                      <li
                        key={item.name}
                        className="relative"
                        onClick={() => toggleDropdown(item.name)}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          className={`block w-full text-center px-s py-half ${openDropdown === item.name ? "" : ""}`}
                        >
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
                          {item.dropdownItems
                            ? item.dropdownItems.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.name}
                                  href={dropdownItem.url}
                                  className="block px-half text-nowrap"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <li>{dropdownItem.name}</li>
                                </Link>
                              ))
                            : null}
                        </ul>
                      </li>
                    ) : item.is_cta ? null : (
                      <li key={item.name}>
                        <Link
                          href={item.url}
                          className="block w-full text-center px-s py-half hover:bg-gray-100 dark:hover:bg-water-500"
                          style={{ cursor: "pointer" }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
                <ul className="flex flex-col items-end space-y-s p-double museo-slab text-xl">
                  {navItems.map((item) =>
                    item.is_cta ? (
                      <li key={item.name}>
                        <Link
                          href={item.url}
                          className={`block w-full text-center px-triple py-s text-gray-30 transition-all timing-300 ${item.name === "Tickets" ? "bg-water-400" : "bg-sand-400"}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideNavBar;
