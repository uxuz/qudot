import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

import collectiblesData from "@/data/collectibles.json";
import type { Collectible } from "@/data/collectibles.types";
import CollectibleViewer from "./CollectibleViewer";
import { LucideArrowUpRight } from "@/components/icons/Lucide";
import { Avatar } from "@/components/custom/Avatar";
import { LinkButton } from "@/components/custom/LinkButton";

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
    title: `${collectible.name} by Blurbury (@${collectible.creator})`,
    description: collectible.description,
    openGraph: {
      images: [collectible.previewUrl, collectible.backgroundUrl],
    },
    twitter: {
      card: "summary_large_image",
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
      <CollectibleViewer
        traitIds={collectible.traits}
        backgroundUrl={collectible.backgroundUrl}
      />

      <section className="border-dim/10 px-horizontal grid border-t py-3">
        <h1 className="flex h-10 items-center text-xl font-bold">
          {collectible.name}
        </h1>

        <p className="text-dim mb-3">{collectible.description}</p>
        <dl className="mb-4 flex justify-between">
          <div>
            <dt className="sr-only">Price</dt>
            <dd>Retailed at ${collectible.price / 100}</dd>
          </div>
          <div>
            <dt className="sr-only">Supply</dt>
            <dd>Series of {collectible.sold}</dd>
          </div>
        </dl>
        <LinkButton
          href={`https://opensea.io/item/polygon/${collectible.contractAddress}`}
          target="_blank"
        >
          Explore Marketplace
          <LucideArrowUpRight />
        </LinkButton>
      </section>

      <section className="border-dim/10 px-horizontal flex grid-cols-2 items-center gap-3 border-t py-3 sm:grid">
        <Link
          href={`/${collectible.creator}`}
          className="flex items-center gap-2"
        >
          <Avatar name={collectible.creator} />
          <div className="flex flex-col">
            <span className="font-bold">Blurbury</span>
            <span className="text-dim">@{collectible.creator}</span>
          </div>
        </Link>

        <div className="text-dim flex w-full flex-wrap justify-end gap-1">
          {collectible.tags.length > 0 &&
            collectible.tags.map((tag) => (
              <div
                key={tag}
                className="border-dim/5 bg-dim/5 flex rounded-lg border px-2"
              >
                {tag.toUpperCase()}
              </div>
            ))}
        </div>
      </section>

      <section className="border-dim/10 px-horizontal grid border-t pt-3">
        <dl className="grid grid-cols-[1fr_2fr] gap-y-2">
          <dt className="text-dim">Contract Address</dt>
          <dd className="text-right font-mono text-balance break-all">
            {collectible.contractAddress}
          </dd>

          <dt className="text-dim">Starting Token ID</dt>
          <dd className="text-right font-mono">
            {collectible.startingTokenId}
          </dd>

          <dt className="text-dim">Deployment Date</dt>
          <dd className="text-right">
            {new Date(collectible.deployedAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </dd>
        </dl>

        <LinkButton
          href={`https://polygonscan.com/token/${collectible.contractAddress}`}
          target="_blank"
          className="mt-4"
        >
          PolygonScan
          <LucideArrowUpRight />
        </LinkButton>
      </section>
    </>
  );
}
