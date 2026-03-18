import collectiblesData from "@/data/collectibles.json";
import creatorsData from "@/data/creators.json";
import type { Collectible, Creator, CreatorStats } from "@/data/data.types";

export const collectibles = collectiblesData as Collectible[];

export const creators = creatorsData as Creator[];
export const creatorStats = collectibles.reduce((acc, item) => {
  const key = item.creator;
  if (!acc[key]) {
    acc[key] = { collectiblesCount: 0, revenue: 0 };
  }
  acc[key].collectiblesCount += 1;
  acc[key].revenue += (item.sold * item.price) / 100;
  return acc;
}, {} as CreatorStats);
