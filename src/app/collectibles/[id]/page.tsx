import { notFound } from "next/navigation";

import collectiblesData from "@/data/collectibles.json";
import type { Collectible } from "@/data/collectibles.types";
import CollectibleViewer from "./CollectibleViewer";

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

  return (
    <>
      <CollectibleViewer collectible={collectible} />
      <section className="grid gap-3 pt-6">
        <h1 className="text-2xl font-bold">{collectible.name}</h1>
        <p>Created by {collectible.creator}</p>
        <p className="text-dim">{collectible.description}</p>
        <dl className="flex justify-between">
          <div>
            <dt className="sr-only">Price</dt>
            <dd>${collectible.price / 100}</dd>
          </div>
          <div>
            <dt className="sr-only">Supply</dt>
            <dd>Series of {collectible.sold}</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
