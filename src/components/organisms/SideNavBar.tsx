"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { FullLogo, WordmarkVertical } from "@/assets";
import seasonData from "@/data/serve/seasons.json";
import concertData from "@/data/serve/concerts.json";
import { removeSeasonNumberFromConcertId } from "@/utils";
import { Icon } from "../atoms/Icon";
import { formatSeasonLabel } from "@/utils";

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
        dropdownItems: descendingSeasons[0].concerts.map((concertId) => ({
          name: concertData.filter((concert) => concert.concertId === concertId)[0].title,
          url: `/seasons/${descendingSeasons[0].seasonId}/${removeSeasonNumberFromConcertId(concertId)}`,
        })),
        is_cta: false,
      },

      {
        name: "Past Seasons",
        url: `/seasons/${descendingSeasons[0].seasonId}`,
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
        ],
        is_cta: false,
      },
      { name: "Tickets", url: "/tickets", is_cta: true },
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
              className="button-icon mb-4 hidden lg:flex flex-col justify-center items-center"
              href="/tickets"
              title="Go to Tickets"
              onClick={() => setIsNavOpen(false)}
            >
              <svg aria-hidden="true" width="26" viewBox="0 0 26 15">
                <path d="M25.6907 14.1045H0.648438V9.309H1.33858C1.9066 9.28496 2.44338 9.0424 2.8368 8.63197C3.23022 8.22155 3.44987 7.675 3.44987 7.10646C3.44987 6.53793 3.23022 5.99138 2.8368 5.58096C2.44338 5.17053 1.9066 4.92797 1.33858 4.90393H0.648438V0.104492H25.6907V4.90393H25.0006C24.4325 4.92797 23.8958 5.17053 23.5023 5.58096C23.1089 5.99138 22.8893 6.53793 22.8893 7.10646C22.8893 7.675 23.1089 8.22155 23.5023 8.63197C23.8958 9.0424 24.4325 9.28496 25.0006 9.309H25.6907V14.1045ZM2.02872 12.7242H24.3104V10.6183C23.5117 10.4397 22.7977 9.99436 22.286 9.35563C21.7743 8.7169 21.4955 7.92291 21.4955 7.10449C21.4955 6.28608 21.7743 5.49208 22.286 4.85335C22.7977 4.21462 23.5117 3.76927 24.3104 3.59069V1.48477H2.02872V3.59069C2.82741 3.76927 3.54144 4.21462 4.05313 4.85335C4.56481 5.49208 4.84363 6.28608 4.84363 7.10449C4.84363 7.92291 4.56481 8.7169 4.05313 9.35563C3.54144 9.99436 2.82741 10.4397 2.02872 10.6183V12.7242Z"></path>
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
              className="button-icon mb-4 hidden lg:flex flex-col justify-center items-center"
              href="/about#donate"
              title="Go to Donate"
              onClick={() => setIsNavOpen(false)}
            >
              <svg aria-hidden="true" width="20" viewBox="0 0 20 19">
                <path d="M10.2422 18.5068C10.1108 18.5045 9.98339 18.4612 9.87782 18.3829C9.49523 18.0987 0.487943 11.387 0.509805 5.91412C0.509805 2.72951 2.75798 0.506836 5.94988 0.506836C6.79254 0.51128 7.62189 0.717354 8.36862 1.10783C9.11535 1.49832 9.75777 2.06186 10.2422 2.75137C10.728 2.05985 11.3728 1.49507 12.1222 1.10449C12.8717 0.713915 13.7039 0.508953 14.5491 0.506836C17.741 0.506836 19.9782 2.72951 19.9891 5.91412C20.011 11.3797 11.0037 18.0987 10.6211 18.3829C10.5116 18.4641 10.3786 18.5076 10.2422 18.5068ZM5.93531 1.78214C3.0677 1.78214 1.77782 3.85906 1.77053 5.91776C1.77053 7.87809 3.2681 10.4615 6.143 13.391C7.42925 14.7031 8.79847 15.9311 10.2422 17.0676C11.6922 15.9317 13.0675 14.7037 14.3596 13.391C17.2163 10.4761 18.7321 7.87809 18.7321 5.91776C18.7321 3.85906 17.4349 1.78214 14.5673 1.78214C11.9766 1.78214 10.8871 4.13234 10.8434 4.23072C10.7908 4.34053 10.7081 4.43311 10.6049 4.49763C10.5016 4.56216 10.3821 4.59596 10.2604 4.59509C10.1391 4.59615 10.02 4.56238 9.91734 4.4978C9.81465 4.43321 9.73264 4.34052 9.68106 4.23072C9.61547 4.13234 8.52964 1.78214 5.93531 1.78214Z"></path>
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
                  ) : null
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
                        px-6 py-3 text-lg flex justify-between group items-center w-full transition-all duration-300 text-blue-600 font-bold bg-sand-50 hover:bg-water-50 hover:text-sky-800
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
                  ) : null
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
                          style={{ cursor: "pointer" }}
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
      </div>
    </>
  );
}

export default SideNavBar;
