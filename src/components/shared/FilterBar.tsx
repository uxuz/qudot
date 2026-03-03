"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  LucideSearch,
  LucideX,
  LucideArrowUpNarrowWide,
  LucideArrowDownWideNarrow,
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
  return (
    <section className="mb-3 space-y-3">
      <div className="border-dim/10 px-horizontal flex items-center gap-2 border-b">
        <nav className="text-dim relative flex w-full overflow-clip font-semibold">
          {sortOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                onSortChange(key);
              }}
              className="hover:text-foreground relative mx-2 flex h-10 flex-1 cursor-pointer items-center justify-center text-sm transition-colors select-none"
            >
              {activeSort === key && (
                <motion.div
                  layoutId={highlightId}
                  className="absolute inset-0 border-b-2 border-blue-500"
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
      </div>

      <div className="px-horizontal flex gap-2">
        <div className="border-dim/5 text-dim bg-dim/5 focus-within:border-dim/10 focus-within:bg-dim/10 relative flex h-10 flex-1 items-center gap-2 rounded-xl border px-3">
          <LucideSearch className="shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="text-foreground placeholder:text-dim w-full text-sm outline-none"
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
        <button
          onClick={() => onDirChange(dir === "asc" ? "desc" : "asc")}
          className="border-dim/5 bg-dim/5 text-dim hover:text-foreground hover:bg-dim/10 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-colors [&_svg]:text-xl"
          aria-label={dir === "asc" ? "Sort ascending" : "Sort descending"}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={dir}
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                duration: 0.3,
                bounce: 0,
              }}
            >
              {dir === "asc" ? (
                <LucideArrowUpNarrowWide />
              ) : (
                <LucideArrowDownWideNarrow />
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>
    </section>
  );
}
