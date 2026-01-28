import { Footer, GlobalPopup } from "@/components/organisms";

import { SideNavBar } from "@/components/organisms";
import { GlobalPopupProvider } from "@/components/providers";
import type { Metadata } from "next";
import Script from "next/script";
import HojoonKimFooter from "../components/atoms/HojoonKim";
import "../styles/globals.css";
import popups from "@/data/popups.json";
import { GlobalBanner } from "@/components/atoms";

export const metadata: Metadata = {
  title: "ensembleNewSRQ",
  description: "ensembleNewSRQ",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-9BB8LKLHT0" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9BB8LKLHT0');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '157098818575376');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=157098818575376&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="flex flex-col w-screen min-h-screen items-center justify-between">
        <GlobalPopupProvider>
          <SideNavBar />
          <GlobalBanner bannerData={popups} />
          <main className="flex-1 lg:ml-20 w-screen lg:w-[calc(100svw-80px)] h-full">{children}</main>
          <Footer className="lg:ml-20 lg:max-w-[calc(100svw-80px)]" />
          <HojoonKimFooter className="lg:ml-20 lg:max-w-[calc(100svw-80px)]" />
          <GlobalPopup popupData={popups} />
        </GlobalPopupProvider>
      </body>
    </html>
  );
}
