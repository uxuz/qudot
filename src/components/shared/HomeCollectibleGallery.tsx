"use client";

import { collectiblesPreview } from "@/data/data";
import { CollectibleGallery } from "./CollectibleGallery";

export function HomeCollectibleGallery(props: React.ComponentProps<"div">) {
  return <CollectibleGallery {...props} collectibles={collectiblesPreview} />;
}
