"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useMediaQuery } from "usehooks-ts";

import { collectibles, creators } from "@/data/data";
import { VirtualCreatorGrid } from "./VirtualCreatorGrid";

type SortKey = "name" | "collectibles" | "revenue";

export default function Creators() {
  const [sort, setSort] = useState<SortKey>("revenue");
  const isSmUp = useMediaQuery("(min-width: 640px)", {
    initializeWithValue: false,
  });
  const columns = isSmUp ? 2 : 1;

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

  const rows: (typeof sorted)[] = [];
  for (let i = 0; i < sorted.length; i += columns) {
    rows.push(sorted.slice(i, i + columns));
  }

  return (
    <div className="px-horizontal space-y-6">
      <nav className="border-dim/10 text-dim relative inline-flex overflow-clip rounded-lg border">
        {(["revenue", "collectibles", "name"] as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className="hover:text-foreground relative flex h-8 cursor-pointer items-center justify-center px-3 capitalize transition-colors select-none"
          >
            {sort === key && (
              <motion.div
                layoutId="sortHighlight"
                className="ring-dim/10 bg-dim/5 absolute inset-0 rounded-md ring"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{key}</span>
          </button>
        ))}
      </nav>

      <VirtualCreatorGrid key={columns} rows={rows} stats={stats} />
    </div>
  );
}
