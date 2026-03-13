"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LucideBotOff } from "../icons/Lucide";

export function CollectibleCardClient({
  productId,
  name,
  creatorUsername,
  ceratorDisplayName,
  previewUrl,
  blur,
}: {
  productId: string;
  name: string;
  creatorUsername: string;
  ceratorDisplayName: string;
  previewUrl: string;
  blur: boolean;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <Link href={`/collectibles/${productId}`}>
        <div className="absolute inset-0 h-full w-full">
          <Image
            className={`absolute inset-0 h-full w-full scale-120 transform object-cover object-bottom transition ${
              blur && !revealed ? "blur-sm" : ""
            }`}
            alt={`${name} by ${ceratorDisplayName} (@${creatorUsername})`}
            src={previewUrl}
            width={552}
            height={736}
            unoptimized
          />
        </div>
      </Link>

      {blur && !revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="text-dim absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-1 bg-black/60 px-6 text-xs text-balance backdrop-blur-sm [&>svg]:text-xl"
        >
          <span className="text-4xl">✦</span>
          <span className="font-medium text-balance">
            Content warning: Generative AI
          </span>
        </button>
      )}
    </>
  );
}
