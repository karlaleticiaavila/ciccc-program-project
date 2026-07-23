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
};

export default function MilestoneCard({
  milestone,
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

  return (
    <section className="bg-white px-4 py-20 text-black md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 border-t border-black/15 pt-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Milestone information */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/45">
              {milestone.category}
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
              {milestone.title}
            </h2>

            <p className="mt-6 text-sm uppercase tracking-[0.18em] text-black/45">
              {new Date(milestone.date).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <p className="mt-8 max-w-xl text-lg leading-8 text-black/65">
              {milestone.description}
            </p>
          </div>

          {/* Evidence */}
          <div>
            <div className="flex items-center justify-between border-b border-black/15 pb-5">
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
                className="rounded-full border border-black px-5 py-2 text-sm transition hover:bg-black hover:text-white"
              >
                {isEvidenceFormOpen ? "Close" : "+ Add Evidence"}
              </button>
            </div>

            {evidences.length === 0 ? (
              <div className="py-10">
                <p className="font-serif text-2xl">
                  This chapter has no evidence yet.
                </p>

                <p className="mt-3 text-sm leading-6 text-black/55">
                  Add a link, certificate, image, video or document that helps
                  tell this part of your story.
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
                    className="group flex items-start justify-between gap-6 py-7"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                        {evidence.type}
                      </p>

                      <h3 className="mt-2 font-serif text-2xl">
                        {evidence.title}
                      </h3>

                      {evidence.description && (
                        <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
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

            {isEvidenceFormOpen && (
              <div className="mt-8 border-t border-black/15 pt-8">
                <CreateEvidenceForm
                  milestoneId={milestone._id}
                  onEvidenceCreated={async () => {
                    await fetchEvidence();
                    setIsEvidenceFormOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}