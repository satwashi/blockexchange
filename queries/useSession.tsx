"use client";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/utils/auth-client";

const getSessionApi = async () => {
  const { data: session, error } = await getSession();

  if (error) throw error;
  return session;
};

export const useSession = () => {
  const {
    data: session,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["session"],
    queryFn: () => {
      return getSessionApi();
    },
  });

  const user = session?.user;
  const id = user?.id;
  const role = user?.role;

  return { session, id, isLoading, error, user, role };
};
