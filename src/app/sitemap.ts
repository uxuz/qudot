import type { MetadataRoute } from "next";

import collectiblesData from "@/data/collectibles.json";
import creatorData from "@/data/creators.json";
import type { Collectible, Creator } from "@/data/data.types";

const collectibles = collectiblesData as Collectible[];
const creators = creatorData as Creator[];

export const baseUrl = "https://blurbury.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const creatorUrls: MetadataRoute.Sitemap = creators.map((creator) => ({
    url: `${baseUrl}/${creator.username}`,
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
    ...creatorUrls,
    ...collectibleUrls,
  ];
}
