"use client";

import { useState } from "react";

type CreateEvidenceFormProps = {
  milestoneId: string;
  onEvidenceCreated: () => void;
};

export default function CreateEvidenceForm({
  milestoneId,
  onEvidenceCreated,
}: CreateEvidenceFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("github");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/evidence",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            type,
            url,
            description,
            milestoneId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not create evidence");
      }

      setTitle("");
      setType("github");
      setUrl("");
      setDescription("");

      onEvidenceCreated();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-3 rounded-xl border border-black/20 p-4"
    >
      <h3 className="text-lg font-semibold">Add Evidence</h3>

      <input
        type="text"
        placeholder="Evidence title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        className="w-full rounded border p-2"
      />

      <select
        value={type}
        onChange={(event) => setType(event.target.value)}
        className="w-full rounded border p-2"
      >
        <option value="github">GitHub</option>
        <option value="link">Link</option>
        <option value="image">Image</option>
        <option value="certificate">Certificate</option>
        <option value="video">Video</option>
        <option value="document">Document</option>
      </select>

      <input
        type="url"
        placeholder="https://..."
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required
        className="w-full rounded border p-2"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className="w-full rounded border p-2"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        className="rounded-full bg-black px-5 py-2 text-white"
      >
        Add Evidence
      </button>
    </form>
  );
}