import Link from "next/link";
import { Reddit_Sans, Reddit_Mono } from "next/font/google";
import "./globals.css";

import { createPageMetadata } from "@/lib/metadata";
import {
  SimpleIconsGithub,
  SimpleIconsKofi,
} from "@/components/icons/SimpleIcons";

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
      <head>
        {process.env.NODE_ENV == "development" && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        )}
      </head>
      <body
        className={`${redditSans.variable} ${redditMono.variable} antialiased`}
      >
        <div className="m-auto flex min-h-dvh max-w-2xl flex-col pb-12">
          <header className="px-horizontal border-dim/10 bg-background sticky top-0 z-50 flex h-16 items-center border-b">
            <Link href="/" className="flex items-center">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 64 64"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlSpace="preserve"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  strokeLinejoin: "round",
                  strokeMiterlimit: 2,
                }}
                className="size-10"
              >
                <path
                  d="M24,40C19.582,40 16,36.418 16,32L16,24C16,19.582 19.582,16 24,16L40,16C44.418,16 48,19.582 48,24L48,44C48,46.209 46.209,48 44,48C41.791,48 40,46.209 40,44C40,42.939 39.579,41.922 38.828,41.172C38.078,40.421 37.061,40 36,40C32.739,40 28.03,40 24,40ZM40,28C40,25.791 38.209,24 36,24C33.557,24 30.443,24 28,24C25.791,24 24,25.791 24,28C24,30.209 25.791,32 28,32C30.443,32 33.557,32 36,32C38.209,32 40,30.209 40,28Z"
                  style={{ fill: "rgb(237,237,237)" }}
                />
              </svg>
              <span className="text-xl font-bold tracking-tight">Qudot</span>
            </Link>
            <div className="ml-auto flex gap-2">
              <Link
                href="https://github.com/uxuz/qudot"
                aria-label="GitHub repository"
                target="_blank"
                className="bg-dim/5 border-dim/5 text-dim hover:bg-dim/10 ml-auto flex size-10 items-center justify-center rounded-xl border transition-colors [&>svg]:text-xl"
              >
                <SimpleIconsGithub />
              </Link>
              <Link
                href="https://ko-fi.com/uxuz"
                aria-label="Ko-Fi"
                target="_blank"
                className="bg-dim/5 border-dim/5 text-dim hover:bg-dim/10 ml-auto flex size-10 items-center justify-center rounded-xl border transition-colors [&>svg]:text-xl"
              >
                <SimpleIconsKofi />
              </Link>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
