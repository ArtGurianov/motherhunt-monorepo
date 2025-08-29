"use client";

import { createDraft } from "@/actions/createDraft";
import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const CreateLotBtn = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      disabled={isPending}
      className="relative h-96 w-72 [&_svg]:size-48"
      onClick={() => {
        try {
          startTransition(async () => {
            const result = await createDraft();
            if (!result.success) {
              toast(result.errorMessage);
              return;
            }
            router.refresh();
          });
        } catch (error) {
          toast(
            error instanceof AppClientError
              ? error.message
              : "An unexpected error occurred. Please try again."
          );
        }
      }}
    >
      <Plus />
      <span className="absolute bottom-2 left-0 z-10 w-full text-center font-medium text-xl font-mono p-1 bg-linear-to-r from-secondary/0 via-secondary/50 to-secondary/0 px-4">
        {isPending ? "Creating..." : "NEW LOT"}
      </span>
    </Button>
  );
};
