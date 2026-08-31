import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { listApi } from "./api";
import { queryKeys } from "@/shared/api/queryKeys";
import { List } from "./types";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";

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
      toast.success("List created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create list"));
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

    onError: (error, variables) => {
      queryClient.setQueryData(
        queryKeys.lists(variables.boardId),
        variables.previousLists,
      );
      toast.error(getErrorMessage(error, "Failed to save list order"));
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(variables.boardId),
      });
    },
  });
};

export const useDeleteList = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listApi.deleteList,

    onMutate: async (listId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.lists(boardId) });
      const previousLists = queryClient.getQueryData<List[]>(
        queryKeys.lists(boardId),
      );

      queryClient.setQueryData<List[]>(queryKeys.lists(boardId), (old) =>
        old?.filter((l) => l.id !== listId),
      );

      return { previousLists };
    },

    onError: (error, listId, context) => {
      queryClient.setQueryData(
        queryKeys.lists(boardId),
        context?.previousLists,
      );
      toast.error(getErrorMessage(error, "Failed to delete list"));
    },

    onSuccess: () => {
      toast.success("List deleted");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists(boardId) });
    },
  });
};
