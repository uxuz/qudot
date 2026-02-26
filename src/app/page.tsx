import { HomeCollectibleGallery } from "@/components/custom/CollectibleGalleryAll";

export default function Home() {
  // Reduce the array to just 100 collectibles for development, since rendering 7k collectibles tanks the performance to hell
  return <HomeCollectibleGallery />;
}
