"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import impersonateUserApi from "@/server/user/impersonate-user";
import stopImpersonatingApi from "@/server/user/stop-impersonatin-user";
import { useRouter } from "next/navigation";
import { queryClient } from "./query-provider";

interface ImpersonationContextType {
  impersonatedUserId: string | null;
  impersonateUser: (userId: string) => Promise<void>;
  stopImpersonating: () => Promise<void>;
  clearLocalImpersonation: () => void;
  isImpersonating: boolean;
}

const STORAGE_KEY = "impersonatedUserId";

const ImpersonationContext = createContext<
  ImpersonationContextType | undefined
>(undefined);

export const ImpersonationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(
    null
  );
  const router = useRouter();

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setImpersonatedUserId(stored);
  }, []);

  const impersonateUser = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await impersonateUserApi(userId);
        if (error) throw error;

        setImpersonatedUserId(userId);
        localStorage.setItem(STORAGE_KEY, userId);

        queryClient.invalidateQueries({ queryKey: ["session"] });
        router.push("/");
      } catch (err) {
        console.error("Failed to impersonate user:", err);
      }
    },
    [router]
  );

  const stopImpersonating = useCallback(async () => {
    try {
      await stopImpersonatingApi();

      setImpersonatedUserId(null);
      localStorage.removeItem(STORAGE_KEY);

      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
    } catch (err) {
      console.error("Failed to stop impersonating:", err);
    }
  }, [router]);

  // ✅ Just clears local state + storage, no API call
  const clearLocalImpersonation = useCallback(() => {
    setImpersonatedUserId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ImpersonationContext.Provider
      value={{
        impersonatedUserId,
        impersonateUser,
        stopImpersonating,
        clearLocalImpersonation,
        isImpersonating: !!impersonatedUserId,
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  );
};

export const useImpersonation = () => {
  const context = useContext(ImpersonationContext);
  if (!context) {
    throw new Error(
      "useImpersonation must be used within an ImpersonationProvider"
    );
  }
  return context;
};
