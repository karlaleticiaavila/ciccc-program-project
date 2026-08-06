"use client";

import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

import type { Milestone } from "@/lib/types/milestone";

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
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!session?.accessToken) {
      setMessage("Your session is unavailable. Please sign in again.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch(
        `http://localhost:5000/api/milestones/${milestone._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            date,
            category: category.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update milestone"
        );
      }

      await onMilestoneUpdated();
      onClose();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        relative
        w-full
        max-w-xl
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-[#18221f]
        p-6
        text-[#edf0e8]
        shadow-[0_30px_100px_rgba(0,0,0,0.55)]
        md:p-8
      "
    >
      <div className="flex items-start justify-between gap-8 border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Edit milestone
          </p>

          <h2 className="mt-3 font-serif text-4xl leading-none tracking-[-0.04em] text-[#f3f0e8]">
            Refine this chapter.
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close edit milestone form"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            text-xl
            text-white/60
            transition
            hover:border-white/40
            hover:bg-white/10
            hover:text-white
          "
        >
          ×
        </button>
      </div>

      <div className="mt-7 space-y-6">
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-white/40">
            Title
          </span>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
            className="
              w-full
              border
              border-white/12
              bg-white/[0.04]
              px-4
              py-3.5
              text-base
              text-white
              outline-none
              transition
              placeholder:text-white/25
              focus:border-[#9fb9a7]
              focus:bg-white/[0.07]
            "
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-white/40">
            Description
          </span>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={5}
            className="
              w-full
              resize-none
              border
              border-white/12
              bg-white/[0.04]
              px-4
              py-3.5
              text-base
              leading-7
              text-white
              outline-none
              transition
              placeholder:text-white/25
              focus:border-[#9fb9a7]
              focus:bg-white/[0.07]
            "
          />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-white/40">
              Date
            </span>

            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              required
              className="
                w-full
                border
                border-white/12
                bg-white/[0.04]
                px-4
                py-3.5
                text-base
                text-white
                outline-none
                transition
                focus:border-[#9fb9a7]
                focus:bg-white/[0.07]
                [color-scheme:dark]
              "
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-white/40">
              Category
            </span>

            <input
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              required
              className="
                w-full
                border
                border-white/12
                bg-white/[0.04]
                px-4
                py-3.5
                text-base
                text-white
                outline-none
                transition
                placeholder:text-white/25
                focus:border-[#9fb9a7]
                focus:bg-white/[0.07]
              "
            />
          </label>
        </div>
      </div>

      {message && (
        <p
          role="alert"
          className="mt-6 border border-red-300/15 bg-red-950/30 px-4 py-3 text-sm text-red-100/80"
        >
          {message}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="
            rounded-full
            border
            border-white/15
            px-6
            py-3
            text-xs
            uppercase
            tracking-[0.16em]
            text-white/60
            transition
            hover:border-white/35
            hover:text-white
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            rounded-full
            bg-[#d9e2d5]
            px-6
            py-3
            text-xs
            font-medium
            uppercase
            tracking-[0.16em]
            text-[#18221f]
            transition
            hover:bg-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}