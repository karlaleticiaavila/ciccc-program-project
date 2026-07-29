"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

type CreateMilestoneFormProps = {
  onMilestoneCreated: () => void;
  onClose: () => void;
};

export default function CreateMilestoneForm({
  onMilestoneCreated,
  onClose,
}: CreateMilestoneFormProps) {
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const userId = session?.user?.id;

    if (!userId) {
      setMessage("You must sign in before creating a milestone.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/milestones",
        {
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
        }
      );

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

  if (status === "loading") {
    return <p className="text-center">Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <p className="text-center">
        Sign in to create a milestone.
      </p>
    );
  }

  return (
   <form
   
  onSubmit={handleSubmit}
  className="
w-full
max-w-2xl
rounded-[32px]
bg-[#FCFAF8]
p-14
shadow-2xl
flex
flex-col
gap-8
"
>
  <button
  type="button"
  onClick={onClose}
  aria-label="Close form"
  className="absolute right-8 top-8 text-2xl text-neutral-500 transition hover:text-black"
>
  ×
</button>
     <div className="space-y-3">

  <p className="text-xs uppercase tracking-[0.45em] text-neutral-500">
    NEW CHAPTER
  </p>

  <h2 className="font-serif text-5xl leading-none text-neutral-900">
    Create a milestone
  </h2>

  <p className="max-w-md text-neutral-500">
    Tell the story of a moment that shaped your journey.
  </p>

</div>

      <div>
  <label
    className="
      mb-2
      block
      text-xs
      uppercase
      tracking-[0.3em]
      text-neutral-500
    "
  >
    TITLE
  </label>

  <input
    value={title}
    onChange={(event) => setTitle(event.target.value)}
    required
    className="
      w-full
      border-0
      border-b
      border-neutral-300
      bg-transparent
      px-0
      py-4
      text-lg
      outline-none
      transition
      focus:border-black
    "
  />

  <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-neutral-500">
    DESCRIPTION
  </label>

  <textarea
  value={description}
  onChange={(event) => setDescription(event.target.value)}
  placeholder="Tell the story behind this chapter..."
  required
  className="
    min-h-32
    w-full
    resize-none
    border-0
    border-b
    border-neutral-300
    bg-transparent
    px-0
    py-4
    text-neutral-900
    outline-none
    transition
    placeholder:text-neutral-400
    focus:border-black
  "
/>
</div>

      <div>
  <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-neutral-500">
    DATE
  </label>

  <input
    type="date"
    value={date}
    onChange={(event) => setDate(event.target.value)}
    required
     className="
    w-full
    border-0
    border-b
    border-neutral-300
    bg-transparent
    px-0
    py-4
    text-lg
    text-neutral-900
    outline-none
    transition
    placeholder:text-neutral-400
    focus:border-black
  "
  />
</div>

      <div>
  <label
    className="
      mb-2
      block
      text-xs
      uppercase
      tracking-[0.3em]
      text-neutral-500
    "
  >
    CATEGORY
  </label>

  <input
  value={category}
  onChange={(event) => setCategory(event.target.value)}
  placeholder="e.g., Education, Career, Personal Growth"
  required
  className="
    w-full
    border-0
    border-b
    border-neutral-300
    bg-transparent
    px-0
    py-4
    text-lg
    text-neutral-900
    outline-none
    transition
    placeholder:text-neutral-400
    focus:border-black
  "
/>
</div>
      <button
        type="submit"
        className="
mt-6
rounded-full
bg-black
px-10
py-4
text-white
transition
hover:scale-[1.02]
hover:opacity-90
"
      >
        Add milestone
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}