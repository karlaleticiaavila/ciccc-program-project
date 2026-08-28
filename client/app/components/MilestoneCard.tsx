"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import type { Milestone } from "../../lib/types/milestone";
import CreateEvidenceForm from "./CreateEvidenceForm";
import EditMilestoneForm from "./EditMilestoneForm";

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
  onMilestoneDeleted: () => Promise<void>;
  onMilestoneUpdated: () => Promise<void>;
};

export default function MilestoneCard({
  milestone,
  onClose,
  onMilestoneDeleted,
  onMilestoneUpdated,
}: MilestoneCardProps) {
  const { data: session } = useSession();

  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [isEvidenceLoading, setIsEvidenceLoading] = useState(false);
  const [evidenceError, setEvidenceError] = useState("");

  const [isEvidenceFormOpen, setIsEvidenceFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [isUpdatingVisibility, setIsUpdatingVisibility] =
    useState(false);

  const [visibilityError, setVisibilityError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const fetchEvidence = useCallback(async () => {
    if (!milestone) {
      setEvidences([]);
      return;
    }

    try {
      setIsEvidenceLoading(true);
      setEvidenceError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/evidence/milestone/${milestone._id}`
      );

      if (!response.ok) {
        throw new Error("Could not fetch evidence");
      }

      const data: Evidence[] = await response.json();
      setEvidences(data);
    } catch (error) {
      setEvidences([]);
      setEvidenceError(
        error instanceof Error
          ? error.message
          : "Could not load evidence"
      );
    } finally {
      setIsEvidenceLoading(false);
    }
  }, [milestone]);

  useEffect(() => {
    void fetchEvidence();

    setIsEvidenceFormOpen(false);
    setIsEditFormOpen(false);
    setIsDeleteOpen(false);
    setDeleteError("");
  }, [fetchEvidence]);

  if (!milestone) {
    return null;
  }

  const handleDelete = async () => {
    if (!session?.accessToken) {
      setDeleteError(
        "Your session is unavailable. Please sign in again."
      );
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/milestones/${milestone._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not delete milestone"
        );
      }

      await onMilestoneDeleted();
      onClose();
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVisibilityChange = async () => {
    if (!session?.accessToken) {
      setVisibilityError(
        "Your session is unavailable. Please sign in again."
      );
      return;
    }

    try {
      setIsUpdatingVisibility(true);
      setVisibilityError("");
      setCopyMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/milestones/${milestone._id}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            isPublic: !milestone.isPublic,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update visibility"
        );
      }

      await onMilestoneUpdated();
    } catch (error) {
      setVisibilityError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const publicUrl = `${window.location.origin}/milestones/${milestone._id}`;

      await navigator.clipboard.writeText(publicUrl);

      setCopyMessage("Link copied");

      setTimeout(() => {
        setCopyMessage("");
      }, 2000);
    } catch {
      setCopyMessage("Could not copy link");
    }
  };

  const formattedDate = new Date(
    milestone.date
  ).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <button
        type="button"
        aria-label="Close milestone details"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-[#102f35]/55 backdrop-blur-[3px] transition-opacity duration-300"
      />

      <aside
        className="
          fixed
          inset-y-3
          right-3
          z-50
          w-[calc(100%-1.5rem)]
          max-w-[560px]
          overflow-y-auto
          rounded-[28px]
          border
          border-[#173f43]/15
          bg-[#e9e2d4]
          text-[#173f43]
          shadow-[0_35px_120px_rgba(11,43,47,0.35)]
          animate-[slideIn_.35s_ease-out]
          md:inset-y-5
          md:right-5
          md:w-[calc(100%-2.5rem)]
        "
      >
        {isEditFormOpen ? (
          <div className="p-4 md:p-6">
            <EditMilestoneForm
              milestone={milestone}
              onMilestoneUpdated={async () => {
                await onMilestoneUpdated();
                setIsEditFormOpen(false);
              }}
              onClose={() => setIsEditFormOpen(false)}
            />
          </div>
        ) : (
          <>
            <header className="sticky top-0 z-10 border-b border-[#173f43]/12 bg-[#e9e2d4]/95 px-6 py-5 backdrop-blur-xl md:px-9">
              <div className="flex items-center gap-3">
                <p className="mr-auto text-[10px] uppercase tracking-[0.32em] text-[#173f43]/48">
                  Milestone details
                </p>

                <button
                  type="button"
                  onClick={() => setIsEditFormOpen(true)}
                  className="rounded-full border border-[#173f43]/20 px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#173f43] hover:bg-[#173f43] hover:text-[#f5efe3] hover:shadow-md"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(true)}
                  className="rounded-full border border-[#b85f54]/35 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-[#9d493f] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b85f54] hover:text-white hover:shadow-md"
                >
                  Delete
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close milestone details"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#173f43]/15 text-xl text-[#173f43]/55 transition-all duration-300 hover:rotate-90 hover:border-[#173f43] hover:bg-[#173f43] hover:text-[#f5efe3]"
                >
                  ×
                </button>
              </div>
            </header>

            <div className="px-6 pb-10 md:px-9">
              <section className="py-10">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#d46f5e]">
                  {milestone.category || "Milestone"}
                </p>

                <h2 className="mt-5 font-serif text-4xl leading-[0.95] tracking-[-0.04em] transition-all duration-500 hover:tracking-[-0.025em] md:text-6xl">
                  {milestone.title}
                </h2>

                <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-[#173f43]/45">
                  {formattedDate}
                </p>

                <p className="mt-8 text-base leading-8 text-[#173f43]/68">
                  {milestone.description ||
                    "No description has been added to this chapter yet."}
                </p>
              </section>

              <section className="border-y border-[#173f43]/12 py-6">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.32em] text-[#173f43]/48">
                        Visibility
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        <span
                          className={`
                            h-2
                            w-2
                            rounded-full
                            transition-all
                            duration-300
                            ${
                              milestone.isPublic
                                ? "bg-[#6f8b4b] shadow-[0_0_10px_rgba(111,139,75,0.55)]"
                                : "bg-[#173f43]/30"
                            }
                          `}
                        />

                        <p className="text-sm text-[#173f43]/65">
                          {milestone.isPublic
                            ? "Public milestone"
                            : "Private milestone"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isUpdatingVisibility}
                      onClick={handleVisibilityChange}
                      className="
                        shrink-0
                        rounded-full
                        border
                        border-[#173f43]/25
                        px-5
                        py-2.5
                        text-[10px]
                        uppercase
                        tracking-[0.17em]
                        text-[#173f43]
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-[#173f43]
                        hover:bg-[#173f43]
                        hover:text-[#f5efe3]
                        hover:shadow-md
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isUpdatingVisibility
                        ? "Updating..."
                        : milestone.isPublic
                          ? "Make private"
                          : "Make public"}
                    </button>
                  </div>

                  {milestone.isPublic && (
                    <div className="flex flex-col gap-3 border-t border-[#173f43]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.25em] text-[#d46f5e]">
                          Shareable
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#173f43]/50">
                          Anyone with the link can view this milestone.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="
                          shrink-0
                          rounded-full
                          bg-[#d46f5e]
                          px-5
                          py-2.5
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.17em]
                          text-[#173f43]
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:scale-[1.03]
                          hover:bg-[#f0a087]
                          hover:shadow-lg
                        "
                      >
                        {copyMessage || "Copy link"}
                      </button>
                    </div>
                  )}

                  {visibilityError && (
                    <p className="border border-[#b85f54]/25 bg-[#b85f54]/10 px-4 py-3 text-sm text-[#8e4038]">
                      {visibilityError}
                    </p>
                  )}
                </div>
              </section>

              <section className="border-y border-[#173f43]/12 py-6">
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#173f43]/48">
                      Evidence
                    </p>

                    <p className="mt-2 text-sm text-[#173f43]/58">
                      {evidences.length}{" "}
                      {evidences.length === 1
                        ? "item"
                        : "items"}{" "}
                      documented
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setIsEvidenceFormOpen(
                        (currentValue) => !currentValue
                      )
                    }
                    className="shrink-0 rounded-full bg-[#173f43] px-5 py-2.5 text-[10px] uppercase tracking-[0.17em] text-[#f5efe3] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#245a60] hover:shadow-lg"
                  >
                    {isEvidenceFormOpen
                      ? "Close form"
                      : "Add evidence"}
                  </button>
                </div>
              </section>

              {isEvidenceLoading ? (
                <div className="py-12 text-center">
                  <span className="mx-auto block h-2 w-2 animate-pulse rounded-full bg-[#d46f5e]" />

                  <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-[#173f43]/45">
                    Loading evidence
                  </p>
                </div>
              ) : evidenceError ? (
                <div className="my-7 border border-[#b85f54]/25 bg-[#b85f54]/10 px-5 py-4">
                  <p className="text-sm text-[#8e4038]">
                    {evidenceError}
                  </p>
                </div>
              ) : evidences.length === 0 ? (
                <div className="py-10">
                  <p className="font-serif text-3xl leading-tight">
                    This chapter has no evidence yet.
                  </p>

                  <p className="mt-4 max-w-md text-sm leading-7 text-[#173f43]/58">
                    Add a link, certificate, image, video or
                    document that helps preserve this part of
                    your story.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#173f43]/12">
                  {evidences.map((evidence) => (
                    <div
                      key={evidence._id}
                      className="py-7"
                    >
                      {evidence.type === "image" ? (
                        <a
                          href={evidence.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block"
                        >
                          <div className="relative h-[260px] overflow-hidden border border-[#173f43]/12 bg-[#173f43]/5 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(23,63,67,0.18)]">
                            <img
                              src={evidence.url}
                              alt={evidence.title}
                              className="
                                h-full
                                w-full
                                object-cover
                                transition-all
                                duration-700
                                ease-out
                                group-hover:scale-[1.06]
                                group-hover:brightness-90
                              "
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#102f35]/55 via-transparent to-transparent transition-all duration-500 group-hover:from-[#102f35]/70" />

                            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-5 p-5 text-[#f5efe3]">
                              <div className="min-w-0">
                                <p className="text-[9px] uppercase tracking-[0.27em] text-[#f0a087]">
                                  Image evidence
                                </p>

                                <h3 className="mt-2 font-serif text-2xl leading-tight">
                                  {evidence.title}
                                </h3>
                              </div>

                              <span className="shrink-0 text-[9px] uppercase tracking-[0.18em] text-[#f5efe3]/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#f5efe3]">
                                View →
                              </span>
                            </div>
                          </div>

                          {evidence.description && (
                            <p className="mt-4 text-sm leading-6 text-[#173f43]/58">
                              {evidence.description}
                            </p>
                          )}
                        </a>
                      ) : (
                        <a
                          href={evidence.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start justify-between gap-5 transition-all duration-300 hover:translate-x-1"
                        >
                          <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-[0.27em] text-[#d46f5e]">
                              {evidence.type}
                            </p>

                            <h3 className="mt-3 font-serif text-2xl leading-tight">
                              {evidence.title}
                            </h3>

                            {evidence.description && (
                              <p className="mt-3 text-sm leading-6 text-[#173f43]/58">
                                {evidence.description}
                              </p>
                            )}
                          </div>

                          <span className="mt-2 shrink-0 text-[10px] uppercase tracking-[0.18em] text-[#173f43]/48 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#d46f5e]">
                            View →
                          </span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isEvidenceFormOpen && (
                <div className="mt-6 border-t border-[#173f43]/12 pt-8">
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
          </>
        )}
      </aside>

      {isDeleteOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="Cancel milestone deletion"
            onClick={() => {
              if (!isDeleting) {
                setIsDeleteOpen(false);
                setDeleteError("");
              }
            }}
            className="absolute inset-0 bg-[#102f35]/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md animate-[modalIn_.25s_ease-out] border border-[#f5efe3]/15 bg-[#173f43] p-7 text-[#f5efe3] shadow-[0_30px_100px_rgba(8,35,38,0.5)] md:p-9">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#f0a087]">
              Delete milestone
            </p>

            <h3 className="mt-5 font-serif text-4xl leading-[0.95] tracking-[-0.04em]">
              Delete this chapter permanently?
            </h3>

            <p className="mt-6 text-sm leading-7 text-[#f5efe3]/62">
              This will remove “{milestone.title}” from your
              journey. This action cannot be undone.
            </p>

            {deleteError && (
              <p className="mt-5 border border-[#f0a087]/25 bg-[#713f3a]/30 px-4 py-3 text-sm text-[#f5d0c7]">
                {deleteError}
              </p>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteError("");
                }}
                className="rounded-full border border-[#f5efe3]/20 px-6 py-3 text-[10px] uppercase tracking-[0.17em] text-[#f5efe3]/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f5efe3] hover:text-[#f5efe3] disabled:opacity-50"
              >
                Keep milestone
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="rounded-full bg-[#d46f5e] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#173f43] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#f0a087] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}