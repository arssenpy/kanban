import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { cardApi } from "./api";
import { queryKeys } from "@/shared/api/queryKeys";

export const useCards = (listId: string) => {
  return useQuery({
    queryKey: queryKeys.cards(listId),
    queryFn: () => cardApi.getCardsByList(listId),
    enabled: !!listId,
  });
};

export const useCreateCard = (listId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => cardApi.createCard(title, listId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cards(listId),
      });
    },
  });
};

export const useReorderCards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cardApi.reorder,

    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      console.error("Failed to reorder:", err);
    },
  });
};
