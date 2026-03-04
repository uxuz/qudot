import Link from "next/link";
import { Reddit_Sans, Reddit_Mono } from "next/font/google";
import "./globals.css";

import { createPageMetadata } from "@/lib/metadata";

const redditSans = Reddit_Sans({
  variable: "--font-reddit-sans",
  subsets: ["latin"],
});

const redditMono = Reddit_Mono({
  variable: "--font-reddit-mono",
  subsets: ["latin"],
});

export const metadata = createPageMetadata({
  title: "Qudot | Reddit Collectible Avatars Shop Catalog",
  description:
    "Explore the complete Reddit Collectible Avatars shop catalog. Browse avatars, creators and traits all in one place.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redditSans.variable} ${redditMono.variable} antialiased`}
      >
        <div className="m-auto flex min-h-dvh max-w-2xl flex-col pb-12">
          <header className="px-horizontal border-dim/10 flex h-16 items-center border-b">
            <Link
              href="/"
              className="bg-dim/5 border-dim/5 size-10 rounded-xl border"
            />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
