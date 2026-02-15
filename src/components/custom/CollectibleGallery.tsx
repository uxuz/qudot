"use client";

import type { Collectible } from "@/data/data.types";
import { CollectibleCard } from "./CollectibleCard";

// TODO: This needs to be virtualized, as rendering over 7k collectibles kills navigation and performance in general
export function CollectibleGallery({
  collectibles,
}: {
  collectibles: Collectible[];
}) {
  return (
    <div className="w-full">
      <div className="px-horizontal grid grid-cols-2 gap-2 sm:grid-cols-3">
        {collectibles.map((collectible) => {
          return (
            <CollectibleCard
              key={collectible.productId}
              collectible={collectible}
            />
          );
        })}
      </div>
    </div>
  );
}
