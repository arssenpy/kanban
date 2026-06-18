"use client";

import { useLists, useCreateList } from "@/entities/list/hooks";
import { ListColumn } from "../list-column";
import { useState, useCallback, useMemo } from "react";
import { DndContext, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { useDragCard } from "@/features/drag-card/model/useDragCard";
import { CardItem } from "@/widgets/card-item";
import { Card } from "@/entities/card/types";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { List } from "@/entities/list/types";
import { CreateListForm } from "./Create-List-Form";

export function BoardView({ boardId }: { boardId: string }) {
  const { data: lists = [] } = useLists(boardId);
  const createList = useCreateList(boardId);
  const { handleDragEnd } = useDragCard(boardId);

  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeList, setActiveList] = useState<List | null>(null);

  const handleCreateList = useCallback(
    (title: string) => {
      createList.mutate({ title, currentListsCount: lists.length });
    },
    [CreateListForm, lists.length],
  );

  const listIds = useMemo(() => lists.map((l) => l.id), [lists]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "List") {
      setActiveList(active.data.current.list);
    } else {
      setActiveCard(active.data.current?.card || null);
    }
  }, []);

  const handleDragEndCallback = useCallback(
    (event: any) => {
      handleDragEnd(event, lists);
      setActiveCard(null);
      setActiveList(null);
    },
    [handleDragEnd, lists],
  );

  return (
    <div className="p-4">
      <CreateListForm onCreate={handleCreateList} />

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEndCallback}
      >
        <SortableContext
          items={listIds}
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
