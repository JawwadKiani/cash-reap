import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  email?: string;
  phone?: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!user.id,
  };
}