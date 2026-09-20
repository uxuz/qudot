import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

import { collectibles, creators } from "@/data/data";
import CollectibleViewer from "./CollectibleViewer";
import { LucideArrowUpRight } from "@/components/icons/Lucide";
import { Avatar } from "@/components/shared/Avatar";
import { LinkButton } from "@/components/shared/LinkButton";
import { createPageMetadata } from "@/lib/metadata";
import { BadgeGenAI } from "@/components/shared/Badges";
import { Chip } from "@/components/shared/Chip";
import { StatRow } from "@/components/shared/StatRow";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return collectibles.map((collectible) => ({
    id: collectible.productId,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const collectible = collectibles.find((item) => item.productId === id);

  if (!collectible) {
    notFound();
  }

  const creator = creators.find(
    (item) => item.username === collectible.creator,
  );

  return createPageMetadata({
    title: `${collectible.name} by ${creator?.displayName} (@${collectible.creator})`,
    description: collectible.description,
    openGraph: {
      images: [collectible.previewUrl, collectible.backgroundUrl],
    },
  });
}

export default async function CollectiblePage({ params }: PageProps) {
  const { id } = await params;
  const collectible = collectibles.find((item) => item.productId === id);

  if (!collectible) {
    notFound();
  }

  const creator = creators.find(
    (item) => item.username === collectible.creator,
  );

  // Special reddit "Test Gray" handling, as it technically doesn't have any traits
  // to begin with. Derived rather than assigned: `collectible` is a shared object
  // owned by the dataset module, so mutating it leaks into every other consumer.
  const isTestGray = creator?.username === "reddit";
  const traitIds = isTestGray ? [] : collectible.traits;
  const backgroundUrl = isTestGray
    ? collectible.previewUrl
    : collectible.backgroundUrl;

  return (
    <>
      <CollectibleViewer traitIds={traitIds} backgroundUrl={backgroundUrl} />

      <section className="border-dim/10 px-horizontal grid border-y py-3">
        <h1 className="flex h-10 items-center text-xl font-bold">
          {collectible.name}
        </h1>

        <p className="text-dim">{collectible.description}</p>
      </section>

      <section className="px-horizontal py-3">
        <dl className="mb-4 grid grid-cols-2 gap-x-6 gap-y-1">
          <StatRow label="Retailed At">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(collectible.price / 100)}
          </StatRow>

          <StatRow label="Units Sold">{collectible.sold.toLocaleString()}</StatRow>

          <StatRow label="Supply Of">
            {collectible.supply.toLocaleString()}
          </StatRow>

          <StatRow label="Revenue">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format((collectible.sold * collectible.price) / 100)}
          </StatRow>
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
          href={`/${collectible.creator.toLowerCase()}`}
          className="flex items-center gap-2"
        >
          <Avatar name={collectible.creator} />
          <div className="flex flex-col">
            <span className="font-bold text-nowrap">
              {creator?.displayName} {creator?.genAi && <BadgeGenAI />}
            </span>
            <span className="text-dim">@{collectible.creator}</span>
          </div>
        </Link>

        <div className="text-dim flex w-full flex-wrap justify-end gap-1">
          {collectible.tags.length > 0 &&
            collectible.tags.map((tag) => (
              <Chip key={tag} className="flex">
                {tag.toUpperCase()}
              </Chip>
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
            {collectible.startingTokenId.toLocaleString()}
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
