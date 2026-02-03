import { notFound } from "next/navigation";

import collectiblesData from "@/data/collectibles.json";
import type { Collectible } from "@/data/collectibles.types";

interface PageProps {
  params: { id: string };
}

const collectibles = collectiblesData as Collectible[];

export async function generateStaticParams() {
  return collectibles.map((collectible) => ({
    id: collectible.productId,
  }));
}

export default async function CollectiblePage({ params }: PageProps) {
  const { id } = await params;
  const collectible = collectibles.find(
    (item: Collectible) => item.productId === id,
  );

  if (!collectible) {
    notFound();
  }

  return <h1>{collectible.name}</h1>;
}
