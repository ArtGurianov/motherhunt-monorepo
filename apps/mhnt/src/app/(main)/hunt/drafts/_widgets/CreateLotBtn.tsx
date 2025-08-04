"use client";

import { createDraft } from "@/actions/createDraft";
import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const CreateLotBtn = () => {
  const router = useRouter();

  return (
    <Button
      className="relative h-96 w-72 [&_svg]:size-48"
      onClick={() => {
        createDraft()
          .then((result) => {
            if (result.errorMessage) {
              toast(result.errorMessage);
            } else {
              router.refresh();
            }
          })
          .catch(() => {
            toast("Unexpected server error");
          });
      }}
    >
      <Plus />
      <span className="absolute bottom-2 left-0 z-10 w-full text-center font-medium text-xl font-mono p-1 bg-linear-to-r from-secondary/0 via-secondary/50 to-secondary/0 px-4">
        {"NEW LOT"}
      </span>
    </Button>
  );
};
