import { dataBase } from "@/shared/api/FakeData";
import { Board } from "./types";

export const boardsApi = {
  getBoards: async (): Promise<Board[]> => {
    return dataBase.boards;
  },

  createBoards: async (title: string): Promise<Board> => {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      title: title,
    };

    dataBase.boards.push(newBoard);
    return newBoard;
  },
};
