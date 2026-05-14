import { useSortable } from "@dnd-kit/sortable";
import { Card } from "@/entities/card/types";
import { memo } from "react";
import { CSS } from "@dnd-kit/utilities";

export const CardItem = memo(
  ({ card }: { card: Card }) => {
    const {
      setNodeRef,
      attributes,
      listeners,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: card.id,
      data: { type: "Card", card },
    });

    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.4 : 1,
        }}
        {...attributes}
        {...listeners}
        className="bg-white p-2 rounded shadow cursor-grab active:cursor-grabbing"
      >
        {card.title}
      </div>
    );
  },

  (prevProps, nextProps) =>
    prevProps.card.id === nextProps.card.id &&
    prevProps.card.title === nextProps.card.title,
);

CardItem.displayName = "CardItem";
