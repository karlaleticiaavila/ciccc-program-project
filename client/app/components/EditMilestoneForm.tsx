"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

import type { Milestone } from "@/lib/types/milestone";

type EditMilestoneFormProps = {
  milestone: Milestone;
  onMilestoneUpdated: () => Promise<void>;
  onClose: () => void;
};

const categorySuggestions = [
  "Education",
  "Career",
  "Creative",
  "Personal",
  "Travel",
];

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
      setMessage(
        "Your session is unavailable. Please sign in again."
      );
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
        overflow-hidden
        rounded-[24px]
        border
        border-[#173f43]/15
        bg-[#e9e2d4]
        text-[#173f43]
      "
    >
      <header className="border-b border-[#173f43]/12 px-5 py-6 md:px-7">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#d46f5e]">
              Edit milestone
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-[0.95] tracking-[-0.04em] md:text-5xl">
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
              border-[#173f43]/15
              text-xl
              text-[#173f43]/55
              transition
              hover:border-[#173f43]
              hover:bg-[#173f43]
              hover:text-[#f5efe3]
            "
          >
            ×
          </button>
        </div>

        <p className="mt-5 max-w-md text-sm leading-6 text-[#173f43]/58">
          Update the details of this milestone without losing
          its evidence or place in your journey.
        </p>
      </header>

      <div className="space-y-7 px-5 py-7 md:px-7 md:py-8">
        <label className="block">
          <span className="mb-2 block text-[9px] uppercase tracking-[0.26em] text-[#173f43]/48">
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
              border-[#173f43]/18
              bg-[#f7f1e7]
              px-4
              py-3.5
              text-base
              text-[#173f43]
              outline-none
              transition
              focus:border-[#d46f5e]
              focus:ring-2
              focus:ring-[#d46f5e]/10
            "
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[9px] uppercase tracking-[0.26em] text-[#173f43]/48">
            Description
          </span>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={6}
            className="
              w-full
              resize-none
              border
              border-[#173f43]/18
              bg-[#f7f1e7]
              px-4
              py-3.5
              text-base
              leading-7
              text-[#173f43]
              outline-none
              transition
              focus:border-[#d46f5e]
              focus:ring-2
              focus:ring-[#d46f5e]/10
            "
          />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-[0.26em] text-[#173f43]/48">
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
                border-[#173f43]/18
                bg-[#f7f1e7]
                px-4
                py-3.5
                text-base
                text-[#173f43]
                outline-none
                transition
                focus:border-[#d46f5e]
                focus:ring-2
                focus:ring-[#d46f5e]/10
              "
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-[0.26em] text-[#173f43]/48">
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
                border-[#173f43]/18
                bg-[#f7f1e7]
                px-4
                py-3.5
                text-base
                text-[#173f43]
                outline-none
                transition
                focus:border-[#d46f5e]
                focus:ring-2
                focus:ring-[#d46f5e]/10
              "
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {categorySuggestions.map((suggestion) => {
            const isSelected =
              category.trim().toLowerCase() ===
              suggestion.toLowerCase();

            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => setCategory(suggestion)}
                className={`
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-[9px]
                  uppercase
                  tracking-[0.16em]
                  transition
                  ${
                    isSelected
                      ? "border-[#d46f5e] bg-[#d46f5e] text-[#173f43]"
                      : "border-[#173f43]/16 text-[#173f43]/50 hover:border-[#173f43]/40 hover:text-[#173f43]"
                  }
                `}
              >
                {suggestion}
              </button>
            );
          })}
        </div>

        {message && (
          <p
            role="alert"
            className="border border-[#b85f54]/25 bg-[#b85f54]/10 px-4 py-3 text-sm text-[#8e4038]"
          >
            {message}
          </p>
        )}
      </div>

      <footer className="flex flex-col-reverse gap-3 border-t border-[#173f43]/12 px-5 py-5 sm:flex-row sm:justify-end md:px-7">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="
            rounded-full
            border
            border-[#173f43]/18
            px-6
            py-3
            text-[10px]
            uppercase
            tracking-[0.17em]
            text-[#173f43]/60
            transition
            hover:border-[#173f43]
            hover:text-[#173f43]
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            rounded-full
            bg-[#d46f5e]
            px-6
            py-3
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.17em]
            text-[#173f43]
            shadow-[0_10px_28px_rgba(212,111,94,0.2)]
            transition
            hover:-translate-y-0.5
            hover:bg-[#f0a087]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isSubmitting
            ? "Saving changes..."
            : "Save changes"}
        </button>
      </footer>
    </form>
  );
}