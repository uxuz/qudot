import { Suspense } from "react";

import { creators, creatorStats } from "@/data/data";
import Creators from "./CreatorsClient";
import { createPageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/shared/PageIntro";

export const metadata = createPageMetadata({
  title: "Creators | Qudot",
  description:
    "Every creator behind Reddit Collectible Avatars, all of them, all at once.",
});

export default function CreatorsPage() {
  return (
    <>
      <PageIntro
        title="Every creator, all of them, all at once."
        description="Browse and explore every creator. Search by display name or username, sort and reorder the results to find exactly who you are looking for."
      />
      <Suspense>
        <Creators creators={creators} creatorStats={creatorStats} />
      </Suspense>
    </>
  );
}
