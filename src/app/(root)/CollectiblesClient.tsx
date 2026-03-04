"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

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

const VALID_CATEGORIES = new Set<SortCategory>([
  "default",
  "revenue",
  "price",
  "supply",
  "date",
]);

const normalize = (str: string | undefined) =>
  (str ?? "").toLowerCase().replace(/•/g, "");

export function CollectiblesClient(props: React.ComponentProps<"div">) {
  const pathname = usePathname();

  // Always start with defaults to match SSR output, then sync from URL after mount
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<SortCategory>("default");
  const [dir, setDir] = useState<SortDir>("desc");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const rawSort = p.get("sort") ?? "default";
    setSearch(p.get("q") ?? "");
    setCategory(
      VALID_CATEGORIES.has(rawSort as SortCategory)
        ? (rawSort as SortCategory)
        : "default",
    );
    setDir(p.get("dir") === "asc" ? "asc" : "desc");
  }, []);

  const updateURL = useCallback(
    (q: string, sort: SortCategory, d: SortDir) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (sort !== "default") params.set("sort", sort);
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
      updateURL(value, category, dir);
    },
    [category, dir, updateURL],
  );

  const handleSortChange = useCallback(
    (key: SortCategory) => {
      setCategory(key);
      updateURL(search, key, dir);
    },
    [search, dir, updateURL],
  );

  const handleDirChange = useCallback(
    (newDir: SortDir) => {
      setDir(newDir);
      updateURL(search, category, newDir);
    },
    [search, category, updateURL],
  );

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
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search Collectibles"
        sortOptions={SORT_OPTIONS}
        activeSort={category}
        onSortChange={handleSortChange}
        dir={dir}
        onDirChange={handleDirChange}
        highlightId="collectibles-sort"
      />

      <VirtualCollectiblesGallery collectibles={filtered} />
    </div>
  );
}
