import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "./api";
import { queryKeys } from "@/shared/api/queryKeys";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import { Board } from "./types";

export const useBoards = () => {
  return useQuery({
    queryKey: queryKeys.boards,
    queryFn: boardsApi.getBoards,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardsApi.createBoards,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.boards,
      });
      toast.success("Board created");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create board"));
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardsApi.deleteBoard,

    onMutate: async (boardId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.boards });
      const previousBoards = queryClient.getQueryData<Board[]>(
        queryKeys.boards,
      );

      queryClient.setQueryData<Board[]>(queryKeys.boards, (old) =>
        old?.filter((b) => b.id !== boardId),
      );

      return { previousBoards };
    },

    onError: (error, boardId, context) => {
      queryClient.setQueryData(queryKeys.boards, context?.previousBoards);
      toast.error(getErrorMessage(error, "Failed to delete board"));
    },

    onSuccess: () => {
      toast.success("Board deleted");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards });
    },
  });
};
