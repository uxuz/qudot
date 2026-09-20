import { cn } from "@/lib/utils";

/** One `dt`/`dd` pair in a definition list, label left and value right. */
export function StatRow({
  label,
  className,
  children,
  ...props
}: { label: React.ReactNode } & React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-baseline justify-between gap-2", className)}
      {...props}
    >
      <dt className="text-dim">{label}</dt>
      <dd className="tabular-nums">{children}</dd>
    </div>
  );
}
