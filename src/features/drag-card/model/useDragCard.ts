import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useReorderCards } from "@/entities/card/hooks";
import { queryKeys } from "@/shared/api/queryKeys";
import { useReorderLists } from "@/entities/list/hooks";
import { Card } from "@/entities/card/types";
import { List } from "@/entities/list/types";

export const useDragCard = (boardId: string, listId: string = "") => {
  const queryClient = useQueryClient();
  const reorderMutation = useReorderCards(listId);
  const reorderListsMutation = useReorderLists(boardId);

  const handleDragEnd = (event: DragEndEvent, lists: List[]) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (active.data.current?.type === "List") {
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
    let overListId = over.data.current?.sortable.containerId || overId;

    if (overListId.startsWith("Sortable-")) {
      overListId = overId;
    }

    if (!activeListId || !overListId) {
      return;
    }

    const sourceCards =
      queryClient.getQueryData<Card[]>(queryKeys.cards(activeListId)) || [];

    if (activeListId === overListId) {
      const oldIndex = sourceCards.findIndex((c) => c.id === activeId);
      const newIndex = sourceCards.findIndex((c) => c.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newCards = arrayMove(sourceCards, oldIndex, newIndex);

        queryClient.setQueryData(["cards", activeListId], newCards);

        reorderMutation.mutate(
          newCards.map((c, i) => ({
            id: c.id,
            listId: activeListId,
            order: i,
          })),
        );
      }
      return;
    }

    const targetCards =
      queryClient.getQueryData<Card[]>(queryKeys.cards(overListId)) || [];
    const activeCard = sourceCards.find((c) => c.id === activeId);
    if (!activeCard) return;

    const newSourceCards = sourceCards.filter((c) => c.id !== activeId);
    const overIndex = targetCards.findIndex((c) => c.id === overId);
    const insertionIndex = overIndex >= 0 ? overIndex : targetCards.length;

    const newTargetCards = [...targetCards];
    newTargetCards.splice(insertionIndex, 0, {
      ...activeCard,
      listId: overListId,
    });

    queryClient.setQueryData(queryKeys.cards(activeListId), newSourceCards);
    queryClient.setQueryData(queryKeys.cards(overListId), newTargetCards);

    reorderMutation.mutate([
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
    ]);
  };
  return { handleDragEnd };
};
