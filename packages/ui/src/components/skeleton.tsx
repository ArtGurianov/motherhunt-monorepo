import { cn } from "@shared/ui/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-base bg-secondary border-2 border-border",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
