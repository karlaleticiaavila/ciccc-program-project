"use client";

import { FormEvent, useState } from "react";

type CreateMilestoneFormProps = {
  onMilestoneCreated: () => void;
};

export default function CreateMilestoneForm({
  onMilestoneCreated,
}: CreateMilestoneFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/milestones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          date,
          category,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create milestone");
      }

      setMessage("Milestone created successfully");
      setTitle("");
      setDescription("");
      setDate("");
      setCategory("");

      onMilestoneCreated();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-8 flex max-w-xl flex-col gap-4 rounded-2xl border p-6"
    >
      <h2 className="text-2xl font-semibold">Create milestone</h2>

      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Title"
        required
        className="rounded-lg border p-3"
      />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        required
        className="rounded-lg border p-3"
      />

      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        required
        className="rounded-lg border p-3"
      />

      <input
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        placeholder="Category"
        required
        className="rounded-lg border p-3"
      />

      <input
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
        placeholder="Existing user ID"
        required
        className="rounded-lg border p-3"
      />

      <button
        type="submit"
        className="rounded-lg bg-black px-4 py-3 text-white"
      >
        Add milestone
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}