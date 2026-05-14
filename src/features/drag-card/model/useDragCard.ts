import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useReorderCards } from "@/entities/card/hooks";
import { queryKeys } from "@/shared/api/queryKeys";
import { Card } from "@/entities/card/types";
import { List } from "@/entities/list/types";
import { useReorderLists } from "@/entities/list/hooks";

export const useDragCard = () => {
  const queryClient = useQueryClient();
  const reorderMutation = useReorderCards();
  const reorderListsMutation = useReorderLists();

  const handleDragEnd = (event: DragEndEvent, lists: List[]) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeType = active.data.current?.type;

    if (activeType === "List") {
      const oldIndex = lists.findIndex((l) => l.id === activeId);
      const newIndex = lists.findIndex((l) => l.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newLists = arrayMove(lists, oldIndex, newIndex);
        const boardId = lists[0]?.boardId;
        if (boardId) {
          queryClient.setQueryData(queryKeys.lists(boardId), newLists);
          reorderListsMutation.mutate(
            newLists.map((l, i) => ({ id: l.id, order: i })),
          );
        }
      }
      return;
    }

    const activeListId = active.data.current?.sortable.containerId;
    const overListId = over.data.current?.sortable.containerId || overId;

    if (!activeListId || !overListId) return;

    const sourceCards =
      queryClient.getQueryData<Card[]>(queryKeys.cards(activeListId)) || [];
    const targetCards =
      queryClient.getQueryData<Card[]>(queryKeys.cards(overListId)) || [];

    if (activeListId === overListId) {
      const oldIndex = sourceCards.findIndex((c) => c.id === activeId);
      const newIndex = sourceCards.findIndex((c) => c.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newCards = arrayMove(sourceCards, oldIndex, newIndex);
        const payload = newCards.map((c, i) => ({
          id: c.id,
          listId: c.listId,
          order: i,
        }));

        queryClient.setQueryData(queryKeys.cards(activeListId), newCards);
        reorderMutation.mutate(payload);
      }
      return;
    }

    const activeCard = sourceCards.find((c) => c.id === activeId);
    if (!activeCard) return;

    const newSourceCards = sourceCards.filter((c) => c.id !== activeId);
    const newTargetCards = [...targetCards];
    const overIndex = targetCards.findIndex((c) => c.id === overId);
    const insertionIndex = overIndex >= 0 ? overIndex : newTargetCards.length;

    newTargetCards.splice(insertionIndex, 0, {
      ...activeCard,
      listId: overListId,
    });

    queryClient.setQueryData(queryKeys.cards(activeListId), newSourceCards);
    queryClient.setQueryData(queryKeys.cards(overListId), newTargetCards);

    const payload = [
      ...newSourceCards.map((c, i) => ({
        id: c.id,
        listId: activeListId,
        order: i,
      })),
      ...newTargetCards.map((c, i) => ({
        id: c.id,
        listId: overListId,
        order: i,
      })),
    ];

    reorderMutation.mutate(payload);
  };

  return { handleDragEnd };
};
