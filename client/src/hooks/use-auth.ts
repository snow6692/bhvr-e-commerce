import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/client";
import { useRouter } from "@tanstack/react-router";

// Type keys for queries
export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 1. Fetch current session
  const {
    data: sessionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: async () => {
      const res = await client.api.auth.custom.me.$get();
      if (!res.ok) {
        return null;
      }
      return await res.json();
    },
    retry: false, // Don't retry if 401
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const user = sessionData?.user;
  const isAuthenticated = !!user;
  const role = user?.role;

  // 2. Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (vars: any) => {
      const res = await client.api.auth.custom.login.$post({ json: vars });
      if (!res.ok) {
        const err = await res.json();
        throw new Error((err as any).message || "Login failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
      // Router invalidation is handled by TanStack Router usually, or we force reload
      router.invalidate();
    },
  });

  // 3. Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await client.api.auth.custom.logout.$post();
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.me, null);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
      router.invalidate();
      router.navigate({ to: "/" }); // create login route usage?
    },
  });

  // 4. Role Helpers
  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "USER";

  return {
    user,
    isAuthenticated,
    isLoading,
    role,
    isAdmin,
    isTeacher,
    isStudent,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
};
