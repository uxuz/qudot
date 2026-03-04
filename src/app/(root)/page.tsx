import { Suspense } from "react";

import { CollectiblesClient } from "@/app/(root)/CollectiblesClient";
import { LucideArrowRight } from "@/components/icons/Lucide";
import { LinkButton } from "@/components/shared/LinkButton";

export default function Home() {
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
        <CollectiblesClient />
      </Suspense>
    </>
  );
}
