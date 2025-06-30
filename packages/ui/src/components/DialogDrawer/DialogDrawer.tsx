"use client";

import { ReactNode } from "react";
import { useBreakpoint } from "@shared/ui/lib/hooks";
import { cn } from "@shared/ui/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../drawer";

export interface DialogDrawerProps {
  className?: string;
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const DialogWrapper = ({
  isOpen,
  className,
  children,
  title,
  onClose,
}: DialogDrawerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className={cn("py-0", className)}>
        <DialogHeader>
          <DialogTitle className="text-center font-medium font-serif text-3xl mt-4 text-muted-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {`Dialog content for ${title}`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 h-full">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

const DrawerWrapper = ({
  className,
  children,
  title,
  isOpen,
  onClose,
}: DialogDrawerProps) => {
  return (
    <Drawer open={isOpen} onClose={onClose} autoFocus={isOpen}>
      <DrawerContent className={cn("py-2", className)}>
        <DrawerHeader>
          <DrawerTitle className="text-center font-medium font-serif text-3xl text-muted-foreground">
            {title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {`Drawer content for ${title}`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="h-full">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export const DialogDrawer = (props: DialogDrawerProps) => {
  const isWindowOverSM = useBreakpoint("sm");

  const Comp = isWindowOverSM ? DialogWrapper : DrawerWrapper;
  return <Comp {...props} />;
};
