import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useReorderCards } from "@/entities/card/hooks";
import { queryKeys } from "@/shared/api/queryKeys";
import { useReorderLists } from "@/entities/list/hooks";
import { Card } from "@/entities/card/types";
import { List } from "@/entities/list/types";

export const useDragCard = (boardId: string) => {
  const queryClient = useQueryClient();
  const reorderCardsMutation = useReorderCards();
  const reorderListsMutation = useReorderLists();

  const handleDragEnd = (event: DragEndEvent, lists: List[]) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (active.data.current?.type === "List") {
      const oldIndex = lists.findIndex((l) => l.id === activeId);
      const newIndex = lists.findIndex((l) => l.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const previousLists = queryClient.getQueryData<List[]>(
          queryKeys.lists(boardId),
        );
        const newLists = arrayMove(lists, oldIndex, newIndex).map((l, i) => ({
          ...l,
          order: i,
        }));

        queryClient.setQueryData(queryKeys.lists(boardId), newLists);

        reorderListsMutation.mutate({
          boardId,
          updates: newLists.map((l) => ({ id: l.id, order: l.order })),
          previousLists,
        });
      }
      return;
    }

    const activeListId = active.data.current?.sortable.containerId;
    let overListId = over.data.current?.sortable.containerId || overId;

    if (overListId.startsWith("Sortable-")) {
      overListId = overId;
    }

    if (!activeListId || !overListId) return;

    const sourceCards =
      queryClient.getQueryData<Card[]>(queryKeys.cards(activeListId)) || [];

    if (activeListId === overListId) {
      const oldIndex = sourceCards.findIndex((c) => c.id === activeId);
      const newIndex = sourceCards.findIndex((c) => c.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const previousCards = queryClient.getQueryData<Card[]>(
        queryKeys.cards(activeListId),
      );
      const newCards = arrayMove(sourceCards, oldIndex, newIndex).map(
        (c, i) => ({
          ...c,
          order: i,
        }),
      );

      queryClient.setQueryData(queryKeys.cards(activeListId), newCards);

      reorderCardsMutation.mutate({
        updates: newCards.map((c) => ({
          id: c.id,
          order: c.order,
          listId: activeListId,
        })),
        affectedListIds: [activeListId],
        previousCache: [{ listId: activeListId, cards: previousCards }],
      });
      return;
    }

    const targetCards =
      queryClient.getQueryData<Card[]>(queryKeys.cards(overListId)) || [];
    const activeCard = sourceCards.find((c) => c.id === activeId);
    if (!activeCard) return;

    const previousSourceCards = queryClient.getQueryData<Card[]>(
      queryKeys.cards(activeListId),
    );
    const previousTargetCards = queryClient.getQueryData<Card[]>(
      queryKeys.cards(overListId),
    );

    const newSourceCards = sourceCards
      .filter((c) => c.id !== activeId)
      .map((c, i) => ({ ...c, order: i }));

    const overIndex = targetCards.findIndex((c) => c.id === overId);
    const insertionIndex = overIndex >= 0 ? overIndex : targetCards.length;

    const newTargetCardsRaw = [...targetCards];
    newTargetCardsRaw.splice(insertionIndex, 0, {
      ...activeCard,
      listId: overListId,
    });
    const newTargetCards = newTargetCardsRaw.map((c, i) => ({
      ...c,
      order: i,
    }));

    queryClient.setQueryData(queryKeys.cards(activeListId), newSourceCards);
    queryClient.setQueryData(queryKeys.cards(overListId), newTargetCards);

    reorderCardsMutation.mutate({
      updates: [
        ...newSourceCards.map((c) => ({
          id: c.id,
          order: c.order,
          listId: activeListId,
        })),
        ...newTargetCards.map((c) => ({
          id: c.id,
          order: c.order,
          listId: overListId,
        })),
      ],
      affectedListIds: [activeListId, overListId],
      previousCache: [
        { listId: activeListId, cards: previousSourceCards },
        { listId: overListId, cards: previousTargetCards },
      ],
    });
  };

  return { handleDragEnd };
};
