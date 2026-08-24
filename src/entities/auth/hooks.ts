import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "./api";
import { tokenStorage } from "@/shared/lib/tokenStorage";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import { useAuthStore } from "./store";

export const useRegister = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name?: string;
    }) => authApi.register(email, password, name),

    onSuccess: (data) => {
      tokenStorage.set(data.token);
      setUser(data.user);
      toast.success("Registration successful");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to register"));
    },
  });
};

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),

    onSuccess: (data) => {
      tokenStorage.set(data.token);
      setUser(data.user);
      toast.success("Logged in");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "incorrect password or email"));
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((s) => s.clearUser);

  return () => {
    tokenStorage.clear();
    clearUser();
    queryClient.clear();
  };
};
