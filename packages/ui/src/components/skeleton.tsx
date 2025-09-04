import { cn } from "@shared/ui/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse bg-linear-to-br from-secondary via-accent-foreground/50 to-background",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
