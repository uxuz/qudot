"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";

import { collectiblesPreview } from "@/data/data";
import { CollectibleGallery } from "./CollectibleGallery";
import {
  LucideSearch,
  LucideX,
  LucideArrowUpNarrowWide,
  LucideArrowDownNarrowWide,
} from "@/components/icons/Lucide";

type SortCategory = "default" | "price" | "supply" | "date";
type SortDir = "asc" | "desc";

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

    if (category !== "default") {
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

  const categories: { key: SortCategory; label: string }[] = [
    { key: "default", label: "Popular" },
    { key: "price", label: "Price" },
    { key: "supply", label: "Supply" },
    { key: "date", label: "Date" },
  ];

  return (
    <div {...props}>
      <section className="border-dim/10 px-horizontal mb-3 space-y-2 border-b pb-3">
        {/* Search */}
        <div className="border-dim/5 text-dim bg-dim/5 focus-within:border-dim/10 focus-within:bg-dim/10 relative flex w-full items-center gap-2 rounded-xl border px-3">
          <LucideSearch />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Collectibles"
            className="text-foreground placeholder:text-dim h-10 w-full text-sm outline-none"
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

        {/* Sort row */}
        <div className="flex items-center gap-2">
          {/* Category tabs */}
          <nav className="border-dim/10 text-dim bg-dim/5 relative flex min-w-0 flex-1 overflow-clip rounded-xl border">
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setCategory(key);
                  if (key === "default") setDir("asc");
                }}
                className="hover:text-foreground relative flex h-10 flex-1 cursor-pointer items-center justify-center px-2 text-sm transition-colors select-none"
              >
                {category === key && (
                  <motion.div
                    layoutId="sortHighlight"
                    className="ring-dim/10 bg-dim/5 absolute inset-0 rounded-xl ring"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${category === key ? "text-foreground" : ""}`}
                >
                  {label}
                </span>
              </button>
            ))}
          </nav>

          {/* Single asc/desc toggle button */}
          <button
            onClick={() => setDir((d) => (d === "asc" ? "desc" : "asc"))}
            className={`border-dim/10 bg-dim/5 text-dim hover:text-foreground flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-opacity ${category === "default" ? "pointer-events-none opacity-35" : ""}`}
            aria-label={dir === "asc" ? "Sort ascending" : "Sort descending"}
          >
            {dir === "asc" ? (
              <LucideArrowUpNarrowWide className="h-4 w-4" />
            ) : (
              <LucideArrowDownNarrowWide className="h-4 w-4" />
            )}
          </button>
        </div>
      </section>

      <CollectibleGallery collectibles={filtered} />
    </div>
  );
}
