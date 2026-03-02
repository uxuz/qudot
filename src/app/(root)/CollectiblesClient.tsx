"use client";

import { useState, useMemo } from "react";

import { collectiblesPreview } from "@/data/data";
import { VirtualCollectiblesGallery } from "./VirtualCollectiblesGallery";
import { FilterBar, SortDir, SortOption } from "@/components/shared/FilterBar";

type SortCategory = "default" | "revenue" | "price" | "supply" | "date";

const SORT_OPTIONS: SortOption<SortCategory>[] = [
  { key: "default", label: "Popular" },
  { key: "revenue", label: "Revenue" },
  { key: "price", label: "Price" },
  { key: "supply", label: "Supply" },
  { key: "date", label: "Date" },
];

const normalize = (str: string | undefined) =>
  (str ?? "").toLowerCase().replace(/•/g, "");

export function CollectiblesClient(props: React.ComponentProps<"div">) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<SortCategory>("default");
  const [dir, setDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const query = normalize(search.trim());

    let result = query
      ? collectiblesPreview.filter(
          (c) =>
            normalize(c.name).includes(query) ||
            normalize(c.creator).includes(query),
        )
      : collectiblesPreview;

    if (category === "default") {
      if (dir === "desc") result = [...result].reverse();
      return result;
    }

    const getValue = (c: (typeof collectiblesPreview)[number]) => {
      switch (category) {
        case "revenue":
          return (c.price ?? 0) * (c.sold ?? 0);
        case "price":
          return c.price ?? 0;
        case "supply":
          return c.supply ?? 0;
        case "date":
          return c.deployedAt ? new Date(c.deployedAt).getTime() : 0;
      }
    };

    return [...result].sort((a, b) => {
      const delta = getValue(a) - getValue(b);
      return dir === "asc" ? delta : -delta;
    });
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

      <VirtualCollectiblesGallery collectibles={filtered} />
    </div>
  );
}
