import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { listApi } from "./api";
import { queryKeys } from "@/shared/api/queryKeys";

export const useLists = (boardId: string) => {
  return useQuery({
    queryKey: queryKeys.lists(boardId),
    queryFn: () => listApi.getListsByBoard(boardId), // Взято точно з твого api.ts
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

export const useReorderLists = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listApi.reorder, // Взято з твого api.ts

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(boardId),
      });
    },

    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists(boardId) });
    },
  });
};
