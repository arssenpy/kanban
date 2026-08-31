import { useSortable } from "@dnd-kit/sortable";
import { Card } from "@/entities/card/types";
import { memo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useDeleteCard } from "@/entities/card/hooks";

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

    const deleteCard = useDeleteCard(card.listId);

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation(); // щоб клік по кнопці не тригерив drag
      if (window.confirm(`Видалити картку "${card.title}"?`)) {
        deleteCard.mutate(card.id);
      }
    };

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
        className="group bg-white p-2 rounded shadow cursor-grab active:cursor-grabbing flex justify-between items-start gap-2"
      >
        <span>{card.title}</span>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 text-sm transition-opacity"
          aria-label="Delete Card"
        >
          ✕
        </button>
      </div>
    );
  },

  (prevProps, nextProps) =>
    prevProps.card.id === nextProps.card.id &&
    prevProps.card.title === nextProps.card.title,
);

CardItem.displayName = "CardItem";
