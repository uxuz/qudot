import Link from "next/link";
import { Reddit_Sans, Reddit_Mono } from "next/font/google";
import "./globals.css";

import { createPageMetadata } from "@/lib/metadata";
import { LucideCoffee, LucideGithub } from "@/components/icons/Lucide";

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
              className="bg-dim/5 border-dim/5 text-dim hover:bg-dim/10 flex size-10 items-center justify-center rounded-xl border transition-colors [&>svg]:text-xl"
            ></Link>
            <div className="ml-auto flex gap-2">
              <Link
                href="https://github.com/uxuz/qudot"
                target="_blank"
                className="bg-dim/5 border-dim/5 text-dim hover:bg-dim/10 ml-auto flex size-10 items-center justify-center rounded-xl border transition-colors [&>svg]:text-xl"
              >
                <LucideGithub />
              </Link>
              <Link
                href="https://ko-fi.com/uxuz"
                target="_blank"
                className="bg-dim/5 border-dim/5 text-dim hover:bg-dim/10 ml-auto flex size-10 items-center justify-center rounded-xl border transition-colors [&>svg]:text-xl"
              >
                <LucideCoffee />
              </Link>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
