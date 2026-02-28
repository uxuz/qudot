"use client";

import { useState, useMemo } from "react";

import { collectiblesPreview } from "@/data/data";
import { CollectibleGallery } from "./CollectibleGallery";
import { FilterBar, SortDir, SortOption } from "@/components/shared/FilterBar";

type SortCategory = "default" | "price" | "supply" | "date";

const SORT_OPTIONS: SortOption<SortCategory>[] = [
  { key: "default", label: "Hot" },
  { key: "price", label: "Price" },
  { key: "supply", label: "Supply" },
  { key: "date", label: "Date" },
];

export function HomeCollectibleGallery(props: React.ComponentProps<"div">) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<SortCategory>("default");
  const [dir, setDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = query
      ? collectiblesPreview.filter(
          (c) =>
            c.name?.toLowerCase().includes(query) ||
            c.creator?.toLowerCase().includes(query),
        )
      : collectiblesPreview;

    if (category === "default") {
      if (dir === "desc") result = [...result].reverse();
    } else {
      result = [...result].sort((a, b) => {
        let delta = 0;

        if (category === "price") {
          delta = (a.price ?? 0) - (b.price ?? 0);
        } else if (category === "supply") {
          delta = (a.supply ?? 0) - (b.supply ?? 0);
        } else if (category === "date") {
          const aTime = a.deployedAt ? new Date(a.deployedAt).getTime() : 0;
          const bTime = b.deployedAt ? new Date(b.deployedAt).getTime() : 0;
          delta = aTime - bTime;
        }

        return dir === "asc" ? delta : -delta;
      });
    }

    return result;
  }, [search, category, dir]);

  return (
    <div {...props}>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search Collectibles"
        sortOptions={SORT_OPTIONS}
        activeSort={category}
        onSortChange={setCategory}
        dir={dir}
        onDirChange={setDir}
        highlightId="collectibles-sort"
      />

      <CollectibleGallery collectibles={filtered} />
    </div>
  );
}
