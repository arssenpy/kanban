import { dataBase } from "@/shared/api/FakeData";
import { Card } from "./types";

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
};
