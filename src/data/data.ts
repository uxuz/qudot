import collectiblesData from "@/data/collectibles.json";
import creatorsData from "@/data/creators.json";
import type { Collectible, Creator } from "@/data/data.types";

export const collectibles = collectiblesData as Collectible[];
export const creators = creatorsData as Creator[];
