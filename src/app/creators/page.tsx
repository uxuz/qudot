import type { Metadata } from "next";

import { creators, creatorStats } from "@/data/data";
import Creators from "./CreatorsClient";

export const metadata: Metadata = {
  title: "Creators | Blurbury",
  description:
    "Every creator behind Reddit Collectible Avatars, all in one organized place.",
};

export default function CreatorsPage() {
  return <Creators creators={creators} creatorStats={creatorStats} />;
}
