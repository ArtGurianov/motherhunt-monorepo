"use client";

import { createDraft } from "@/actions/createDraft";
import { DRAFTS_QUERY_KEY } from "@/lib/hooks";
import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTransition } from "react";

interface CreateLotBtnProps {
  onSuccess: () => void;
}

export const CreateLotBtn = ({ onSuccess }: CreateLotBtnProps) => {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  return (
    <Button
      disabled={isPending}
      className="relative w-full h-auto max-w-72 aspect-3/4 [&_svg]:size-48"
      onClick={() => {
        try {
          startTransition(async () => {
            const result = await createDraft();
            if (!result.success) {
              toast(result.errorMessage);
              return;
            }
            queryClient.invalidateQueries({ queryKey: [DRAFTS_QUERY_KEY] });
            onSuccess();
          });
        } catch (error) {
          toast(
            error instanceof Error ? error.message : "Something went wrong.",
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
