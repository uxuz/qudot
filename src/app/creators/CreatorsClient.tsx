"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

import { VirtualCreatorsGrid } from "./VirtualCreatorsGrid";
import { FilterBar, SortDir, SortOption } from "@/components/shared/FilterBar";
import { Creator, CreatorStats } from "@/data/data.types";

type SortKey = "name" | "collectibles" | "revenue";

const SORT_OPTIONS: SortOption<SortKey>[] = [
  { key: "revenue", label: "Revenue" },
  { key: "collectibles", label: "Collection Size" },
  { key: "name", label: "Name" },
];

const VALID_SORT_KEYS = new Set<SortKey>(["name", "collectibles", "revenue"]);

export default function Creators({
  creators,
  creatorStats,
}: {
  creators: Creator[];
  creatorStats: CreatorStats;
}) {
  const pathname = usePathname();

  // Always start with defaults to match SSR output, then sync from URL after mount
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("revenue");
  const [dir, setDir] = useState<SortDir>("desc");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const rawSort = p.get("sort") ?? "revenue";
    setSearch(p.get("q") ?? "");
    setSort(
      VALID_SORT_KEYS.has(rawSort as SortKey)
        ? (rawSort as SortKey)
        : "revenue",
    );
    setDir(p.get("dir") === "asc" ? "asc" : "desc");
  }, []);

  const isSmUp = useMediaQuery("(min-width: 640px)", {
    initializeWithValue: false,
  });
  const columns = isSmUp ? 2 : 1;

  const updateURL = useCallback(
    (q: string, s: SortKey, d: SortDir) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (s !== "revenue") params.set("sort", s);
      if (d !== "desc") params.set("dir", d);
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        `${pathname}${query ? `?${query}` : ""}`,
      );
    },
    [pathname],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      updateURL(value, sort, dir);
    },
    [sort, dir, updateURL],
  );

  const handleSortChange = useCallback(
    (key: SortKey) => {
      setSort(key);
      updateURL(search, key, dir);
    },
    [search, dir, updateURL],
  );

  const handleDirChange = useCallback(
    (newDir: SortDir) => {
      setDir(newDir);
      updateURL(search, sort, newDir);
    },
    [search, sort, updateURL],
  );

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
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search Creators"
        sortOptions={SORT_OPTIONS}
        activeSort={sort}
        onSortChange={handleSortChange}
        dir={dir}
        onDirChange={handleDirChange}
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
