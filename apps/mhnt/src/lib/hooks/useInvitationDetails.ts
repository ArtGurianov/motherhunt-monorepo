import { useQuery } from "@tanstack/react-query";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { Invitation } from "@shared/db";

export const useInvitationDetails = (invitationId: string | null) => {
  return useQuery({
    queryKey: ["invitation-details", invitationId],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/data/getInvitationDetails/${invitationId}`
        );
        const invitationDetails = await res.json();
        return createActionResponse({ data: invitationDetails as Invitation });
      } catch (error) {
        return createActionResponse({ error });
      }
    },
    enabled: !!invitationId,
  });
};
