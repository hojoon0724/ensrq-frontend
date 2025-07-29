import Wordmark from "@/assets/wordmark";
import Link from "next/link";

// const footerLogo = "";
const footerSocialLinks = [
  { platform: "platform1", displayString: "@handle1", url: "/" },
  { platform: "platform2", displayString: "@handle2", url: "/" },
  { platform: "platform3", displayString: "@handle3", url: "/" },
];

const footerNavigationLinks = [
  [
    { name: "name1", url: "#" },
    { name: "name2", url: "#" },
    { name: "name3", url: "#" },
  ],
  [
    { name: "name1", url: "#" },
    { name: "name2", url: "#" },
    { name: "name3", url: "#" },
  ],
  [
    { name: "name1", url: "#" },
    { name: "name2", url: "#" },
    { name: "name3", url: "#" },
  ],
];

export default function Footer() {
  return (
    <footer className="w-full p-s flex flex-col justify-start md:flex-row md:justify-center md:items-starts">
      <div className={`grid grid-cols-1 md:grid-cols-[1fr,auto] gap-s w-full max-w-7xl`}>
        {/* left-most column */}
        <div className="first-column flex flex-col justify-start items-start gap-double">
          {/* logo block */}
          <div className="footer-logo-container w-full">
            <Wordmark color="var(--water-50)" />
          </div>

          {/* socials block */}
          <div className="footer-social-links-container flex flex-row justify-between items-center">
            {footerSocialLinks.map((link) => {
              return (
                <div key={link.url} className={`social-link-container ${link.platform}`}>
                  {link.displayString}
                </div>
              );
            })}
          </div>
        </div>
        {/* right-side container */}
        <div className="right-side-column grid grid-cols-1 lg:grid-cols-[repeat(3,auto)] gap-double">
          {footerNavigationLinks.map((column, index) => {
            return (
              <div
                key={index}
                className={`footer-link-column column-${index} flex flex-col justify-start items-start gap-half`}
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
    </footer>
  );
}
