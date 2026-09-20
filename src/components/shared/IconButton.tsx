import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The dim chrome shared by every control surface: icon buttons, the search
 * field, the generation select, the trait toggles and the colour picker panel.
 * Exported as a string so surfaces that aren't buttons — a wrapping div, a
 * <select> — can opt into exactly the same look through `cn`.
 */
export const controlSurface =
  "bg-dim/5 border-dim/5 text-dim rounded-xl border transition-colors";

/** `controlSurface` plus the hover and pointer affordances. */
export const interactiveSurface = cn(
  controlSurface,
  "hover:bg-dim/10 cursor-pointer",
);

/** A square, icon-only control. Geometry is fixed; tone comes from above. */
const iconControl = cn(
  interactiveSurface,
  "hover:text-foreground flex size-10 shrink-0 items-center justify-center [&_svg]:text-xl",
);

export function IconButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return <button className={cn(iconControl, className)} {...props} />;
}

export function IconLink({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return <Link className={cn(iconControl, className)} {...props} />;
}
