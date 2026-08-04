"use client";

import { useBoards, useCreateBoard } from "@/entities/board/hooks";
import { BoardView } from "@/widgets/board-view";
import { useState } from "react";

export default function Page() {
  const { data: boards } = useBoards();
  const createBoard = useCreateBoard();

  const [title, setTitle] = useState("");
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={() => {
            createBoard.mutate(title, {
              onSuccess: (b) => setActiveBoardId(b.id),
            });
            setTitle("");
          }}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create Board
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {boards?.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBoardId(b.id)}
            className={`px-3 py-1 border ${
              activeBoardId === b.id ? "bg-blue-200" : ""
            }`}
          >
            {b.title}
          </button>
        ))}
      </div>

      {activeBoardId && <BoardView boardId={activeBoardId} />}
    </div>
  );
}
