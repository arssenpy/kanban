import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { listApi } from "./api";
import { queryKeys } from "@/shared/api/queryKeys";
import { List } from "./types";

type ReorderListsVariables = {
  boardId: string;
  updates: { id: string; order: number }[];
  previousLists: List[] | undefined;
};

export const useLists = (boardId: string) => {
  return useQuery({
    queryKey: queryKeys.lists(boardId),
    queryFn: () => listApi.getListsByBoard(boardId),
    enabled: !!boardId,
  });
};

export const useCreateList = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      currentListsCount,
    }: {
      title: string;
      currentListsCount: number;
    }) => listApi.createList(title, boardId, currentListsCount),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(boardId),
      });
    },
  });
};

export const useReorderLists = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ updates }: ReorderListsVariables) =>
      listApi.reorder(updates),

    onMutate: async ({ boardId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.lists(boardId) });
    },

    onError: (err, variables) => {
      queryClient.setQueryData(
        queryKeys.lists(variables.boardId),
        variables.previousLists,
      );
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(variables.boardId),
      });
    },
  });
};
