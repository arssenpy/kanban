import { Board } from "./types";
import axios from "axios";

export const boardsApi = {
  getBoards: async (): Promise<Board[]> => {
    const response = await axios.get<Board[]>("/api/boards");
    return response.data;
  },

  createBoards: async (title: string): Promise<Board> => {
    const response = await axios.post<Board>("/api/boards", { title });
    return response.data;
  },
};
