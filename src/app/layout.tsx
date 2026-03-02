import type { Metadata } from "next";
import { Reddit_Sans, Reddit_Mono } from "next/font/google";
import "./globals.css";

const redditSans = Reddit_Sans({
  variable: "--font-reddit-sans",
  subsets: ["latin"],
});

const redditMono = Reddit_Mono({
  variable: "--font-reddit-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blurbury | Reddit Collectible Avatars Shop Catalog",
  description:
    "Explore the complete Reddit Collectible Avatars shop catalog. Browse avatars, creators and traits all in one place.",
};

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
        <div className="m-auto flex min-h-dvh max-w-2xl flex-col py-12">
          <header></header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
