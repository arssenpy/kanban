"use client";

import { useBoards, useCreateBoard } from "@/entities/board/hooks";
import { useState } from "react";

export default function Page() {
  const { data: boards, isLoading } = useBoards();
  const createBoard = useCreateBoard();

  const [title, setTitle] = useState("");

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Boards</h1>

      <div className="mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={() => {
            createBoard.mutate(title);
            setTitle("");
          }}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create
        </button>
      </div>

      <div>
        {boards?.map((b) => (
          <div key={b.id} className="p-2 border mb-2">
            {b.title}
          </div>
        ))}
      </div>
    </div>
  );
}
