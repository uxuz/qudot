import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creators | Blurbury",
  description:
    "Every creator behind Reddit Collectible Avatars, all in one organized place.",
};

export default function CreatorMetadataLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
