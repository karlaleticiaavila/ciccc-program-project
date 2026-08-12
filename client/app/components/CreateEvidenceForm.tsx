"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type EvidenceType =
  | "github"
  | "link"
  | "image"
  | "certificate"
  | "video"
  | "document";

type CreateEvidenceFormProps = {
  milestoneId: string;
  onEvidenceCreated: () => void | Promise<void>;
};

const evidenceOptions: Array<{
  value: EvidenceType;
  label: string;
}> = [
  { value: "github", label: "GitHub repository" },
  { value: "link", label: "External link" },
  { value: "image", label: "Image" },
  { value: "certificate", label: "Certificate" },
  { value: "video", label: "Video" },
  { value: "document", label: "Document" },
];

export default function CreateEvidenceForm({
  milestoneId,
  onEvidenceCreated,
}: CreateEvidenceFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EvidenceType>("github");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setError("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      if (!url.trim() && !file) {
        throw new Error(
          "Please add an evidence URL or select a file."
        );
      }

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("type", type);
      formData.append("description", description.trim());
      formData.append("milestoneId", milestoneId);

      if (url.trim()) {
        formData.append("url", url.trim());
      }

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/evidence`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not create evidence"
        );
      }

      setTitle("");
      setType("github");
      setUrl("");
      setDescription("");
      setFile(null);

      await onEvidenceCreated();
    } catch (error) {
      setError(
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
        overflow-hidden
        border
        border-[#173f43]/15
        bg-[#f1eadf]
        text-[#173f43]
      "
    >
      <div className="border-b border-[#173f43]/12 px-5 py-5 md:px-6">
        <p className="text-[9px] uppercase tracking-[0.3em] text-[#d46f5e]">
          Document your growth
        </p>

        <h3 className="mt-3 font-serif text-3xl leading-none tracking-[-0.035em]">
          Add evidence.
        </h3>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#173f43]/58">
          Attach something that supports this chapter of your
          journey.
        </p>
      </div>

      <div className="space-y-6 px-5 py-6 md:px-6">
        <label className="block">
          <span className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-[#173f43]/48">
            Evidence title
          </span>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="For example: React final project"
            required
            className="
              w-full
              border
              border-[#173f43]/18
              bg-[#f8f3ea]
              px-4
              py-3.5
              text-base
              text-[#173f43]
              outline-none
              transition
              placeholder:text-[#173f43]/30
              focus:border-[#d46f5e]
              focus:ring-2
              focus:ring-[#d46f5e]/10
            "
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-[#173f43]/48">
            Evidence type
          </span>

          <div className="relative">
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as EvidenceType)
              }
              className="
                w-full
                appearance-none
                border
                border-[#173f43]/18
                bg-[#f8f3ea]
                px-4
                py-3.5
                pr-12
                text-base
                text-[#173f43]
                outline-none
                transition
                focus:border-[#d46f5e]
                focus:ring-2
                focus:ring-[#d46f5e]/10
              "
            >
              {evidenceOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#173f43]/45"
            >
              ↓
            </span>
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-[#173f43]/48">
            Evidence URL
          </span>

          <input
            type="url"
            value={url}
            onChange={(event) =>
              setUrl(event.target.value)
            }
            placeholder="https://..."
            className="
              w-full
              border
              border-[#173f43]/18
              bg-[#f8f3ea]
              px-4
              py-3.5
              text-base
              text-[#173f43]
              outline-none
              transition
              placeholder:text-[#173f43]/30
              focus:border-[#d46f5e]
              focus:ring-2
              focus:ring-[#d46f5e]/10
            "
          />

          <p className="mt-2 text-xs leading-5 text-[#173f43]/42">
            Add a URL or upload a file below.
          </p>
        </label>

        <label className="block">
          <span className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-[#173f43]/48">
            Upload file
          </span>

          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx,.mp4,.webm"
            className="
              block
              w-full
              cursor-pointer
              border
              border-[#173f43]/18
              bg-[#f8f3ea]
              text-sm
              text-[#173f43]/65

              file:mr-4
              file:border-0
              file:bg-[#173f43]
              file:px-4
              file:py-3.5
              file:text-[10px]
              file:font-semibold
              file:uppercase
              file:tracking-[0.15em]
              file:text-[#f5efe3]
              file:transition
              hover:file:bg-[#d46f5e]
            "
          />

          {file && (
            <p className="mt-2 break-all text-xs text-[#173f43]/55">
              Selected: {file.name}
            </p>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-[#173f43]/48">
            Description
          </span>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="What does this evidence demonstrate?"
            rows={4}
            className="
              w-full
              resize-none
              border
              border-[#173f43]/18
              bg-[#f8f3ea]
              px-4
              py-3.5
              text-base
              leading-7
              text-[#173f43]
              outline-none
              transition
              placeholder:text-[#173f43]/30
              focus:border-[#d46f5e]
              focus:ring-2
              focus:ring-[#d46f5e]/10
            "
          />
        </label>

        {error && (
          <p
            role="alert"
            className="border border-[#b85f54]/25 bg-[#b85f54]/10 px-4 py-3 text-sm text-[#8e4038]"
          >
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-5 border-t border-[#173f43]/12 px-5 pb-9 pt-5 md:px-6 md:pb-7">
        <p className="hidden max-w-[210px] text-xs leading-5 text-[#173f43]/42 sm:block">
          Evidence helps mentors and recruiters understand the
          work behind each milestone.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            ml-auto
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
            ? "Uploading..."
            : "Add evidence"}
        </button>
      </div>
    </form>
  );
}