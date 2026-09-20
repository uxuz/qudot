import { cn } from "@/lib/utils";

/** The heading block every top-level page opens with. `children` holds any CTA. */
export function PageIntro({
  title,
  description,
  className,
  children,
  ...props
}: {
  title: React.ReactNode;
  description: React.ReactNode;
} & React.ComponentProps<"section">) {
  return (
    <section
      className={cn("px-horizontal my-12 space-y-3", className)}
      {...props}
    >
      <h1 className="text-xl font-bold tracking-tight text-balance">{title}</h1>
      <p className="text-dim text-pretty">{description}</p>
      {children}
    </section>
  );
}
