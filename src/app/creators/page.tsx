import Link from "next/link";
import type { Metadata } from "next";

import { collectibles, creators } from "@/data/data";
import { Avatar } from "@/components/custom/Avatar";

export const metadata: Metadata = {
  title: "Creators | Blurbury",
  description:
    "Every creator behind Reddit Collectible Avatars, all in one organized place.",
};

// TODO: Actual styling, revenue, collectible amount and ability to sort by name, revenue and collectible amount
export default function Creators() {
  const stats = collectibles.reduce(
    (acc, item) => {
      const key = item.creator;

      if (!acc[key]) {
        acc[key] = { count: 0, revenue: 0 };
      }

      acc[key].count += 1;
      acc[key].revenue += (item.sold * item.price) / 100;

      return acc;
    },
    {} as Record<string, { count: number; revenue: number }>,
  );

  return (
    <div className="px-horizontal grid gap-4 sm:grid-cols-2">
      {creators.map((creator) => {
        const creatorStats = stats[creator.username] ?? {
          count: 0,
          revenue: 0,
        };

        return (
          <Link
            key={creator.username}
            href={`/${creator.username.toLowerCase()}`}
            className="flex gap-3"
          >
            <Avatar name={creator.username} size={80} />

            <div>
              <div className="font-bold">{creator.displayName}</div>
              <div className="text-dim">@{creator.username}</div>

              <div className="text-dim">
                <span className="text-foreground font-bold">
                  {creatorStats.count}
                </span>{" "}
                {creatorStats.count == 1 ? "Collectible" : "Collectibles"}
              </div>
              <div className="text-dim">
                <span className="text-foreground font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(creatorStats.revenue)}{" "}
                </span>
                Revenue
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
