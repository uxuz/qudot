"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  parseViewFromSearch,
  sanitizeView,
  serializeView,
  type ViewSchema,
} from "./view-params";

/**
 * Keeps a view (search + sort + filters) in sync with the query string.
 *
 * Initial state comes from `initialView` when the server resolved it, otherwise
 * from the schema defaults — never from `window` during render, so the first
 * client render always matches the server HTML. The URL is re-read on mount and
 * on every `popstate`, and rewritten with `replaceState` on each change so that
 * tweaking a filter doesn't pile entries up in the back stack.
 */
export function useQueryViewState<T extends object>(
  schema: ViewSchema<T>,
  initialView?: Partial<T>,
) {
  const pathname = usePathname();
  const [view, setView] = useState<T>(() => sanitizeView(schema, initialView));

  useEffect(() => {
    const syncViewFromLocation = () =>
      setView(parseViewFromSearch(schema, window.location.search));

    syncViewFromLocation();
    window.addEventListener("popstate", syncViewFromLocation);
    return () => window.removeEventListener("popstate", syncViewFromLocation);
  }, [pathname, schema]);

  const setField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      const next = { ...view, [field]: value } as T;
      setView(next);

      const query = serializeView(schema, next);
      window.history.replaceState(
        null,
        "",
        `${pathname}${query ? `?${query}` : ""}`,
      );
    },
    [view, pathname, schema],
  );

  return [view, setField] as const;
}
