import Footer from "@/components/organisms/Footer";
import NavBar from "@/components/organisms/NavBar";

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
        {/* <NavBar/> */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
