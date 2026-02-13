import { notFound } from "next/navigation";
import { Metadata } from "next";

import creatorData from "@/data/creators.json";
import type { Creator } from "@/data/data.types";
import { Avatar } from "@/components/custom/Avatar";

interface PageProps {
  params: { username: string };
}

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
    title: `${creator.displayName} (@${username})`,
    description: creator.description,
  };
}

export default async function CollectiblePage({ params }: PageProps) {
  const { username } = await params;

  const creator = creators.find((item: Creator) => item.username === username);

  if (!creator) {
    notFound();
  }

  return (
    <>
      <div className="px-horizontal border-dim/10 space-y-3 border-b pt-12 pb-3">
        <div className="flex items-end">
          <Avatar name={username} size={72} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold">{creator.displayName}</span>
          <span className="text-dim">@{username}</span>
        </div>
        <p>{creator.description}</p>
      </div>
    </>
  );
}
