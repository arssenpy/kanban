import { dataBase } from "@/shared/api/FakeData";
import { List } from "./types";

export const listApi = {
  getListsByBoard: async (boardId: string): Promise<List[]> => {
    return dataBase.lists
      .filter((list) => list.boardId === boardId)
      .sort((a, b) => a.order - b.order);
  },

  createList: async (title: string, boardId: string): Promise<List> => {
    const lists = dataBase.lists.filter((list) => list.boardId === boardId);

    const newList = {
      id: crypto.randomUUID(),
      title,
      boardId,
      order: lists.length,
    };

    dataBase.lists.push(newList);
    return newList;
  },
};
