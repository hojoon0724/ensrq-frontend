import { Footer } from "@/components/organisms";

import SideNavBar from "@/components/organisms/SideNavBar";
import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "enSRQ",
  description: "enSRQ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col w-screen min-h-screen items-center justify-between">
        <SideNavBar />
        <main className="flex-1 lg:ml-20 w-screen lg:w-[calc(100svw-80px)] h-full">{children}</main>
        <Footer className="lg:ml-20 lg:max-w-[calc(100%-80px)]"/>
      </body>
    </html>
  );
}
