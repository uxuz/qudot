import type { Metadata } from "next";
import { baseUrl } from "@/app/sitemap";

const defaultMetadata: Metadata = {
  metadataBase: baseUrl,
  title: "Qudot",
  description: "",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Qudot",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export function createPageMetadata(
  overrides: Partial<Metadata> = {},
): Metadata {
  return {
    ...defaultMetadata,
    ...overrides,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...overrides.openGraph,
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...overrides.twitter,
    },
  };
}
