import { memo, useState } from "react";

export const CreateCardForm = memo(
  ({ onCreate }: { onCreate: (title: string) => void }) => {
    const [title, setTitle] = useState("");

    const handleSubmit = () => {
      if (!title.trim()) return;
      onCreate(title);
      setTitle("");
    };

    return (
      <div className="mb-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-1 w-full text-sm rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white w-full mt-1 text-sm p-1 rounded font-medium"
        >
          Add Card
        </button>
      </div>
    );
  },
);
CreateCardForm.displayName = "CreateCardForm";
