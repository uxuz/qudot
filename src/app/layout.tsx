import type { Metadata } from "next";
import { Reddit_Sans } from "next/font/google";
import "./globals.css";

const redditSans = Reddit_Sans({
  variable: "--font-reddit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qudot | Reddit Collectible Avatars Catalog",
  description:
    "Explore the most complete catalog of Reddit Collectible Avatars. Browse collections, creators and traits in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${redditSans.variable} antialiased`}>
        <div className="m-auto flex min-h-dvh max-w-2xl flex-col px-3 py-12 sm:px-0">
          <header></header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
