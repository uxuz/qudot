"use client";

import type { CollectiblePreview } from "@/data/data.types";
import { CollectibleCard } from "./CollectibleCard";
import { cn } from "@/lib/utils";
import { useWindowVirtualizer, useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useRef, useState } from "react";

const BREAKPOINT = { sm: 640 } as const;
const ITEM_RATIO = 5 / 4;
const GAP = { x: 8, y: 8 } as const;

function getColumnsCount(width: number) {
  return width >= BREAKPOINT.sm ? 3 : 2;
}
function getItemWidth(containerWidth: number, cols: number, gapX: number) {
  return (containerWidth - gapX * (cols - 1)) / cols;
}
function getItemHeight(itemWidth: number) {
  return itemWidth * ITEM_RATIO;
}

export function CollectibleGallery({
  collectibles,
  className,
  ...props
}: {
  collectibles: CollectiblePreview[];
} & React.ComponentProps<"div">) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [columns, setColumns] = useState(2);
  const [itemSize, setItemSize] = useState({ width: 0, height: 0 });
  const [scrollMargin, setScrollMargin] = useState(0);

  const handleResize = useCallback((width: number) => {
    const cols = getColumnsCount(width);
    const itemWidth = getItemWidth(width, cols, GAP.x);
    const itemHeight = getItemHeight(itemWidth);
    setColumns(cols);
    setItemSize({ width: itemWidth, height: itemHeight });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setScrollMargin(el.offsetTop);

    const observer = new ResizeObserver(([entry]) => {
      handleResize(entry.contentRect.width);
      setScrollMargin(el.offsetTop);
    });

    observer.observe(el);
    handleResize(el.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, [handleResize]);

  const rowVirtualizer = useWindowVirtualizer({
    count: Math.ceil(collectibles.length / columns),
    estimateSize: () => itemSize.height + GAP.y,
    overscan: 2,
    scrollMargin,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns,
    getScrollElement: () => containerRef.current,
    estimateSize: () => itemSize.width + GAP.x,
    overscan: 0,
  });

  useEffect(() => {
    rowVirtualizer.measure();
    columnVirtualizer.measure();
  }, [itemSize.height, columns]);

  return (
    <div
      ref={containerRef}
      className={cn("px-horizontal", className)}
      {...props}
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) =>
          columnVirtualizer.getVirtualItems().map((virtualColumn) => {
            const itemIndex = virtualRow.index * columns + virtualColumn.index;
            const collectible = collectibles[itemIndex];

            if (!collectible) return null;

            return (
              <div
                key={`${virtualRow.key}-${virtualColumn.key}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: itemSize.width,
                  height: itemSize.height,
                  transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start - scrollMargin}px)`,
                }}
              >
                <CollectibleCard collectible={collectible} />
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
