/**
 * Single source of truth for the filter/sort state that the collectibles and
 * creators pages keep in the URL.
 *
 * A view is described by a `ViewSchema`: one `ParamCodec` per field, owning that
 * field's query key, default value and validation. Everything else — parsing on
 * the server, parsing on the client, serializing back to a query string — is
 * derived from the schema, so adding a sort option or a filter is a single edit
 * here instead of matching changes in the page, the client and the filter bar.
 */

export type SortDir = "asc" | "desc";

export interface SortOption<T extends string> {
  key: T;
  label: string;
}

/* -------------------------------------------------------------------------- */
/* Options — these arrays drive the UI *and* the validation                    */
/* -------------------------------------------------------------------------- */

export const COLLECTIBLE_SORT_OPTIONS = [
  { key: "default", label: "Featured" },
  { key: "revenue", label: "Revenue" },
  { key: "price", label: "Price" },
  { key: "supply", label: "Supply" },
  { key: "date", label: "Date" },
] as const satisfies readonly SortOption<string>[];

export type CollectibleSort = (typeof COLLECTIBLE_SORT_OPTIONS)[number]["key"];

export const CREATOR_SORT_OPTIONS = [
  { key: "revenue", label: "Revenue" },
  { key: "collectibles", label: "Collection Size" },
  { key: "name", label: "Name" },
] as const satisfies readonly SortOption<string>[];

export type CreatorSort = (typeof CREATOR_SORT_OPTIONS)[number]["key"];

/** `tag` is the value carried in `Collectible["tags"]`; `all` filters nothing. */
export const GENERATION_OPTIONS = [
  { key: "all", label: "All", tag: null },
  { key: "gen1", label: "Gen 1", tag: "cp1" },
  { key: "gen2", label: "Gen 2", tag: "cp2" },
  { key: "gen3", label: "Gen 3", tag: "cp3" },
  { key: "gen4", label: "Gen 4", tag: "cp4" },
] as const;

export type Generation = (typeof GENERATION_OPTIONS)[number]["key"];

export function generationTag(generation: Generation): string | null {
  return GENERATION_OPTIONS.find((o) => o.key === generation)?.tag ?? null;
}

const SORT_DIR_OPTIONS = [
  { key: "asc" },
  { key: "desc" },
] as const satisfies readonly { key: SortDir }[];

/* -------------------------------------------------------------------------- */
/* Codecs                                                                      */
/* -------------------------------------------------------------------------- */

export interface ParamCodec<V> {
  /** Query-string key this field lives under. */
  key: string;
  /** Used when the param is absent or invalid, and omitted when serializing. */
  fallback: V;
  /** Narrow a raw query value to a valid one. */
  parse: (raw: string | undefined) => V;
  /** Defaults to `String(value)`. */
  serialize?: (value: V) => string;
}

export type ViewSchema<T> = { [K in keyof T]: ParamCodec<T[K]> };

const stringParam = (key: string): ParamCodec<string> => ({
  key,
  fallback: "",
  parse: (raw) => raw ?? "",
});

const enumParam = <V extends string>(
  key: string,
  fallback: V,
  options: readonly { key: V }[],
): ParamCodec<V> => {
  const allowed = new Set<string>(options.map((option) => option.key));
  return {
    key,
    fallback,
    parse: (raw) =>
      raw !== undefined && allowed.has(raw) ? (raw as V) : fallback,
  };
};

/* -------------------------------------------------------------------------- */
/* Schemas                                                                     */
/* -------------------------------------------------------------------------- */

export interface CollectiblesView {
  search: string;
  category: CollectibleSort;
  dir: SortDir;
  generation: Generation;
}

export const collectiblesViewSchema: ViewSchema<CollectiblesView> = {
  search: stringParam("q"),
  category: enumParam<CollectibleSort>(
    "sort",
    "default",
    COLLECTIBLE_SORT_OPTIONS,
  ),
  dir: enumParam<SortDir>("dir", "desc", SORT_DIR_OPTIONS),
  generation: enumParam<Generation>("gen", "all", GENERATION_OPTIONS),
};

export interface CreatorsView {
  search: string;
  sort: CreatorSort;
  dir: SortDir;
}

export const creatorsViewSchema: ViewSchema<CreatorsView> = {
  search: stringParam("q"),
  sort: enumParam<CreatorSort>("sort", "revenue", CREATOR_SORT_OPTIONS),
  dir: enumParam<SortDir>("dir", "desc", SORT_DIR_OPTIONS),
};

/* -------------------------------------------------------------------------- */
/* Schema-driven parse / serialize                                             */
/* -------------------------------------------------------------------------- */

function fields<T>(schema: ViewSchema<T>): (keyof T)[] {
  return Object.keys(schema) as (keyof T)[];
}

function codecOf<T, K extends keyof T>(schema: ViewSchema<T>, field: K) {
  return schema[field] as ParamCodec<T[K]>;
}

function rawOf<V>(codec: ParamCodec<V>, value: V): string {
  return codec.serialize ? codec.serialize(value) : String(value);
}

/** Parse from a `location.search` string (client). */
export function parseViewFromSearch<T>(
  schema: ViewSchema<T>,
  search: string,
): T {
  const params = new URLSearchParams(search);
  const view = {} as T;
  for (const field of fields(schema)) {
    const codec = codecOf(schema, field);
    view[field] = codec.parse(params.get(codec.key) ?? undefined);
  }
  return view;
}

/** Parse from Next's resolved `searchParams` (server). */
export function parseViewFromRecord<T>(
  schema: ViewSchema<T>,
  record: Record<string, string | string[] | undefined>,
): T {
  const view = {} as T;
  for (const field of fields(schema)) {
    const codec = codecOf(schema, field);
    const raw = record[codec.key];
    view[field] = codec.parse(Array.isArray(raw) ? raw[0] : raw);
  }
  return view;
}

/** Re-validate a partial view, e.g. one handed down from the server. */
export function sanitizeView<T>(schema: ViewSchema<T>, partial?: Partial<T>): T {
  const view = {} as T;
  for (const field of fields(schema)) {
    const codec = codecOf(schema, field);
    const value = partial?.[field];
    view[field] =
      value === undefined ? codec.fallback : codec.parse(rawOf(codec, value));
  }
  return view;
}

/** Serialize to a query string, omitting every field left at its default. */
export function serializeView<T>(schema: ViewSchema<T>, view: T): string {
  const params = new URLSearchParams();
  for (const field of fields(schema)) {
    const codec = codecOf(schema, field);
    const value = view[field];
    if (Object.is(value, codec.fallback)) continue;
    const raw = rawOf(codec, value);
    if (raw) params.set(codec.key, raw);
  }
  return params.toString();
}
