import { dataBase } from "@/shared/api/FakeData";
import { Card } from "./types";
import axios from "axios";

export const cardApi = {
  getCardsByList: async (listId: string): Promise<Card[]> => {
    return dataBase.cards
      .filter((card) => card.listId === listId)
      .sort((a, b) => a.order - b.order);
  },

  createCard: async (title: string, listId: string): Promise<Card> => {
    const cards = dataBase.cards.filter((card) => card.listId === listId);

    const newCard = {
      id: crypto.randomUUID(),
      title,
      listId,
      order: cards.length,
    };

    dataBase.cards.push(newCard);
    return newCard;
  },

  reorder: async (payload: { id: string; listId: string; order: number }[]) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    payload.forEach((updatedCard) => {
      const card = dataBase.cards.find((c) => c.id === updatedCard.id);
      if (card) {
        card.order = updatedCard.order;
        card.listId = updatedCard.listId;
      }
    });

    return { success: true };
  },
};
