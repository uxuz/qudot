import { cn } from "@/lib/utils";

export function BadgeGenAI({ ...props }: React.ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={cn(
        "border-dim/10 bg-dim/10 text-dim rounded-lg border px-2",
        props.className,
      )}
    >
      ✦
    </span>
  );
}
