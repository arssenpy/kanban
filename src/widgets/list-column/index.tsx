"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { useCards, useCreateCard } from "@/entities/card/hooks";
import { CardItem } from "@/widgets/card-item";
import { List } from "@/entities/list/types";
import { useState } from "react";

export function ListColumn({ list }: { list: List }) {
  const { data: cards = [] } = useCards(list.id);
  const createCard = useCreateCard(list.id);

  const [title, setTitle] = useState("");

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

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-64 bg-gray-100 p-3 rounded flex-shrink-0"
    >
      <h3
        {...attributes}
        {...listeners}
        className="font-bold mb-2 cursor-grab active:cursor-grabbing"
      >
        {list.title}
      </h3>

      <div className="mb-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-1 w-full"
        />
        <button
          onClick={() => {
            if (!title.trim()) return;
            createCard.mutate(title);
            setTitle("");
          }}
          className="bg-blue-500 text-white w-full mt-1"
        >
          Add Card
        </button>
      </div>

      <SortableContext
        id={list.id}
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
