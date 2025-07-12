"use client";

import { Button } from "@shared/ui/components/button";
import { DialogDrawer } from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { toast } from "@shared/ui/components/sonner";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";

interface DangerousActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onActionConfirm: () => Promise<void>;
  title?: string;
  desctiption?: string;
}

export const DangerousActionDialog = ({
  isOpen,
  onClose,
  onActionConfirm,
  title,
  desctiption,
}: DangerousActionDialogProps) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await onActionConfirm();
        toast("Success");
        onClose();
      } catch {
        toast("An error occured.");
      }
    });
  };

  return (
    <DialogDrawer
      title={title ?? "Confirm action"}
      isOpen={isOpen}
      onClose={onClose}
      className="bg-red-800 h-auto"
    >
      <div className="flex flex-col gap-4 px-6 py-4 justify-center items-center">
        <span className="text-lg text-center">
          {desctiption ?? "Do you want to continue?"}
        </span>
        <Button onClick={handleClick}>
          {isPending ? (
            <LoaderCircle className="py-1 animate-spin h-8 w-8" />
          ) : (
            "Confirm"
          )}
        </Button>
      </div>
    </DialogDrawer>
  );
};
