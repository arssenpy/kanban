import { memo, useState } from "react";

export const CreateListForm = memo(
  ({ onCreate }: { onCreate: (title: string) => void }) => {
    const [title, setTitle] = useState("");

    const handleSubmit = () => {
      if (!title.trim()) return;
      onCreate(title);
      setTitle("");
    };

    return (
      <div className="mb-4 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
          placeholder="New list..."
        />
        <button onClick={handleSubmit} className="bg-green-500 text-white px-4">
          Add List
        </button>
      </div>
    );
  },
);

CreateListForm.displayName = "CreateListForm";
