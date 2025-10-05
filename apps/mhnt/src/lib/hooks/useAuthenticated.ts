import { useAuth } from "./useAuth";

export const useAuthenticated = () => {
  const { isPending, session, user, activeMember, isError, refetch } =
    useAuth();

  if (isPending || isError || !session || !user)
    throw new Error("Unauthorized");

  return {
    session,
    user,
    activeMember,
    refetch,
  };
};
