import { api } from "@/shared/api/axiosInstance";
import { AuthResponse } from "./types";
import { User } from "./types";

export const authApi = {
  register: async (
    email: string,
    password: string,
    name?: string,
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>("/api/auth/me");
    return response.data;
  },
};
