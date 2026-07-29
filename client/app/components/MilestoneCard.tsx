"use client";

import { useCallback, useEffect, useState } from "react";
import type { Milestone } from "../../lib/types/milestone";
import CreateEvidenceForm from "./CreateEvidenceForm";

type Evidence = {
  _id: string;
  title: string;
  type:
    | "image"
    | "certificate"
    | "link"
    | "github"
    | "video"
    | "document";
  url: string;
  description?: string;
  milestoneId: string;
};

type MilestoneCardProps = {
  milestone: Milestone | null;
  onClose: () => void;
};

export default function MilestoneCard({
  milestone,
  onClose
}: MilestoneCardProps) {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [isEvidenceFormOpen, setIsEvidenceFormOpen] = useState(false);

  const fetchEvidence = useCallback(async () => {
    if (!milestone) {
      setEvidences([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/evidence/milestone/${milestone._id}`
      );

      if (!response.ok) {
        throw new Error("Could not fetch evidence");
      }

      const data: Evidence[] = await response.json();
      setEvidences(data);
    } catch (error) {
      console.error("Error fetching evidence:", error);
      setEvidences([]);
    }
  }, [milestone]);

  useEffect(() => {
    fetchEvidence();
    setIsEvidenceFormOpen(false);
  }, [fetchEvidence]);

  if (!milestone) {
    return null;
  }
/////

const handleDelete = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this milestone?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/milestones/${milestone._id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Could not delete milestone");
    }

    onClose();
  } catch (error) {
    console.error(error);
  }
};
return (
  <>
    {/* Fondo suave detrás del drawer */}
    <button
      type="button"
      aria-label="Close milestone details"
      onClick={onClose}
      className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[1px]"
    />

    {/* Drawer */}
    <aside
      className="
        fixed
        inset-y-4
        right-4
        z-50
        w-[calc(100%-2rem)]
        max-w-[520px]
        overflow-y-auto
        rounded-[2rem]
        border
        border-black/10
        bg-white
        px-6
        py-6
        text-black
        shadow-2xl
        md:px-9
        md:py-8
      "
    >
      {/* Header y botón de cerrar */}
      <div className="flex items-center justify-between border-b border-black/10 pb-5">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          Milestone details
        </p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close milestone details"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-black/10
            text-2xl
            leading-none
            text-black/50
            transition
            hover:border-black
            hover:bg-black
            hover:text-white
          "
        >
          ×
        </button>

        <button
  type="button"
  onClick={handleDelete}
  className="
    rounded-full
    border
    border-red-300
    px-4
    py-2
    text-sm
    text-red-600
    transition
    hover:bg-red-600
    hover:text-white
  "
>
  Delete
</button>
      </div>

      {/* Información del milestone */}
      <div className="py-9">
        <p className="text-xs uppercase tracking-[0.3em] text-black/45">
          {milestone.category}
        </p>

        <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
          {milestone.title}
        </h2>

        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-black/45">
          {new Date(milestone.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <p className="mt-7 text-base leading-7 text-black/65">
          {milestone.description}
        </p>
      </div>

      {/* Evidence header */}
      <div className="flex items-center justify-between gap-4 border-y border-black/10 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/45">
            Evidence
          </p>

          <p className="mt-2 text-sm text-black/55">
            {evidences.length}{" "}
            {evidences.length === 1 ? "item" : "items"} documented
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setIsEvidenceFormOpen((currentValue) => !currentValue)
          }
          className="
            shrink-0
            rounded-full
            border
            border-black
            px-4
            py-2
            text-sm
            transition
            hover:bg-black
            hover:text-white
          "
        >
          {isEvidenceFormOpen ? "Close" : "+ Add"}
        </button>
      </div>

      {/* Evidence content */}
      {evidences.length === 0 ? (
        <div className="py-9">
          <p className="font-serif text-2xl">
            This chapter has no evidence yet.
          </p>

          <p className="mt-3 text-sm leading-6 text-black/55">
            Add a link, certificate, image, video or document that helps tell
            this part of your story.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-black/10">
          {evidences.map((evidence) => (
            <a
              key={evidence._id}
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-5 py-6"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                  {evidence.type}
                </p>

                <h3 className="mt-2 font-serif text-2xl">
                  {evidence.title}
                </h3>

                {evidence.description && (
                  <p className="mt-3 text-sm leading-6 text-black/55">
                    {evidence.description}
                  </p>
                )}
              </div>

              <span className="mt-2 shrink-0 text-sm transition group-hover:translate-x-1">
                View →
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Evidence form */}
      {isEvidenceFormOpen && (
        <div className="mt-4 border-t border-black/10 pt-8">
          <CreateEvidenceForm
            milestoneId={milestone._id}
            onEvidenceCreated={async () => {
              await fetchEvidence();
              setIsEvidenceFormOpen(false);
            }}
          />
        </div>
      )}
    </aside>
  </>
);
}