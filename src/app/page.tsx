import { collectibles } from "@/data/data";
import { CollectibleGallery } from "@/components/custom/CollectibleGallery";

export default function Home() {
  // Reduce the array to just 100 collectibles for development, since rendering 7k collectibles tanks the performance to hell
  return <CollectibleGallery collectibles={collectibles.slice(0, 100)} />;
}
