import { Board } from "./types";
import { api } from "@/shared/api/axiosInstance";

export const boardsApi = {
  getBoards: async (): Promise<Board[]> => {
    const response = await api.get<Board[]>("/api/boards");
    return response.data;
  },

  createBoards: async (title: string): Promise<Board> => {
    const response = await api.post<Board>("/api/boards", { title });
    return response.data;
  },

  deleteBoard: async (id: string): Promise<void> => {
    await api.delete(`/api/boards/${id}`);
  },
};
