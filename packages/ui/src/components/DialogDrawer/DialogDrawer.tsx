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
  backBtn: ReactNode | null;
  onClose: () => void;
}

const DialogWrapper = ({
  isOpen,
  className,
  children,
  title,
  backBtn = null,
  onClose,
}: DialogDrawerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className={cn("py-0", className)}>
        <DialogHeader className="relative">
          <DialogTitle className="text-center font-medium font-serif text-3xl mt-4 text-muted-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {`Dialog content for ${title}`}
          </DialogDescription>
          {backBtn}
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
  backBtn,
  onClose,
}: DialogDrawerProps) => {
  return (
    <Drawer open={isOpen} onClose={onClose} autoFocus={isOpen}>
      <DrawerContent className={cn("py-2", className)}>
        <DrawerHeader className="relative">
          <DrawerTitle className="text-center font-medium font-serif text-3xl text-muted-foreground">
            {title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {`Drawer content for ${title}`}
          </DrawerDescription>
          {backBtn}
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
