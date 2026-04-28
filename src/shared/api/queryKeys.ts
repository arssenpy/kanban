export const queryKeys = {
  boards: ["boards"],
  lists: (boardId: string) => ["lists", boardId],
  cards: (listId: string) => ["cards", listId],
};
