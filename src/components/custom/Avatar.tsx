"use client";

import { Facehash, type FacehashProps } from "facehash";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: FacehashProps) {
  return (
    <Facehash
      className={cn(
        "shrink-0 rounded-full font-mono font-bold text-black select-none",
        className,
      )}
      colorClasses={["bg-pink-500", "bg-blue-500", "bg-yellow-500"]}
      variant="solid"
      {...props}
    />
  );
}
