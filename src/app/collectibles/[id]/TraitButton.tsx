"use client";

import { cn } from "@/lib/utils";
import { interactiveSurface } from "@/components/shared/IconButton";

export function TraitButton({
  className,
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        interactiveSurface,
        `data-[exists=false]:border-dim/10 flex aspect-square h-10 items-center justify-center text-sm font-medium data-[active=false]:opacity-50 data-[exists=false]:cursor-not-allowed data-[exists=false]:bg-[repeating-linear-gradient(45deg,#0a0a0a,#0a0a0a_10px,#1a1a1a_10px,#1a1a1a_20px)] data-[exists=false]:opacity-50 sm:aspect-auto sm:gap-2 [&>span]:hidden sm:[&>span]:inline [&>svg]:text-xl`,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
