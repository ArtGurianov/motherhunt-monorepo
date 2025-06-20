import { cn } from "@shared/ui/lib/utils";

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PageSection = ({
  children,
  className,
  fullWidth = false,
}: PageSectionProps) => {
  return (
    <section
      className={cn(
        "h-fit w-full",
        { "px-4 md:px-16 lg:px-32": !fullWidth },
        className
      )}
    >
      {children}
    </section>
  );
};
