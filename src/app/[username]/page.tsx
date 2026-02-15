import { notFound } from "next/navigation";
import { Metadata } from "next";

import collectiblesData from "@/data/collectibles.json";
import creatorData from "@/data/creators.json";
import type { Collectible, Creator } from "@/data/data.types";
import { Avatar } from "@/components/custom/Avatar";
import { Linkify } from "@/components/custom/Linkify";
import { CollectibleGallery } from "@/components/custom/CollectibleGallery";

interface PageProps {
  params: { username: string };
}

const collectibles = collectiblesData as Collectible[];
const creators = creatorData as Creator[];

export async function generateStaticParams() {
  return creators.map((creator) => ({
    username: creator.username,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;

  const creator = creators.find((item: Creator) => item.username === username);

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

  const creator = creators.find((item: Creator) => item.username === username);

  if (!creator) {
    notFound();
  }

  const creatorCollectibles = collectibles.filter(
    (collectible) => collectible.creator === creator.username,
  );

  return (
    <>
      <section className="px-horizontal border-dim/10 flex flex-col gap-3 border-b pt-12 pb-3 sm:flex-row sm:gap-x-6">
        <div className="flex items-center gap-3">
          <Avatar name={creator.username} size={128} />
        </div>
        <div className="space-y-3 sm:self-center">
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
        </div>
      </section>

      <section className="pt-3">
        <CollectibleGallery collectibles={creatorCollectibles} />
      </section>
    </>
  );
}
