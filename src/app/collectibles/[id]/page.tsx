import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

import collectiblesData from "@/data/collectibles.json";
import type { Collectible } from "@/data/collectibles.types";
import CollectibleViewer from "./CollectibleViewer";
import { LucideArrowUpRight } from "@/components/icons/Lucide";
import { FacehashClient } from "@/components/custom/FacehashClient";

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
      <section className="border-dim/10 px-horizontal grid border-t py-3">
        <h1 className="flex h-10 items-center text-xl font-bold">
          {collectible.name}
        </h1>

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
          className="border-dim/5 hover:border-dim/10 flex h-10 items-center justify-center gap-1 rounded-xl border bg-blue-600/85 font-medium transition-colors hover:bg-blue-600 [&>svg]:text-lg"
        >
          Explore Marketplace
          <LucideArrowUpRight />
        </Link>
      </section>

      <section className="border-dim/10 px-horizontal grid border-t py-3">
        {/* TODO: Polish the creator section (and move it down?) */}

        <div className="flex gap-2">
          <Link href={`/${collectible.creator}`} className="h-fit">
            <FacehashClient
              name={collectible.creator}
              colorClasses={["bg-pink-500", "bg-blue-500", "bg-yellow-500"]}
              className="text-background shrink-0 rounded-full select-none"
            />
          </Link>
          <div>
            <Link href={`/${collectible.creator}`}>
              <span className="font-bold">Blurbury</span>{" "}
              <span className="text-dim">@{collectible.creator}</span>
            </Link>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga,
              architecto quasi exercitationem libero culpa ullam blanditiis
              dicta rerum ad hic natus saepe dignissimos provident nulla
              nesciunt quidem distinctio, cum maxime.
            </p>
          </div>
        </div>
      </section>

      <section className="border-dim/10 px-horizontal grid border-t py-3">
        {/* TODO: Polish the metadata area, section label (and polygonscan link?) */}

        <h2 className="text-dim mb-3 hidden font-bold uppercase">
          Blockchain Details
        </h2>

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
      </section>
    </>
  );
}
