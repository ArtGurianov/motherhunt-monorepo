import { useQuery } from "@tanstack/react-query";
import { Invitation } from "@shared/db";
import { createQueryFn } from "../utils/createQueryFn";

export const useInvitationDetails = (invitationId: string | null) => {
  return useQuery({
    queryKey: ["invitation-details", invitationId],
    queryFn: createQueryFn<Invitation>(
      `/api/data/getInvitationDetails/${invitationId}`
    ),
    enabled: !!invitationId,
  });
};
