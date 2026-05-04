"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/entities/card/types";

export function CardItem({ card }: { card: Card }) {
  const { setNodeRef, attributes, listeners, transform } = useSortable({
    id: card.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
      }}
      {...attributes}
      {...listeners}
      className="bg-white p-2 rounded shadow"
    >
      {card.title}
    </div>
  );
}
