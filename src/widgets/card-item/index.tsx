import { useSortable } from "@dnd-kit/sortable";
import { Card } from "@/entities/card/types";
import { memo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
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
      e.stopPropagation();
      e.preventDefault();
      if (window.confirm(`Delete card "${card.title}"?`)) {
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
        className="group bg-white p-2 rounded shadow flex items-start gap-2"
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 mt-0.5 touch-none"
          aria-label="Drag card"
        >
          <GripVertical size={16} />
        </button>

        <span className="flex-1 break-words">{card.title}</span>

        <button
          type="button"
          onClick={handleDelete}
          onPointerDown={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 shrink-0 transition-opacity"
          aria-label="Delete Card"
        >
          <X size={16} />
        </button>
      </div>
    );
  },

  (prevProps, nextProps) =>
    prevProps.card.id === nextProps.card.id &&
    prevProps.card.title === nextProps.card.title,
);

CardItem.displayName = "CardItem";
