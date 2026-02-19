import Link from "next/link";

import { collectibles, creators } from "@/data/data";
import { Avatar } from "@/components/custom/Avatar";

// TODO: Actual styling, revenue, collectible amount and ability to sort by name, revenue and collectible amount
export default function Creators() {
  return (
    <div className="px-horizontal grid gap-2 sm:grid-cols-2">
      {creators.map((creator) => (
        <Link
          key={creator.username}
          href={`/${creator.username.toLocaleLowerCase()}`}
          className="flex gap-2"
        >
          <Avatar name={creator.username} />
          <div>
            <div className="font-bold">{creator.displayName}</div>
            <div className="text-dim">{creator.username}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
