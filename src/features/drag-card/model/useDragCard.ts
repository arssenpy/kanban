import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { Card } from "@/entities/card/types";
import { List } from "@/entities/list/types";

export const useDragCard = () => {
  const queryClient = useQueryClient();

  const handleDragEnd = (event: DragEndEvent, lists: List[]) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let activeCard: Card | undefined;
    let overCard: Card | undefined;

    for (const list of lists) {
      const cards =
        queryClient.getQueryData<Card[]>(queryKeys.cards(list.id)) || [];

      for (const c of cards) {
        if (c.id === activeId) activeCard = c;
        if (c.id === overId) overCard = c;
      }
    }

    if (!activeCard || !overCard) return;

    if (activeCard.listId === overCard.listId) {
      const cards =
        queryClient.getQueryData<Card[]>(queryKeys.cards(activeCard.listId)) ||
        [];

      const oldIndex = cards.findIndex((c) => c.id === activeId);
      const newIndex = cards.findIndex((c) => c.id === overId);

      const newCards = arrayMove(cards, oldIndex, newIndex);

      queryClient.setQueryData(queryKeys.cards(activeCard.listId), newCards);

      return;
    }

    const source =
      queryClient.getQueryData<Card[]>(queryKeys.cards(activeCard.listId)) ||
      [];

    const target =
      queryClient.getQueryData<Card[]>(queryKeys.cards(overCard.listId)) || [];

    const activeIndex = source.findIndex((c) => c.id === activeId);
    const overIndex = target.findIndex((c) => c.id === overId);

    const card = source[activeIndex];

    const newSource = source.filter((c) => c.id !== activeId);

    const newTarget = [
      ...target.slice(0, overIndex),
      { ...card, listId: overCard.listId },
      ...target.slice(overIndex),
    ];

    queryClient.setQueryData(queryKeys.cards(activeCard.listId), newSource);

    queryClient.setQueryData(queryKeys.cards(overCard.listId), newTarget);
  };

  return { handleDragEnd };
};
