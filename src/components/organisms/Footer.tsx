"use client";

import Wordmark from "@/assets/wordmark";
import Link from "next/link";
import SocialMediaIcons from "../atoms/SocialMediaIcons";

// const footerLogo = "";
const footerSocialLinks = [
  { platform: "twitter", displayString: "@ensemblenewSRQ", url: "https://x.com/ensemblenewSRQ" },
  { platform: "facebook", displayString: "/ensemblenewSRQ", url: "https://facebook.com/ensemblenewSRQ" },
  { platform: "instagram", displayString: "@ensemblenewsrq", url: "https://instagram.com/ensemblenewsrq" },
  { platform: "tiktok", displayString: "@ensemblenewsrq", url: "https://tiktok.com/@ensemblenewsrq" },
];

const footerNavigationLinks = [
  [
    { name: "About Us", url: "/about" },
    { name: "Artistic Directors", url: "#" },
    { name: "Board of Directors", url: "#" },
    { name: "Donors", url: "#" },
    { name: "Support us", url: "#" },
  ],
];

export default function Footer() {
  return (
    <footer className="w-full px-s py-double flex flex-col justify-start md:justify-center bg-sky-900 text-gray-30">
      <div className="footer-content w-full max-w-7xl mx-auto ">
        {/* logo block */}
        <div className="footer-logo-container w-full mb-triple">
          <Wordmark color="var(--water-50)" />
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-[1fr,auto] gap-s w-full max-w-7xl`}>
          {/* left-most column */}
          <div className="first-column flex flex-col justify-start items-start gap-triple lg:gap-double mb-double lg:mb-0">
            {/* socials block */}
            <div className="footer-social-links-container flex flex-row justify-between items-center gap-s">
              {footerSocialLinks.map((link) => {
                return (
                  <div
                    key={link.url}
                    className={`social-link-container ${link.platform} h-10 w-10 p-quarter rounded-md bg-gray-50`}
                  >
                    <Link href={link.url} target="_blank" rel="noopener noreferrer">
                      <SocialMediaIcons platform={link.platform} color="var(--water-950)" />
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="address-container">
              <p>PO Box 15372</p>
              <p>Sarasota, FL 34277</p>
              <p>
                <a href="mailto:ensemblenewsrq@gmail.com">ensemblenewsrq@gmail.com</a>
              </p>
            </div>
          </div>
          {/* right-side container */}
          <div
            className={`right-side-column grid grid-cols-1 lg:grid-cols-[repeat(${footerNavigationLinks.length},auto)] gap-double `}
          >
            {footerNavigationLinks.map((column, index) => {
              return (
                <div
                  key={index}
                  className={`footer-link-column column-${index} flex flex-col justify-start items-start gap-s museo`}
                >
                  {column.map((link, index) => {
                    return (
                      <Link key={index} href={`${index}-${link.url}`}>
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
