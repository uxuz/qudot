import { notFound } from "next/navigation";
import { Metadata } from "next";

import { collectibles, creators } from "@/data/data";
import { Avatar } from "@/components/shared/Avatar";
import { Linkify } from "@/app/[username]/Linkify";
import { LinkButton } from "@/components/shared/LinkButton";
import { LucideArrowUpRight } from "@/components/icons/Lucide";
import { CollectibleCard } from "@/components/shared/CollectibleCard";
import { createPageMetadata } from "@/lib/metadata";

interface PageProps {
  params: { username: string };
}

export async function generateStaticParams() {
  return creators.map((creator) => ({
    username: creator.username.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;

  const creator = creators.find(
    (item) => item.username.toLowerCase() === username,
  );

  if (!creator) {
    notFound();
  }

  return createPageMetadata({
    title: `${creator.displayName} (@${creator.username})`,
    description: creator.description,
  });
}

export default async function CollectiblePage({ params }: PageProps) {
  const { username } = await params;

  const creator = creators.find(
    (item) => item.username.toLowerCase() === username,
  );

  if (!creator) {
    notFound();
  }

  const creatorCollectibles = collectibles
    .filter((collectible) => collectible.creator === creator.username)
    .sort(
      (a, b) =>
        new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime(),
    );

  return (
    <>
      <section className="px-horizontal border-dim/10 flex flex-col gap-3 border-b py-6 sm:flex-row sm:gap-x-6">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Avatar name={creator.username} size={160} />
          </div>
          <div className="sm:hidden">
            <Avatar name={creator.username} size={80} />
          </div>
        </div>
        <div className="w-full space-y-3 sm:self-center">
          <div className="flex flex-col">
            <span className="text-xl font-bold">{creator.displayName}</span>
            <span className="text-dim">@{creator.username}</span>
          </div>
          <p>
            <Linkify text={creator.description} />
          </p>
          <div className="flex gap-3">
            <div>
              <span className="font-bold">{creatorCollectibles.length}</span>{" "}
              <span className="text-dim">
                {creatorCollectibles.length === 1
                  ? "Collectible"
                  : "Collectibles"}
              </span>
            </div>
            <div>
              <span className="font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(
                  creatorCollectibles.reduce(
                    (total, item) => total + (item.sold * item.price) / 100,
                    0,
                  ),
                )}
              </span>{" "}
              <span className="text-dim">Revenue</span>
            </div>
          </div>

          <LinkButton
            href={`https://www.reddit.com/user/${creator.username}/`}
            target="_blank"
          >
            Reddit <LucideArrowUpRight />
          </LinkButton>
        </div>
      </section>

      <section className="px-horizontal grid grid-cols-2 gap-2 pt-3 sm:grid-cols-3">
        {/* Whilst it is possible to just resuse CollectibleGallery, however 
        it makes more sense to just render all the cards with no other 
        dependency such as virtualization as there is only a few of them */}
        {creatorCollectibles.map((collectible) => (
          <CollectibleCard
            key={collectible.productId}
            collectible={collectible}
          />
        ))}
      </section>
    </>
  );
}
