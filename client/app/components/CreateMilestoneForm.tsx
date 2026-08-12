"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

type CreateMilestoneFormProps = {
  onMilestoneCreated: () => void | Promise<void>;
  onClose: () => void;
};

const categorySuggestions = [
  "Education",
  "Career",
  "Creative",
  "Personal",
  "Travel",
];

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!session?.user?.id || !session.accessToken) {
      setMessage(
        "Your session is unavailable. Please sign in again."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/milestones`,
        {
          method: "POST",
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
          data.message || "Could not create milestone"
        );
      }

      setTitle("");
      setDescription("");
      setDate("");
      setCategory("");

      await onMilestoneCreated();
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

  if (status === "loading") {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#173f43] px-6 text-[#f5efe3]">
        <div className="text-center">
          <span className="mx-auto block h-2 w-2 animate-pulse rounded-full bg-[#f0a087]" />

          <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-[#f5efe3]/55">
            Loading your session
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#173f43] px-8 text-center text-[#f5efe3]">
        <div className="max-w-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#f0a087]">
            Sign in required
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-[0.95] tracking-[-0.04em]">
            Your archive begins after you sign in.
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 rounded-full border border-[#f5efe3]/25 px-6 py-3 text-[10px] uppercase tracking-[0.17em] text-[#f5efe3]/75 transition hover:border-[#f5efe3] hover:text-[#f5efe3]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative min-h-full w-full overflow-y-auto bg-[#e9e2d4] text-[#173f43]"
    >
      <header className="sticky top-0 z-10 border-b border-[#173f43]/12 bg-[#e9e2d4]/95 px-6 py-6 backdrop-blur-xl md:px-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#d46f5e]">
              New chapter
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-[0.95] tracking-[-0.04em] md:text-5xl">
              Create a milestone.
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close milestone form"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#173f43]/15 text-xl text-[#173f43]/55 transition hover:border-[#173f43] hover:bg-[#173f43] hover:text-[#f5efe3]"
          >
            ×
          </button>
        </div>

        <p className="mt-5 max-w-md text-sm leading-6 text-[#173f43]/58">
          Preserve a moment, achievement or experience that
          helped shape who you are becoming.
        </p>
      </header>

      <div className="space-y-7 px-6 py-8 md:px-9 md:py-10">
        <label className="block">
          <span className="mb-2 block text-[9px] uppercase tracking-[0.26em] text-[#173f43]/48">
            Title
          </span>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="What happened?"
            required
            className="w-full border border-[#173f43]/18 bg-[#f7f1e7] px-4 py-3.5 text-base text-[#173f43] outline-none transition placeholder:text-[#173f43]/28 focus:border-[#d46f5e] focus:ring-2 focus:ring-[#d46f5e]/10"
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
            placeholder="Tell the story behind this chapter..."
            required
            rows={6}
            className="w-full resize-none border border-[#173f43]/18 bg-[#f7f1e7] px-4 py-3.5 text-base leading-7 text-[#173f43] outline-none transition placeholder:text-[#173f43]/28 focus:border-[#d46f5e] focus:ring-2 focus:ring-[#d46f5e]/10"
          />
        </label>

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
            className="w-full border border-[#173f43]/18 bg-[#f7f1e7] px-4 py-3.5 text-base text-[#173f43] outline-none transition focus:border-[#d46f5e] focus:ring-2 focus:ring-[#d46f5e]/10"
          />
        </label>

        <div>
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-[0.26em] text-[#173f43]/48">
              Category
            </span>

            <input
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              placeholder="For example: Education"
              required
              className="w-full border border-[#173f43]/18 bg-[#f7f1e7] px-4 py-3.5 text-base text-[#173f43] outline-none transition placeholder:text-[#173f43]/28 focus:border-[#d46f5e] focus:ring-2 focus:ring-[#d46f5e]/10"
            />
          </label>

          <div className="mt-3 flex flex-wrap gap-2">
            {categorySuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setCategory(suggestion)}
                className={`rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] transition ${
                  category.toLowerCase() ===
                  suggestion.toLowerCase()
                    ? "border-[#d46f5e] bg-[#d46f5e] text-[#173f43]"
                    : "border-[#173f43]/16 text-[#173f43]/50 hover:border-[#173f43]/40 hover:text-[#173f43]"
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
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

      <footer className="sticky bottom-0 border-t border-[#173f43]/12 bg-[#e9e2d4]/95 px-6 py-5 backdrop-blur-xl md:px-9">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="hidden max-w-[250px] text-xs leading-5 text-[#173f43]/42 sm:block">
            You can add links, files and other evidence after
            creating this chapter.
          </p>

          <div className="flex gap-3 sm:ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-[#173f43]/18 px-6 py-3 text-[10px] uppercase tracking-[0.17em] text-[#173f43]/60 transition hover:border-[#173f43] hover:text-[#173f43] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#d46f5e] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#173f43] shadow-[0_10px_28px_rgba(212,111,94,0.2)] transition hover:-translate-y-0.5 hover:bg-[#f0a087] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Creating..."
                : "Add milestone"}
            </button>
          </div>
        </div>
      </footer>
    </form>
  );
}