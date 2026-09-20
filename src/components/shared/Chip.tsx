import { cn } from "@/lib/utils";

const chipTones = {
  /** Sits on top of imagery, so it stays opaque enough to read over anything. */
  overlay: "border-dim/10 bg-background/80",
  /** The default surface tone, for tags and other inline metadata. */
  muted: "border-dim/5 bg-dim/5",
  /** A little louder, for badges meant to catch the eye. */
  dim: "border-dim/10 bg-dim/10 text-dim",
} as const;

export type ChipTone = keyof typeof chipTones;

export function Chip({
  tone = "muted",
  className,
  ...props
}: { tone?: ChipTone } & React.ComponentProps<"span">) {
  return (
    <span
      className={cn("rounded-lg border px-2", chipTones[tone], className)}
      {...props}
    />
  );
}
