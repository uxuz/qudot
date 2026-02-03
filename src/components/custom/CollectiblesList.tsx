"use client";

import collectiblesData from "@/data/collectibles.json";
import type { Collectible } from "@/data/collectibles.types";

import Link from "next/link";

const collectibles = collectiblesData as Collectible[];

export default function CollectiblesPageNotVirtual() {
  return (
    <div className="w-full">
      <div className="divide-dim divide-y divide-dashed">
        {collectibles.map((collectible) => {
          return (
            <div key={collectible.productId}>
              <Link href={`/collectibles/${collectible.productId}`}>
                <div className="flex items-center justify-between truncate font-medium">
                  <span className="truncate">{collectible.name}</span>
                  <span className="tabular-nums">
                    ${(collectible.price / 100).toFixed(2)}
                  </span>
                </div>

                <div className="text-muted-foreground flex justify-between">
                  <span className="tabular-nums">
                    {collectible.sold}/{collectible.supply}
                  </span>
                  <span>{collectible.creator}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
