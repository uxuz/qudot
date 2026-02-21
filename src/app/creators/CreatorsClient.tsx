"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useMediaQuery } from "usehooks-ts";

import { VirtualCreatorGrid } from "./VirtualCreatorGrid";
import { LucideSearch, LucideX } from "@/components/icons/Lucide";
import { Creator, CreatorStats } from "@/data/data.types";

type SortKey = "name" | "collectibles" | "revenue";

export default function Creators({
  creators,
  creatorStats,
}: {
  creators: Creator[];
  creatorStats: CreatorStats;
}) {
  const [sort, setSort] = useState<SortKey>("revenue");
  const [search, setSearch] = useState("");
  const isSmUp = useMediaQuery("(min-width: 640px)", {
    initializeWithValue: false,
  });
  const columns = isSmUp ? 2 : 1;

  const query = search.trim().toLowerCase();
  const filtered = query
    ? creators.filter(
        (c) =>
          c.displayName.toLowerCase().includes(query) ||
          c.username.toLowerCase().includes(query),
      )
    : creators;

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "name") {
      return a.displayName.localeCompare(b.displayName);
    }
    const aStats = creatorStats[a.username] ?? { count: 0, revenue: 0 };
    const bStats = creatorStats[b.username] ?? { count: 0, revenue: 0 };
    if (sort === "collectibles")
      return bStats.collectiblesCount - aStats.collectiblesCount;
    if (sort === "revenue") return bStats.revenue - aStats.revenue;
    return 0;
  });

  const rows: (typeof sorted)[] = [];
  for (let i = 0; i < sorted.length; i += columns) {
    rows.push(sorted.slice(i, i + columns));
  }

  return (
    <div className="px-horizontal space-y-6">
      <section className="space-y-2">
        <div className="border-dim/10 text-dim relative flex w-full items-center gap-2 rounded-xl border px-3">
          <LucideSearch />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creators..."
            className="text-foreground placeholder:text-dim h-10 w-full bg-transparent text-sm outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-dim hover:text-foreground cursor-pointer transition-colors"
              aria-label="Clear search"
            >
              <LucideX />
            </button>
          )}
        </div>

        <nav className="border-dim/10 text-dim relative grid w-full grid-cols-3 overflow-clip rounded-xl border">
          {(["revenue", "collectibles", "name"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className="hover:text-foreground relative flex h-9 cursor-pointer items-center justify-center px-3 capitalize transition-colors select-none"
            >
              {sort === key && (
                <motion.div
                  layoutId="sortHighlight"
                  className="ring-dim/10 bg-dim/5 absolute inset-0 rounded-xl ring"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{key}</span>
            </button>
          ))}
        </nav>
      </section>

      <VirtualCreatorGrid
        key={`${columns}-${query}`}
        rows={rows}
        stats={creatorStats}
      />
    </div>
  );
}
