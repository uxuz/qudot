"use client";

import { useState, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";

import { collectibles } from "@/data/data";
import { VirtualCollectiblesGallery } from "./VirtualCollectiblesGallery";
import { FilterBar, SortDir, SortOption } from "@/components/shared/FilterBar";

type SortCategory = "default" | "revenue" | "price" | "supply" | "date";

const SORT_OPTIONS: SortOption<SortCategory>[] = [
  { key: "default", label: "Featured" },
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

type ViewState = {
  search: string;
  category: SortCategory;
  dir: SortDir;
};

function getInitialState(): ViewState {
  if (typeof window === "undefined") {
    return {
      search: "",
      category: "default",
      dir: "desc",
    };
  }

  const p = new URLSearchParams(window.location.search);
  const rawSort = p.get("sort") ?? "default";

  return {
    search: p.get("q") ?? "",
    category: VALID_CATEGORIES.has(rawSort as SortCategory)
      ? (rawSort as SortCategory)
      : "default",
    dir: p.get("dir") === "asc" ? "asc" : "desc",
  };
}

const normalize = (str: string | undefined) =>
  (str ?? "").toLowerCase().replace(/•/g, "");

export function CollectiblesClient(props: React.ComponentProps<"div">) {
  const pathname = usePathname();
  const [view, setView] = useState<ViewState>(getInitialState);
  const { search, category, dir } = view;

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
      const next: ViewState = {
        ...view,
        search: value,
      };
      setView(next);
      updateURL(next.search, next.category, next.dir);
    },
    [view, updateURL],
  );

  const handleSortChange = useCallback(
    (key: SortCategory) => {
      const next: ViewState = {
        ...view,
        category: key,
      };
      setView(next);
      updateURL(next.search, next.category, next.dir);
    },
    [view, updateURL],
  );

  const handleDirChange = useCallback(
    (newDir: SortDir) => {
      const next: ViewState = {
        ...view,
        dir: newDir,
      };
      setView(next);
      updateURL(next.search, next.category, next.dir);
    },
    [view, updateURL],
  );

  const filtered = useMemo(() => {
    const query = normalize(search.trim());

    let result = query
      ? collectibles.filter(
          (c) =>
            normalize(c.name).includes(query) ||
            normalize(c.creator).includes(query),
        )
      : collectibles;

    if (category === "default") {
      const featured = result.filter((c) => c.featuredWeight !== 0);
      return [...featured].sort((a, b) =>
        dir === "desc"
          ? b.featuredWeight - a.featuredWeight
          : a.featuredWeight - b.featuredWeight,
      );
    }

    const getValue = (c: (typeof collectibles)[number]) => {
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

      <div className="min-h-[calc(100vh-105px-64px-12px-48px)]">
        <VirtualCollectiblesGallery collectibles={filtered} />
        {search && category === "default" && (
          <div className="px-horizontal text-dim pt-1 text-center text-xs text-balance">
            Only a small selection is shown here. Try a different category to
            find all collectibles!
          </div>
        )}
      </div>
    </div>
  );
}
