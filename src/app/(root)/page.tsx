import { Suspense } from "react";

import {
  CollectiblesClient,
  type CollectiblesViewState,
  type SortCategory,
} from "@/app/(root)/CollectiblesClient";
import { LucideArrowRight } from "@/components/icons/Lucide";
import { LinkButton } from "@/components/shared/LinkButton";

type HomeSearchParams = {
  q?: string | string[];
  sort?: string | string[];
  dir?: string | string[];
  gen?: string | string[];
};

const VALID_SORTS = new Set<SortCategory>([
  "default",
  "revenue",
  "price",
  "supply",
  "date",
]);

const VALID_GENERATIONS = new Set(["all", "gen1", "gen2", "gen3", "gen4"]);

const isGeneration = (
  value: string | undefined,
): value is CollectiblesViewState["generation"] =>
  Boolean(
    value &&
    VALID_GENERATIONS.has(value as CollectiblesViewState["generation"]),
  );

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}) {
  const params = await searchParams;
  const rawSort = firstValue(params.sort);
  const rawGeneration = firstValue(params.gen);
  const initialView: CollectiblesViewState = {
    search: firstValue(params.q) ?? "",
    category:
      rawSort && VALID_SORTS.has(rawSort as SortCategory)
        ? (rawSort as SortCategory)
        : "default",
    dir: firstValue(params.dir) === "asc" ? "asc" : "desc",
    generation: isGeneration(rawGeneration) ? rawGeneration : "all",
  };

  return (
    <>
      <section className="px-horizontal my-12 space-y-3">
        <h1 className="text-xl font-bold tracking-tight text-balance">
          Find every Reddit Collectible Avatar ever released in the shop.
        </h1>
        <p className="text-dim text-pretty">
          Free, static and open source. Looking for a specific creator or want
          to search by display name? Head to the creators page to search and
          explore every creator.
        </p>
        <LinkButton href="/creators">
          Explore Creators <LucideArrowRight />
        </LinkButton>
      </section>
      <Suspense>
        <CollectiblesClient initialView={initialView} />
      </Suspense>
    </>
  );
}
