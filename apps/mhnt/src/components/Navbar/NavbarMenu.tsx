import { Button } from "@shared/ui/components/button";
import { cn } from "@shared/ui/lib/utils";

interface NavbarMenuProps {
  isOpened: boolean;
}

export const NavbarMenu = ({ isOpened }: NavbarMenuProps) => {
  return (
    <div
      className={cn(
        "absolute md:static left-0 w-full h-full md:w-auto flex gap-2 justify-center items-center transition-all ease-in-out duration-500 px-2 bg-main",
        {
          "left-full invisible": !isOpened,
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
