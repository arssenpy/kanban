import axios from "axios";
import { Card } from "./types";

export const cardApi = {
  getCardsByList: async (listId: string): Promise<Card[]> => {
    const response = await axios.get<Card[]>(`/api/cards?listId=${listId}`);
    return response.data;
  },

  createCard: async (
    title: string,
    listId: string,
    currentCardsCount: number,
  ): Promise<Card> => {
    const response = await axios.post<Card>("/api/cards", {
      title,
      listId,
      order: currentCardsCount,
    });
    return response.data;
  },

  reorder: async (
    payload: { id: string; order: number; listId: string }[],
  ): Promise<void> => {
    await axios.patch("/api/cards/reorder", payload);
  },
};
