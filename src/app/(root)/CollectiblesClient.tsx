"use client";

import { useMemo } from "react";

import { collectibles } from "@/data/data";
import { VirtualCollectiblesGallery } from "./VirtualCollectiblesGallery";
import { ViewControls } from "@/components/shared/ViewControls";
import { useQueryViewState } from "@/lib/useQueryViewState";
import {
  COLLECTIBLE_SORT_OPTIONS,
  collectiblesViewSchema,
  generationTag,
  type CollectiblesView,
} from "@/lib/view-params";

interface CollectiblesClientProps extends React.ComponentProps<"div"> {
  initialView?: Partial<CollectiblesView>;
}

const normalize = (str: string | undefined) =>
  (str ?? "").toLowerCase().replace(/•/g, "");

export function CollectiblesClient({
  initialView,
  ...divProps
}: CollectiblesClientProps) {
  const [view, setField] = useQueryViewState(
    collectiblesViewSchema,
    initialView,
  );
  const { search, category, dir, generation } = view;

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
    const tag = generationTag(generation);
    if (tag) {
      result = result.filter((c) => c.tags?.includes(tag));
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
      <ViewControls
        search={search}
        onSearchChange={(value) => setField("search", value)}
        searchPlaceholder="Search Collectibles"
        sortOptions={COLLECTIBLE_SORT_OPTIONS}
        activeSort={category}
        onSortChange={(key) => setField("category", key)}
        dir={dir}
        onDirChange={(next) => setField("dir", next)}
        generation={generation}
        onGenerationChange={(next) => setField("generation", next)}
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
