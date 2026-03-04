import { Suspense } from "react";

import { creators, creatorStats } from "@/data/data";
import Creators from "./CreatorsClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Creators | Qudot",
  description:
    "Every creator behind Reddit Collectible Avatars, all in one organized place.",
});

export default function CreatorsPage() {
  return (
    <>
      <section className="px-horizontal my-12 space-y-3">
        <h1 className="text-xl font-bold tracking-tight text-balance">
          Just the creators, all of them and at one place.
        </h1>
        <p className="text-dim text-pretty">
          Browse and explore every creator with ease. Search by display name or
          username, sort and reorder the results to find exactly who you are
          looking for.
        </p>
      </section>
      <Suspense>
        <Creators creators={creators} creatorStats={creatorStats} />
      </Suspense>
    </>
  );
}
