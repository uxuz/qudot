import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

import collectiblesData from "@/data/collectibles.json";
import type { Collectible } from "@/data/collectibles.types";
import CollectibleViewer from "./CollectibleViewer";
import { LucideArrowUpRight } from "@/components/icons/Lucide";

interface PageProps {
  params: { id: string };
}

const collectibles = collectiblesData as Collectible[];

export async function generateStaticParams() {
  return collectibles.map((collectible) => ({
    id: collectible.productId,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const collectible = collectibles.find(
    (item: Collectible) => item.productId === id,
  );

  if (!collectible) {
    notFound();
  }

  return {
    title: collectible.name,
    openGraph: {
      images: [collectible.previewUrl, collectible.backgroundUrl],
    },
  };
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
      <section className="border-dim/10 px-horizontal grid border-t pt-3">
        <h1 className="flex h-10 items-center text-xl font-bold">
          {collectible.name}
        </h1>
        <p className="mb-2">Created by {collectible.creator}</p>

        <p className="text-dim mb-3">{collectible.description}</p>
        <dl className="mb-4 flex justify-between">
          <div>
            <dt className="sr-only">Price</dt>
            <dd>Listed at ${collectible.price / 100}</dd>
          </div>
          <div>
            <dt className="sr-only">Supply</dt>
            <dd>Series of {collectible.sold}</dd>
          </div>
        </dl>
        <Link
          href={`https://opensea.io/item/polygon/${collectible.contractAddress}`}
          target="_blank"
          className="border-dim/10 flex h-10 items-center justify-center gap-1 rounded-xl border bg-blue-600 font-medium [&>svg]:text-lg"
        >
          Explore Marketplace
          <LucideArrowUpRight />
        </Link>
      </section>
    </>
  );
}
