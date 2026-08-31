"use client";

import {
  useBoards,
  useCreateBoard,
  useDeleteBoard,
} from "@/entities/board/hooks";
import { BoardView } from "@/widgets/board-view";
import { useState, useEffect } from "react";

export default function Page() {
  const { data: boards, isLoading } = useBoards();
  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();

  const [title, setTitle] = useState("");
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

  useEffect(() => {
    if (
      activeBoardId &&
      boards &&
      !boards.some((b) => b.id === activeBoardId)
    ) {
      setActiveBoardId(null);
    }
  }, [boards, activeBoardId]);

  const handleCreateBoard = () => {
    if (!title.trim()) return;
    createBoard.mutate(title, {
      onSuccess: (b) => setActiveBoardId(b.id),
    });
    setTitle("");
  };

  const handleDeleteBoard = (
    e: React.MouseEvent,
    boardId: string,
    boardTitle: string,
  ) => {
    e.stopPropagation();
    if (
      window.confirm(`Delete board "${boardTitle}" with all lists and cards?`)
    ) {
      deleteBoard.mutate(boardId);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
          placeholder="Board name"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCreateBoard}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create Board
        </button>
      </div>

      {isLoading ? (
        <div className="text-gray-400 py-8 text-center">Loading boards...</div>
      ) : boards && boards.length === 0 ? (
        <div className="text-gray-400 py-8 text-center">
          You haven't created any boards yet
        </div>
      ) : (
        <div className="flex gap-2 mb-4 flex-wrap">
          {boards?.map((b) => (
            <div
              key={b.id}
              className={`group flex items-center gap-1 px-3 py-1 border cursor-pointer ${
                activeBoardId === b.id ? "bg-blue-200" : ""
              }`}
              onClick={() => setActiveBoardId(b.id)}
            >
              <span>{b.title}</span>
              <button
                onClick={(e) => handleDeleteBoard(e, b.id, b.title)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 text-xs transition-opacity"
                aria-label="Delete board"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {activeBoardId && <BoardView boardId={activeBoardId} />}
    </div>
  );
}
