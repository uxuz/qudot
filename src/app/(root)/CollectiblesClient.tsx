"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

import { collectibles } from "@/data/data";
import { VirtualCollectiblesGallery } from "./VirtualCollectiblesGallery";
import {
  FilterBar,
  SortDir,
  SortOption,
  Generation,
} from "@/components/shared/FilterBar";

export type SortCategory = "default" | "revenue" | "price" | "supply" | "date";

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

const VALID_GENERATIONS = new Set<Generation>([
  "all",
  "gen1",
  "gen2",
  "gen3",
  "gen4",
]);

type ViewState = {
  search: string;
  category: SortCategory;
  dir: SortDir;
  generation: Generation;
};

export type CollectiblesViewState = ViewState;

interface CollectiblesClientProps extends React.ComponentProps<"div"> {
  initialView?: ViewState;
}

const DEFAULT_VIEW: ViewState = {
  search: "",
  category: "default",
  dir: "desc",
  generation: "all",
};

const normalize = (str: string | undefined) =>
  (str ?? "").toLowerCase().replace(/•/g, "");

const parseViewFromLocation = (): ViewState => {
  if (typeof window === "undefined") return DEFAULT_VIEW;

  const params = new URLSearchParams(window.location.search);
  const rawSort = params.get("sort") ?? "default";
  const rawGeneration = params.get("gen") ?? "all";

  return {
    search: params.get("q") ?? "",
    category: VALID_CATEGORIES.has(rawSort as SortCategory)
      ? (rawSort as SortCategory)
      : DEFAULT_VIEW.category,
    dir: params.get("dir") === "asc" ? "asc" : DEFAULT_VIEW.dir,
    generation:
      rawGeneration && VALID_GENERATIONS.has(rawGeneration as Generation)
        ? (rawGeneration as Generation)
        : DEFAULT_VIEW.generation,
  };
};

export function CollectiblesClient({
  initialView,
  ...divProps
}: CollectiblesClientProps) {
  const pathname = usePathname();

  const safeInitialView: ViewState = initialView
    ? {
        search: initialView.search ?? DEFAULT_VIEW.search,
        category: VALID_CATEGORIES.has(initialView.category)
          ? initialView.category
          : DEFAULT_VIEW.category,
        dir: initialView.dir === "asc" ? "asc" : "desc",
        generation: initialView.generation ?? DEFAULT_VIEW.generation,
      }
    : DEFAULT_VIEW;

  const [view, setView] = useState<ViewState>(safeInitialView);
  const { search, category, dir, generation } = view;

  useEffect(() => {
    const syncViewFromLocation = () => {
      setView(parseViewFromLocation());
    };

    syncViewFromLocation();
    window.addEventListener("popstate", syncViewFromLocation);
    return () => window.removeEventListener("popstate", syncViewFromLocation);
  }, [pathname]);

  const updateURL = useCallback(
    (q: string, sort: SortCategory, d: SortDir, gen: Generation) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (sort !== "default") params.set("sort", sort);
      if (d !== "desc") params.set("dir", d);
      if (gen !== "all") params.set("gen", gen);
      const query = params.toString();
      const nextUrl = `${pathname}${query ? `?${query}` : ""}`;
      window.history.pushState(null, "", nextUrl);
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
      updateURL(next.search, next.category, next.dir, next.generation);
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
      updateURL(next.search, next.category, next.dir, next.generation);
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
      updateURL(next.search, next.category, next.dir, next.generation);
    },
    [view, updateURL],
  );

  const handleGenerationChange = useCallback(
    (newGen: Generation) => {
      const next: ViewState = {
        ...view,
        generation: newGen,
      };
      setView(next);
      updateURL(next.search, next.category, next.dir, next.generation);
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

    // Filter by generation
    if (generation !== "all") {
      const genTag =
        generation === "gen1"
          ? "cp1"
          : generation === "gen2"
            ? "cp2"
            : generation === "gen3"
              ? "cp3"
              : "cp4";
      result = result.filter((c) => c.tags?.includes(genTag));
    }

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
  }, [search, category, dir, generation]);

  return (
    <div {...divProps}>
      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search Collectibles"
        sortOptions={SORT_OPTIONS}
        activeSort={category}
        onSortChange={handleSortChange}
        dir={dir}
        onDirChange={handleDirChange}
        generation={generation}
        onGenerationChange={handleGenerationChange}
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
