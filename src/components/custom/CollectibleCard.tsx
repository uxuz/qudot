"use client";

import Link from "next/link";
import Image from "next/image";
import type { Collectible } from "@/data/data.types";

// TODO: Ported from qudot.app, redesign and new props needed (creator data is no longer part of a collectible)
export function CollectibleCard({ collectible }: { collectible: Collectible }) {
  return (
    <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-white/5 has-[:first-child:focus-visible]:ring-2 has-[:first-child:focus-visible]:ring-blue-500 has-[:first-child:focus-visible]:outline-1 has-[:first-child:focus-visible]:outline-offset-2 has-[:first-child:focus-visible]:outline-white">
      <Link href={`/collectibles/${collectible.productId}`}>
        <div className="absolute inset-0 h-full w-full">
          <Image
            className="absolute inset-0 h-full w-full scale-120 transform object-cover object-bottom"
            alt={`${collectible.name} by ${collectible.creator} (@${collectible.creator})`}
            src={collectible.previewUrl}
            width={552}
            height={736}
            unoptimized
          />
        </div>
      </Link>
      <div className="pointer-events-none absolute bottom-0 isolate flex w-full flex-col p-2 text-xs before:absolute before:inset-0 before:-z-1 before:-ml-[50%] before:h-[200%] before:w-[200%] before:-translate-y-4 before:bg-black/85 before:blur-xl">
        <span className="inline-block w-fit max-w-[calc(100%)] truncate font-semibold">
          {collectible.name}
        </span>
        <div className="flex items-center justify-between">
          <Link
            href={`/${collectible.creator}`}
            className="text-secondary pointer-events-auto inline-block w-fit max-w-[calc(100%)] cursor-pointer truncate"
          >
            @{collectible.creator}
          </Link>
          <span className="rounded-lg border border-white/5 bg-black/50 px-1">
            ${(collectible.price / 100).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="pointer-events-none absolute flex w-full justify-between gap-1 p-2 text-xs">
        <span className="rounded-lg border border-white/5 bg-black/75 px-1">
          #{collectible.sold}
        </span>
      </div>
    </div>
  );
}
