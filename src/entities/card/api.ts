import { Card } from "./types";
import { api } from "@/shared/api/axiosInstance";

export const cardApi = {
  getCardsByList: async (listId: string): Promise<Card[]> => {
    const response = await api.get<Card[]>(`/api/cards?listId=${listId}`);
    return response.data;
  },

  createCard: async (
    title: string,
    listId: string,
    currentCardsCount: number,
  ): Promise<Card> => {
    const response = await api.post<Card>("/api/cards", {
      title,
      listId,
      order: currentCardsCount,
    });
    return response.data;
  },

  reorder: async (
    payload: { id: string; order: number; listId: string }[],
  ): Promise<void> => {
    await api.patch("/api/cards/reorder", payload);
  },
};
