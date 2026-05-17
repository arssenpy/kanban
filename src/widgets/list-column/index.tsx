"use client";

import { memo, useMemo, useCallback } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCards, useCreateCard } from "@/entities/card/hooks";
import { CardItem } from "@/widgets/card-item";
import { List } from "@/entities/list/types";
import { CreateCardForm } from "./Create-Card-Form";

export const ListColumn = memo(({ list }: { list: List }) => {
  const { data: cards = [] } = useCards(list.id);
  const createCard = useCreateCard(list.id);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: { type: "List", list },
  });

  const handleCreateCard = useCallback(
    (title: string) => {
      createCard.mutate(title);
    },
    [createCard],
  );

  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-64 bg-gray-100 p-3 rounded flex-shrink-0 flex flex-col max-h-[80vh]"
    >
      <h3
        {...attributes}
        {...listeners}
        className="font-bold mb-2 cursor-grab active:cursor-grabbing select-none"
      >
        {list.title}
      </h3>

      <CreateCardForm onCreate={handleCreateCard} />

      <SortableContext
        id={list.id}
        items={cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
});

ListColumn.displayName = "ListColumn";
