import type { MetadataRoute } from "next";

import { collectibles, creators } from "@/data/data";

export const baseUrl = "https://qudot.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const creatorUrls: MetadataRoute.Sitemap = creators.map((creator) => ({
    url: `${baseUrl}/${creator.username.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const collectibleUrls: MetadataRoute.Sitemap = collectibles.map(
    (collectible) => ({
      url: `${baseUrl}/collectibles/${collectible.productId}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/creators`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...creatorUrls,
    ...collectibleUrls,
  ];
}
