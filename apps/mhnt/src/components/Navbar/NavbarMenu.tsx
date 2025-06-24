import { Button } from "@shared/ui/components/button";
import { cn } from "@shared/ui/lib/utils";

interface NavbarMenuProps {
  isOpened: boolean;
}

export const NavbarMenu = ({ isOpened }: NavbarMenuProps) => {
  return (
    <div
      className={cn(
        "absolute z-10 left-0 md:static w-full md:w-auto h-full flex gap-2 justify-start items-center bg-main transition-all ease-in-out duration-500 px-2",
        {
          "left-full": !isOpened,
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
