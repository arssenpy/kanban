import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { cardApi } from "./api";
import { queryKeys } from "@/shared/api/queryKeys";
import { Card } from "./types";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";

type CardReorderUpdate = { id: string; order: number; listId: string };
type ReorderCardsVariables = {
  updates: CardReorderUpdate[];
  affectedListIds: string[];
  previousCache: { listId: string; cards: Card[] | undefined }[];
};

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
    mutationFn: ({
      title,
      currentCardsCount,
    }: {
      title: string;
      currentCardsCount: number;
    }) => cardApi.createCard(title, listId, currentCardsCount),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards(listId) });
      toast.success("Card created");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create card"));
    },
  });
};

export const useReorderCards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ updates }: ReorderCardsVariables) =>
      cardApi.reorder(updates),

    onMutate: async ({ affectedListIds }) => {
      await Promise.all(
        affectedListIds.map((listId) =>
          queryClient.cancelQueries({ queryKey: queryKeys.cards(listId) }),
        ),
      );
    },

    onError: (error, variables) => {
      variables.previousCache.forEach(({ listId, cards }) => {
        queryClient.setQueryData(queryKeys.cards(listId), cards);
        toast.error(getErrorMessage(error, "Failed to save card order"));
      });
    },

    onSettled: (data, error, variables) => {
      variables.affectedListIds.forEach((listId) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.cards(listId) });
      });
    },
  });
};
