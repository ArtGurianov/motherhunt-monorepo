"use client";

import { Button } from "@shared/ui/components/button";
import { DialogDrawer } from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("DIALOGS");
  const tButtons = useTranslations("COMMON.BUTTONS");
  const handleClick = () => {
    onActionConfirm();
    onClose();
  };

  return (
    <DialogDrawer
      title={title ?? t("confirm-action-title")}
      isOpen={isOpen}
      onClose={onClose}
      className="bg-red-800 h-auto"
    >
      <div className="flex flex-col gap-4 px-6 py-4 justify-center items-center">
        <span className="text-lg text-center">
          {desctiption ?? t("confirm-continue")}
        </span>
        <Button onClick={handleClick}>{tButtons("confirm")}</Button>
      </div>
    </DialogDrawer>
  );
};
