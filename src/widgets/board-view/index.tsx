"use client";

import { useLists, useCreateList } from "@/entities/list/hooks";
import { ListColumn } from "../list-column";
import { useState } from "react";

export function BoardView({ boardId }: { boardId: string }) {
  const { data: lists } = useLists(boardId);
  const createList = useCreateList(boardId);

  const [title, setTitle] = useState("");

  return (
    <div>
      <div className="mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={() => {
            createList.mutate(title);
            setTitle("");
          }}
          className="bg-green-500 text-white px-4 py-2"
        >
          Create List
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto">
        {lists?.map((list) => (
          <ListColumn key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
}
