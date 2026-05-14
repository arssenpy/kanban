import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { listApi } from "./api";
import { queryKeys } from "@/shared/api/queryKeys";

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
    mutationFn: (title: string) => listApi.createList(title, boardId),

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
    mutationFn: listApi.reorder,

    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      console.error(err);
    },
  });
};
