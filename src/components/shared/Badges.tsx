import { Chip } from "./Chip";

export function BadgeGenAI(props: React.ComponentProps<"span">) {
  return (
    <Chip tone="dim" {...props}>
      ✦
    </Chip>
  );
}
