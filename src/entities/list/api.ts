import { List } from "./types";
import { api } from "@/shared/api/axiosInstance";

export const listApi = {
  getListsByBoard: async (boardId: string): Promise<List[]> => {
    const response = await api.get<List[]>(`/api/lists?boardId=${boardId}`);
    return response.data;
  },

  createList: async (
    title: string,
    boardId: string,
    currentListsCount: number,
  ): Promise<List> => {
    const response = await api.post<List>("/api/lists", {
      title,
      boardId,
      order: currentListsCount,
    });
    return response.data;
  },

  reorder: async (payload: { id: string; order: number }[]): Promise<void> => {
    await api.patch("/api/lists/reorder", payload);
  },
};
