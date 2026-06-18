import axios from "axios";
import { List } from "./types";

export const listApi = {
  getListsByBoard: async (boardId: string): Promise<List[]> => {
    const response = await axios.get<List[]>(`/api/lists?boardId=${boardId}`);
    return response.data;
  },

  createList: async (
    title: string,
    boardId: string,
    currentListsCount: number,
  ): Promise<List> => {
    const response = await axios.post<List>("/api/lists", {
      title,
      boardId,
      order: currentListsCount,
    });
    return response.data;
  },

  reorder: async (payload: { id: string; order: number }[]): Promise<void> => {
    await axios.patch("/api/lists/reorder", payload);
  },
};
