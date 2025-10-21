import { useQuery } from "@tanstack/react-query";
import { Invitation } from "@shared/db";
import { createQueryFn } from "../utils/createQueryFn";
import { INVITATION_QUERY_KEY } from "./keys";

export const useInvitationDetails = (invitationId: string | null) => {
  return useQuery({
    queryKey: [INVITATION_QUERY_KEY, invitationId],
    queryFn: createQueryFn<Invitation>(
      `/api/data/getInvitationDetails/${invitationId}`
    ),
    enabled: typeof window !== "undefined" && !!invitationId,
  });
};
