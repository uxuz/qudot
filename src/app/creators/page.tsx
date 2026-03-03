import type { Metadata } from "next";

import { creators, creatorStats } from "@/data/data";
import Creators from "./CreatorsClient";

export const metadata: Metadata = {
  title: "Creators | Blurbury",
  description:
    "Every creator behind Reddit Collectible Avatars, all in one organized place.",
};

export default function CreatorsPage() {
  return (
    <>
      <section className="px-horizontal my-12 space-y-3">
        <h1 className="text-xl font-bold tracking-tight text-balance">
          Creators
        </h1>
        <p className="text-dim">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet omnis ab
          enim doloremque iste laboriosam excepturi, sed accusamus saepe
          eligendi recusandae porro cum voluptates culpa, ratione consequatur a
          ullam? Impedit.
        </p>
      </section>
      <Creators creators={creators} creatorStats={creatorStats} />;
    </>
  );
}
