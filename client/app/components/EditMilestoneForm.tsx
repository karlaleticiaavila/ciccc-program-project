"use client";
import {useSession} from "next-auth/react";
import { FormEvent, useState } from "react";
import { Milestone } from "@/lib/types/milestone";

type EditMilestoneFormProps = {
  milestone: Milestone;
  onMilestoneUpdated: () => Promise<void>;
  onClose: () => void;
};

export default function EditMilestoneForm({
  milestone,
  onMilestoneUpdated,
  onClose,
}: EditMilestoneFormProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState(milestone.title);
  const [description, setDescription] = useState(
    milestone.description
  );
  const [date, setDate] = useState(
    milestone.date.slice(0, 10)
  );
  const [category, setCategory] = useState(
    milestone.category
  );
  const [message, setMessage] = useState("");

const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  try {
    const response = await fetch(
      `http://localhost:5000/api/milestones/${milestone._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
            authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          date,
          category,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not update milestone");
    }

    setMessage("Milestone updated successfully");

    await onMilestoneUpdated();
    onClose();
  } catch (error) {
    setMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  }
};
  return (
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={onClose}>
        ×
      </button>

      <h2>Edit milestone</h2>

      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <textarea
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
      />

      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />

      <input
        value={category}
        onChange={(event) =>
          setCategory(event.target.value)
        }
      />

      <button type="submit">Save changes</button>

      {message && <p>{message}</p>}
    </form>
  );
}