"use client";

import { useLists, useCreateList } from "@/entities/list/hooks";
import { ListColumn } from "../list-column";
import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { useDragCard } from "@/features/drag-card/model/useDragCard";

export function BoardView({ boardId }: { boardId: string }) {
  const { data: lists = [] } = useLists(boardId);
  const createList = useCreateList(boardId);
  const { handleDragEnd } = useDragCard();

  const [title, setTitle] = useState("");

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
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

      <DndContext onDragEnd={(e) => handleDragEnd(e, lists)}>
        <div className="flex gap-4 overflow-x-auto">
          {lists.map((list) => (
            <ListColumn key={list.id} list={list} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
