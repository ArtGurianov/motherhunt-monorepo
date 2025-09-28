import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { useAuth } from "./useAuth";

export const useAuthenticated = () => {
  const { isPending, session, user, activeMember, isError, refetch } =
    useAuth();

  if (isPending || isError || !session || !user)
    throw new AppClientError("Unauthorized");

  return {
    session,
    user,
    activeMember,
    refetch,
  };
};
