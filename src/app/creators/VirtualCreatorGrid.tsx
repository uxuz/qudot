import { useRef } from "react";
import Link from "next/link";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import type { Creator } from "@/data/data.types";
import { Avatar } from "@/components/custom/Avatar";

export function VirtualCreatorGrid({
  rows,
  stats,
}: {
  rows: Creator[][];
  stats: Record<string, { count: number; revenue: number }>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 96,
    overscan: 5,
    scrollMargin: containerRef.current?.offsetTop ?? 0,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={containerRef}
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
      }}
    >
      {items.map((virtualRow) => {
        const offsetTop = virtualRow.start - virtualizer.options.scrollMargin;
        const row = rows[virtualRow.index];
        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${offsetTop}px)`,
            }}
          >
            <div className="grid gap-4 pb-4 sm:grid-cols-2">
              {row.map((creator) => {
                const creatorStats = stats[creator.username] ?? {
                  count: 0,
                  revenue: 0,
                };
                return (
                  <Link
                    key={creator.username}
                    href={`/${creator.username.toLowerCase()}`}
                    className="flex gap-3"
                  >
                    <Avatar name={creator.username} size={80} />
                    <div className="overflow-y-hidden">
                      <div className="truncate font-bold">
                        {creator.displayName}
                      </div>
                      <div className="text-dim">@{creator.username}</div>
                      <div className="text-dim">
                        <span className="text-foreground font-bold">
                          {creatorStats.count}
                        </span>{" "}
                        {creatorStats.count === 1
                          ? "Collectible"
                          : "Collectibles"}
                      </div>
                      <div className="text-dim">
                        <span className="text-foreground font-bold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(creatorStats.revenue)}{" "}
                        </span>
                        Revenue
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
