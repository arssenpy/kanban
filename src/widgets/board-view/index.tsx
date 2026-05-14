"use client";

import { useLists, useCreateList } from "@/entities/list/hooks";
import { ListColumn } from "../list-column";
import { useState } from "react";
import { DndContext, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { useDragCard } from "@/features/drag-card/model/useDragCard";
import { CardItem } from "@/widgets/card-item";
import { Card } from "@/entities/card/types";
import { SortableContext } from "@dnd-kit/sortable";
import { horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { List } from "@/entities/list/types";

export function BoardView({ boardId }: { boardId: string }) {
  const { data: lists = [] } = useLists(boardId);
  const createList = useCreateList(boardId);
  const { handleDragEnd } = useDragCard();

  const [title, setTitle] = useState("");

  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeList, setActiveList] = useState<List | null>(null);

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
          placeholder="New list..."
        />
        <button
          onClick={() => {
            if (!title.trim()) return;
            createList.mutate(title);
            setTitle("");
          }}
          className="bg-green-500 text-white px-4"
        >
          Add List
        </button>
      </div>

      <DndContext
        onDragStart={(event) => {
          const { active } = event;
          if (active.data.current?.type === "List") {
            setActiveList(active.data.current.list);
          } else {
            setActiveCard(active.data.current?.card || null);
          }
        }}
        onDragEnd={(e) => {
          handleDragEnd(e, lists);
          setActiveCard(null);
          setActiveList(null);
        }}
      >
        <SortableContext
          items={lists.map((l) => l.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 items-start overflow-x-auto p-4">
            {lists.map((list) => (
              <ListColumn key={list.id} list={list} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeList ? (
            <div className="opacity-90 scale-105">
              <ListColumn list={activeList} />
            </div>
          ) : activeCard ? (
            <div className="opacity-80 rotate-3">
              <CardItem card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
