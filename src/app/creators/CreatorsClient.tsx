"use client";

import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { VirtualCreatorGrid } from "./VirtualCreatorGrid";
import { FilterBar, SortDir, SortOption } from "@/components/shared/FilterBar";
import { Creator, CreatorStats } from "@/data/data.types";

type SortKey = "name" | "collectibles" | "revenue";

const SORT_OPTIONS: SortOption<SortKey>[] = [
  { key: "revenue", label: "Revenue" },
  { key: "collectibles", label: "Collection Size" },
  { key: "name", label: "Name" },
];

export default function Creators({
  creators,
  creatorStats,
}: {
  creators: Creator[];
  creatorStats: CreatorStats;
}) {
  const [sort, setSort] = useState<SortKey>("revenue");
  const [dir, setDir] = useState<SortDir>("desc");
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
    let delta = 0;

    if (sort === "name") {
      delta = a.username.localeCompare(b.username);
    } else {
      const aStats = creatorStats[a.username] ?? {
        collectiblesCount: 0,
        revenue: 0,
      };
      const bStats = creatorStats[b.username] ?? {
        collectiblesCount: 0,
        revenue: 0,
      };
      if (sort === "collectibles")
        delta = aStats.collectiblesCount - bStats.collectiblesCount;
      if (sort === "revenue") delta = aStats.revenue - bStats.revenue;
    }

    return dir === "asc" ? delta : -delta;
  });

  const rows: (typeof sorted)[] = [];
  for (let i = 0; i < sorted.length; i += columns) {
    rows.push(sorted.slice(i, i + columns));
  }

  return (
    <div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search Creators"
        sortOptions={SORT_OPTIONS}
        activeSort={sort}
        onSortChange={setSort}
        dir={dir}
        onDirChange={setDir}
        highlightId="creators-sort"
      />

      <section className="px-horizontal mt-4">
        <VirtualCreatorGrid
          key={`${columns}-${query}`}
          rows={rows}
          stats={creatorStats}
        />
      </section>
    </div>
  );
}
