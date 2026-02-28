"use client";

import { motion } from "motion/react";
import {
  LucideSearch,
  LucideX,
  LucideArrowUpNarrowWide,
  LucideArrowDownNarrowWide,
} from "@/components/icons/Lucide";

export type SortDir = "asc" | "desc";

export interface SortOption<T extends string> {
  key: T;
  label: string;
}

interface FilterBarProps<T extends string> {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  sortOptions: SortOption<T>[];
  activeSort: T;
  onSortChange: (key: T) => void;

  dir: SortDir;
  onDirChange: (dir: SortDir) => void;

  highlightId?: string;
}

export function FilterBar<T extends string>({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  sortOptions,
  activeSort,
  onSortChange,
  dir,
  onDirChange,
  highlightId = "sortHighlight",
}: FilterBarProps<T>) {
  const activeSortOption = sortOptions.find((o) => o.key === activeSort);

  return (
    <section className="border-dim/10 px-horizontal mb-3 space-y-2 border-b pb-3">
      <div className="border-dim/5 text-dim bg-dim/5 focus-within:border-dim/10 focus-within:bg-dim/10 relative flex w-full items-center gap-2 rounded-xl border px-3">
        <LucideSearch />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="text-foreground placeholder:text-dim h-10 w-full text-sm outline-none"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="text-dim hover:text-foreground cursor-pointer transition-colors"
            aria-label="Clear search"
          >
            <LucideX />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <nav className="border-dim/10 text-dim bg-dim/5 relative flex min-w-0 flex-1 overflow-clip rounded-xl border">
          {sortOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                onSortChange(key);
              }}
              className="hover:text-foreground relative flex h-10 flex-1 cursor-pointer items-center justify-center px-2 text-sm transition-colors select-none"
            >
              {activeSort === key && (
                <motion.div
                  layoutId={highlightId}
                  className="ring-dim/10 bg-dim/5 absolute inset-0 rounded-xl ring"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${activeSort === key ? "text-foreground" : ""}`}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>

        <button
          onClick={() => onDirChange(dir === "asc" ? "desc" : "asc")}
          className={`border-dim/10 bg-dim/5 text-dim hover:text-foreground } flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-opacity [&>svg]:text-xl`}
          aria-label={dir === "asc" ? "Sort ascending" : "Sort descending"}
        >
          {dir === "asc" ? (
            <LucideArrowUpNarrowWide />
          ) : (
            <LucideArrowDownNarrowWide />
          )}
        </button>
      </div>
    </section>
  );
}
