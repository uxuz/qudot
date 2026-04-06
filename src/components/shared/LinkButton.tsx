import Link from "next/link";
import { cn } from "@/lib/utils";

export function LinkButton({
  className,
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "border-dim/10 flex h-10 items-center justify-center gap-1 rounded-xl border bg-blue-700 font-semibold transition-colors hover:bg-blue-700/85 [&>svg]:text-lg",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
