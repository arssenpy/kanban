import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "./api";
import { queryKeys } from "@/shared/api/queryKeys";

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
    },
  });
};
