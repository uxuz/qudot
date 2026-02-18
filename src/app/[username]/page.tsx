import { notFound } from "next/navigation";
import { Metadata } from "next";

import { collectibles, creators } from "@/data/data";
import { Avatar } from "@/components/custom/Avatar";
import { Linkify } from "@/components/custom/Linkify";
import { CollectibleGallery } from "@/components/custom/CollectibleGallery";
import { LinkButton } from "@/components/custom/LinkButton";
import { LucideArrowUpRight } from "@/components/icons/Lucide";

interface PageProps {
  params: { username: string };
}

export async function generateStaticParams() {
  return creators.map((creator) => ({
    username: creator.username,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;

  const creator = creators.find((item) => item.username === username);

  if (!creator) {
    notFound();
  }

  return {
    title: `${creator.displayName} (@${creator.username})`,
    description: creator.description,
  };
}

export default async function CollectiblePage({ params }: PageProps) {
  const { username } = await params;

  const creator = creators.find((item) => item.username === username);

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
      <section className="px-horizontal border-dim/10 flex flex-col gap-3 border-b pt-12 pb-3 sm:flex-row sm:gap-x-6">
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

      <section className="pt-4">
        <CollectibleGallery collectibles={creatorCollectibles} />
      </section>
    </>
  );
}
