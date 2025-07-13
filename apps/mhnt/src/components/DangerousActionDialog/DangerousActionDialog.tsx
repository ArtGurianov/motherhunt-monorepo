"use client";

import { Button } from "@shared/ui/components/button";
import { DialogDrawer } from "@shared/ui/components/DialogDrawer/DialogDrawer";

interface DangerousActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onActionConfirm: () => void;
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
  const handleClick = () => {
    onActionConfirm();
    onClose();
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
        <Button onClick={handleClick}>{"Confirm"}</Button>
      </div>
    </DialogDrawer>
  );
};
