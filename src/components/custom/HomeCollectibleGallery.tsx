"use client";

import { collectiblesPreview } from "@/data/data";
import { CollectibleGallery } from "./CollectibleGallery";

type Props = Omit<
  React.ComponentProps<typeof CollectibleGallery>,
  "collectibles"
>;

export function HomeCollectibleGallery(props: Props) {
  return <CollectibleGallery {...props} collectibles={collectiblesPreview} />;
}
