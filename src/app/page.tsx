import collectiblesData from "@/data/collectibles.json";
import type { Collectible } from "@/data/data.types";
import { CollectibleGallery } from "@/components/custom/CollectibleGallery";

const collectibles = collectiblesData as Collectible[];

export default function Home() {
  return <CollectibleGallery collectibles={collectibles} />;
}
