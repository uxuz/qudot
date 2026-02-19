import Link from "next/link";
import Image from "next/image";
import type { Collectible } from "@/data/data.types";
import { creators } from "@/data/data";

const creatorsByUsername = Object.fromEntries(
  creators.map((creator) => [creator.username, creator]),
);

export function CollectibleCard({ collectible }: { collectible: Collectible }) {
  return (
    <div className="border-dim/10 relative aspect-4/5 overflow-hidden rounded-xl border">
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
        <span className="inline-block w-fit max-w-[calc(100%)] truncate font-bold">
          {collectible.name}
        </span>
        <div className="flex items-center justify-between">
          <Link
            href={`/${collectible.creator.toLowerCase()}`}
            className="text-dim pointer-events-auto inline-block w-fit max-w-[calc(100%)] cursor-pointer truncate"
          >
            <span className="text-foreground">
              {creatorsByUsername[collectible.creator].displayName}
            </span>{" "}
            @{collectible.creator}
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute flex w-full justify-between gap-1 p-2 text-xs">
        <span className="border-dim/10 bg-background/85 rounded-lg border px-1">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(collectible.price / 100)}
        </span>
        <span className="border-dim/10 bg-background/85 rounded-lg border px-1">
          {collectible.sold}/{collectible.supply}
        </span>
      </div>
    </div>
  );
}
