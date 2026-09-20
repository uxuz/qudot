import { Suspense } from "react";

import { CollectiblesClient } from "@/app/(root)/CollectiblesClient";
import { LucideArrowRight } from "@/components/icons/Lucide";
import { LinkButton } from "@/components/shared/LinkButton";
import { PageIntro } from "@/components/shared/PageIntro";
import { collectiblesViewSchema, parseViewFromRecord } from "@/lib/view-params";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const initialView = parseViewFromRecord(
    collectiblesViewSchema,
    await searchParams,
  );

  return (
    <>
      <PageIntro
        title="Find every Reddit Collectible Avatar ever released in the shop."
        description="Free, static and open source. Looking for a specific creator or want to search by display name? Head to the creators page to search and explore every creator."
      >
        <LinkButton href="/creators">
          Explore Creators <LucideArrowRight />
        </LinkButton>
      </PageIntro>
      <Suspense>
        <CollectiblesClient initialView={initialView} />
      </Suspense>
    </>
  );
}
