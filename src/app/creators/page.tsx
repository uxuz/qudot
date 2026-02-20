"use client";

import Link from "next/link";
import { useState } from "react";

import { collectibles, creators } from "@/data/data";
import { Avatar } from "@/components/custom/Avatar";

type SortKey = "name" | "collectibles" | "revenue";

export default function Creators() {
  const [sort, setSort] = useState<SortKey>("revenue");

  const stats = collectibles.reduce(
    (acc, item) => {
      const key = item.creator;
      if (!acc[key]) {
        acc[key] = { count: 0, revenue: 0 };
      }
      acc[key].count += 1;
      acc[key].revenue += (item.sold * item.price) / 100;
      return acc;
    },
    {} as Record<string, { count: number; revenue: number }>,
  );

  const sorted = [...creators].sort((a, b) => {
    if (sort === "name") {
      return a.displayName.localeCompare(b.displayName);
    }
    const aStats = stats[a.username] ?? { count: 0, revenue: 0 };
    const bStats = stats[b.username] ?? { count: 0, revenue: 0 };
    if (sort === "collectibles") return bStats.count - aStats.count;
    if (sort === "revenue") return bStats.revenue - aStats.revenue;
    return 0;
  });

  return (
    <div className="px-horizontal space-y-6">
      <div className="flex gap-2">
        {(["revenue", "collectibles", "name"] as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className={`h-9 rounded-xl px-2 font-medium capitalize transition-colors ${
              sort === key
                ? "bg-foreground text-background"
                : "text-dim hover:text-foreground"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((creator) => {
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
              <div>
                <div className="font-bold">{creator.displayName}</div>
                <div className="text-dim">@{creator.username}</div>
                <div className="text-dim">
                  <span className="text-foreground font-bold">
                    {creatorStats.count}
                  </span>{" "}
                  {creatorStats.count === 1 ? "Collectible" : "Collectibles"}
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
}
