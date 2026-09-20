"use client";

import { useMediaQuery } from "usehooks-ts";

import { VirtualCreatorsGrid } from "./VirtualCreatorsGrid";
import { ViewControls } from "@/components/shared/ViewControls";
import { Creator, CreatorStats } from "@/data/data.types";
import { useQueryViewState } from "@/lib/useQueryViewState";
import { CREATOR_SORT_OPTIONS, creatorsViewSchema } from "@/lib/view-params";

export default function Creators({
  creators,
  creatorStats,
}: {
  creators: Creator[];
  creatorStats: CreatorStats;
}) {
  const [view, setField] = useQueryViewState(creatorsViewSchema);
  const { search, sort, dir } = view;

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
      <ViewControls
        search={search}
        onSearchChange={(value) => setField("search", value)}
        searchPlaceholder="Search Creators"
        sortOptions={CREATOR_SORT_OPTIONS}
        activeSort={sort}
        onSortChange={(key) => setField("sort", key)}
        dir={dir}
        onDirChange={(next) => setField("dir", next)}
        highlightId="creators-sort"
      />

      <section className="px-horizontal mt-4">
        <VirtualCreatorsGrid
          key={`${columns}-${query}`}
          rows={rows}
          stats={creatorStats}
        />
      </section>
    </div>
  );
}
