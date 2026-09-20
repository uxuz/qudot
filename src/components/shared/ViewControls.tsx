"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  LucideSearch,
  LucideArrowUpNarrowWide,
  LucideArrowDownWideNarrow,
} from "@/components/icons/Lucide";
import {
  GENERATION_OPTIONS,
  type Generation,
  type SortDir,
  type SortOption,
} from "@/lib/view-params";
import {
  IconButton,
  controlSurface,
  interactiveSurface,
} from "@/components/shared/IconButton";
import { cn } from "@/lib/utils";

interface ViewControlsProps<T extends string> {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  sortOptions: readonly SortOption<T>[];
  activeSort: T;
  onSortChange: (key: T) => void;

  dir: SortDir;
  onDirChange: (dir: SortDir) => void;

  generation?: Generation;
  onGenerationChange?: (generation: Generation) => void;

  highlightId?: string;
}

export function ViewControls<T extends string>({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  sortOptions,
  activeSort,
  onSortChange,
  dir,
  onDirChange,
  generation,
  onGenerationChange,
  highlightId = "sortHighlight",
}: ViewControlsProps<T>) {
  const anchorRef = useRef<HTMLDivElement>(null);

  const scrollToControls = () => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      if (rect.top < 0) {
        anchorRef.current.scrollIntoView({ behavior: "instant" });
      }
    }
  };

  return (
    <>
      <div ref={anchorRef} className="pointer-events-none h-0 scroll-mt-16" />
      <section className="bg-background sticky top-16 isolate z-30 -mt-3 mb-3 space-y-3 pt-3">
        <div className="px-horizontal flex gap-2">
          <div
            className={cn(
              controlSurface,
              "focus-within:border-dim/10 focus-within:bg-dim/10 relative flex h-10 flex-1 items-center gap-2 px-3",
            )}
          >
            <LucideSearch className="shrink-0" />
            <input
              maxLength={24}
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="text-foreground placeholder:text-dim w-full outline-none"
            />
          </div>

          {generation !== undefined && (
            <select
              value={generation}
              onChange={(e) =>
                onGenerationChange?.(e.target.value as Generation)
              }
              className={cn(
                interactiveSurface,
                "hover:text-foreground h-10 shrink-0 appearance-none px-3 text-center outline-0",
              )}
            >
              {GENERATION_OPTIONS.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          )}
          <IconButton
            onClick={() => onDirChange(dir === "asc" ? "desc" : "asc")}
            aria-label={dir === "asc" ? "Sort ascending" : "Sort descending"}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={dir}
                onClick={() => scrollToControls()}
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
          </IconButton>
        </div>

        <div className="border-dim/10 px-horizontal flex items-center gap-2 border-b">
          <nav className="text-dim scrollbar-hidden relative flex w-full overflow-clip overflow-x-scroll font-semibold">
            {sortOptions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  scrollToControls();
                  onSortChange(key);
                }}
                className="hover:text-foreground relative mx-2 flex h-10 flex-1 cursor-pointer items-center justify-center text-sm transition-colors select-none"
              >
                {activeSort === key && (
                  <motion.div
                    layoutId={highlightId}
                    layoutDependency={activeSort}
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
      </section>
    </>
  );
}
