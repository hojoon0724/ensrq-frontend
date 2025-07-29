import NavBar from "@/components/organisms/NavBar";
import type { Metadata } from "next";
import "../styles/globals.css";
import Footer from "@/components/organisms/Footer";

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
      <body className="flex flex-col w-screen h-screen items-center justify-between">
        <NavBar />
        <div className="top-container">{children}</div>
        <Footer/>
      </body>
    </html>
  );
}
