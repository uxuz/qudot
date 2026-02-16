import type { Collectible } from "@/data/data.types";
import { CollectibleCard } from "./CollectibleCard";
import { cn } from "@/lib/utils";

export function CollectibleGallery({
  collectibles,
  className,
  ...props
}: {
  collectibles: Collectible[];
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-horizontal grid grid-cols-2 gap-2 sm:grid-cols-3",
        className,
      )}
      {...props}
    >
      {collectibles.map((collectible) => {
        return (
          <CollectibleCard
            key={collectible.productId}
            collectible={collectible}
          />
        );
      })}
    </div>
  );
}
