import { Button } from "@shared/ui/components/button";
import { cn } from "@shared/ui/lib/utils";

interface NavbarMenuProps {
  isOpened: boolean;
}

export const NavbarMenu = ({ isOpened }: NavbarMenuProps) => {
  return (
    <div
      className={cn(
        "absolute md:static left-full w-full h-full md:w-auto flex gap-2 justify-center items-center transition-all duration-500 px-2",
        {
          "invisible md:visible": !isOpened,
        }
      )}
    >
      <Button className="p-2" size="reset" variant="secondary">
        {"1"}
      </Button>
      <Button className="p-2" size="reset" variant="secondary">
        {"2"}
      </Button>
      <Button className="p-2" size="reset" variant="secondary">
        {"3"}
      </Button>
      <Button className="p-2" size="reset" variant="secondary">
        {"4"}
      </Button>
    </div>
  );
};
