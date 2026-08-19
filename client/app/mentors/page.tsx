"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Creator {
  _id?: string;
  name?: string;
  email?: string;
  profilePicture?: string;
}

interface Milestone {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  userId?: Creator;
}

interface Feedback {
  _id: string;
  message: string;
  createdAt: string;
  mentorId?: Creator;
}
interface Evidence {
  _id: string;
  title: string;
  type: string;
  url: string;
  description?: string;
  milestoneId: string;
  resourceType?: string;
}

export default function MentorsPage() {
  const { data: session, status } = useSession();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [feedback, setFeedback] = useState<Record<string, Feedback[]>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [evidenceByMilestone, setEvidenceByMilestone] =
  useState<Record<string, Evidence[]>>({});

  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const loadMilestones = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${apiUrl}/api/milestones/public`
        );

        if (!response.ok) {
          throw new Error("Could not load public milestones.");
        }

        const data: Milestone[] = await response.json();

        setMilestones(data);
const evidenceEntries = await Promise.all(
  data.map(async (milestone) => {
    try {
      const evidenceResponse = await fetch(
        `${apiUrl}/api/evidence/public/milestone/${milestone._id}`
      );

      if (!evidenceResponse.ok) {
        return [milestone._id, []] as const;
      }

      const evidenceData: Evidence[] =
        await evidenceResponse.json();

      return [milestone._id, evidenceData] as const;
    } catch {
      return [milestone._id, []] as const;
    }
  })
);

setEvidenceByMilestone(
  Object.fromEntries(evidenceEntries)
);
        // Load existing feedback for every public milestone
        const feedbackEntries = await Promise.all(
          data.map(async (milestone) => {
            try {
              const feedbackResponse = await fetch(
                `${apiUrl}/api/feedback/${milestone._id}`
              );

              if (!feedbackResponse.ok) {
                return [milestone._id, []] as const;
              }

              const feedbackData: Feedback[] =
                await feedbackResponse.json();

              return [milestone._id, feedbackData] as const;
            } catch {
              return [milestone._id, []] as const;
            }
          })
        );

        setFeedback(Object.fromEntries(feedbackEntries));
      } catch (err) {
        console.error(err);
        setError("We could not load the mentor space.");
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, [apiUrl]);

const handleFeedbackSubmit = async (
  event: FormEvent<HTMLFormElement>,
  milestoneId: string
) => {
  event.preventDefault();

  const message = messages[milestoneId]?.trim();

  if (!message) return;

  if (!session?.accessToken) {
    setError("Please sign in before leaving feedback.");
    return;
  }

  try {
    setSubmittingId(milestoneId);
    setError("");

    const response = await fetch(`${apiUrl}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        milestoneId,
        message,
      }),
    });

    console.log("feedback response status:", response.status);
    console.log("feedback response url:", response.url);

    const responseText = await response.text();

    console.log("feedback response body:", responseText);

    if (!response.ok) {
      throw new Error("Could not create feedback.");
    }

    const newFeedback: Feedback = JSON.parse(responseText);

    setFeedback((current) => ({
      ...current,
      [milestoneId]: [
        newFeedback,
        ...(current[milestoneId] || []),
      ],
    }));

    setMessages((current) => ({
      ...current,
      [milestoneId]: "",
    }));
  } catch (err) {
    console.error(err);
    setError(
      "Something went wrong while sending your feedback."
    );
  } finally {
    setSubmittingId(null);
  }
};

  if (loading) {
    return (
      <main className="min-h-screen bg-[#123b40] text-[#f5efe3]">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm uppercase tracking-[0.3em] opacity-70">
            Opening the mentor room...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#123b40] text-[#f5efe3]">
      {/* HERO */}
      <section className="border-b border-[#f5efe3]/20 px-6 pb-16 pt-32 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#f0a087]">
            Mentor Space
          </p>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Help someone
              <br />
              become.
            </h1>

            <p className="max-w-md text-sm leading-7 text-[#f5efe3]/70 md:text-base">
              Explore public milestones and leave thoughtful feedback
              for people building their next chapter.
            </p>
          </div>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="mx-auto max-w-7xl px-6 pt-8 md:px-12 lg:px-20">
          <div className="border border-[#f0a087]/50 bg-[#f0a087]/10 px-5 py-4 text-sm text-[#f5efe3]">
            {error}
          </div>
        </div>
      )}

      {/* MILESTONES */}
      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {milestones.length === 0 ? (
            <div className="border border-[#f5efe3]/20 px-8 py-20 text-center">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#f0a087]">
                Quiet for now
              </p>

              <h2 className="font-serif text-4xl">
                No public milestones yet.
              </h2>
            </div>
          ) : (
            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const milestoneFeedback =
                  feedback[milestone._id] || [];
const milestoneEvidence =
  evidenceByMilestone[milestone._id] || [];

const featuredEvidence =
  milestoneEvidence.find(
    (item) =>
      item.resourceType === "image" ||
      item.type.toLowerCase() === "image"
  );
                return (
                  <article
                    key={milestone._id}
                    className="grid overflow-hidden border border-[#f5efe3]/20 bg-[#164b53] lg:grid-cols-[0.9fr_1.1fr]"
                  >
                    {/* LEFT */}
                    <div className="flex flex-col justify-between border-b border-[#f5efe3]/20 p-8 lg:border-b-0 lg:border-r lg:p-10">
                      <div>
                        <div className="mb-14 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.3em] text-[#f0a087]">
                            Chapter {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="text-xs uppercase tracking-[0.25em] text-[#f5efe3]/50">
                            {milestone.category}
                          </span>
                        </div>

                        <h2 className="mb-6 font-serif text-4xl leading-tight md:text-5xl">
                          {milestone.title}
                        </h2>

                        <p className="mb-8 max-w-lg leading-7 text-[#f5efe3]/70">
                          {milestone.description}
                        </p>
                        {featuredEvidence && (
  <div className="mb-8 overflow-hidden border border-[#f5efe3]/15 bg-[#123b40]/35">
    <img
      src={featuredEvidence.url}
      alt={featuredEvidence.title}
      className="h-56 w-full object-cover md:h-64"
    />

    {(featuredEvidence.title || featuredEvidence.description) && (
      <div className="border-t border-[#f5efe3]/10 p-4">
        <p className="text-[8px] uppercase tracking-[0.25em] text-[#f0a087]">
          Evidence
        </p>

        {featuredEvidence.title && (
          <p className="mt-2 font-serif text-xl">
            {featuredEvidence.title}
          </p>
        )}

        {featuredEvidence.description && (
          <p className="mt-2 text-sm leading-6 text-[#f5efe3]/55">
            {featuredEvidence.description}
          </p>
        )}
      </div>
    )}
  </div>
)}

                       <div className="flex items-center gap-4">
  {milestone.userId?.profilePicture ? (
    <img
      src={milestone.userId.profilePicture}
      alt={milestone.userId.name || "Creator"}
      referrerPolicy="no-referrer"
      className="h-11 w-11 rounded-full object-cover ring-1 ring-[#f5efe3]/20"
    />
  ) : (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5efe3]/20 font-serif text-lg">
      {(milestone.userId?.name || "A")
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()}
    </div>
  )}

  <div className="min-w-0">
    <p className="font-serif text-lg text-[#f5efe3]">
      {milestone.userId?.name || "Anonymous creator"}
    </p>

    {milestone.userId?.email && (
      <p className="mt-1 truncate text-xs text-[#f5efe3]/40">
        {milestone.userId.email}
      </p>
    )}
  </div>
</div>
                      </div>

                      <Link
                        href={`/milestones/${milestone._id}`}
                        className="mt-12 inline-flex items-center gap-4 text-xs uppercase tracking-[0.3em] transition-opacity hover:opacity-60"
                      >
                        View chapter
                        <span>→</span>
                      </Link>
                    </div>

                    {/* RIGHT */}
                    <div className="p-8 lg:p-10">
                      <div className="mb-10">
                        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#f0a087]">
                          Mentor Notes
                        </p>

                        <h3 className="font-serif text-3xl md:text-4xl">
                          Leave something useful behind.
                        </h3>
                      </div>

                      {status === "authenticated" ? (
                        <form
                          onSubmit={(event) =>
                            handleFeedbackSubmit(
                              event,
                              milestone._id
                            )
                          }
                          className="mb-12"
                        >
                          <textarea
                            value={messages[milestone._id] || ""}
                            onChange={(event) =>
                              setMessages((current) => ({
                                ...current,
                                [milestone._id]: event.target.value,
                              }))
                            }
                            placeholder="Share guidance, encouragement, or a useful next step..."
                            rows={5}
                            maxLength={1000}
                            className="w-full resize-none border border-[#f5efe3]/20 bg-transparent p-5 text-[#f5efe3] outline-none transition placeholder:text-[#f5efe3]/35 focus:border-[#f0a087]"
                          />

                          <div className="mt-4 flex justify-end">
                            <button
                              type="submit"
                              disabled={
                                submittingId === milestone._id ||
                                !messages[milestone._id]?.trim()
                              }
                              className="rounded-full bg-[#f0a087] px-7 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#123b40] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {submittingId === milestone._id
                                ? "Sending..."
                                : "Leave feedback"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="mb-12 border border-[#f5efe3]/20 p-6">
                          <p className="mb-4 text-sm leading-6 text-[#f5efe3]/70">
                            Sign in to leave feedback on this chapter.
                          </p>

                          <Link
                            href="/login"
                            className="text-xs uppercase tracking-[0.3em] text-[#f0a087]"
                          >
                            Sign in →
                          </Link>
                        </div>
                      )}

                      {/* EXISTING FEEDBACK */}
                      <div>
                        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[#f5efe3]/50">
                          Community feedback
                        </p>

                        {milestoneFeedback.length === 0 ? (
                          <p className="text-sm italic text-[#f5efe3]/45">
                            No mentor notes yet. Be the first.
                          </p>
                        ) : (
                          <div className="space-y-5">
                            {milestoneFeedback.map((item) => (
                              <div
                                key={item._id}
                                className="border-t border-[#f5efe3]/15 pt-5"
                              >
                                <p className="mb-4 leading-7 text-[#f5efe3]/85">
                                  “{item.message}”
                                </p>

                                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-[#f5efe3]/45">
                                  <span>
                                    {item.mentorId?.name || "Mentor"}
                                  </span>

                                  <span>
                                    {new Date(
                                      item.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER MESSAGE */}
      <section className="border-t border-[#f5efe3]/20 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#f0a087]">
              Who Are You Becoming?
            </p>

            <p className="max-w-xl font-serif text-3xl leading-tight md:text-4xl">
              Sometimes becoming takes another pair of eyes.
            </p>
          </div>

          <Link
            href="/"
            className="text-xs uppercase tracking-[0.3em] text-[#f5efe3]/70 transition hover:text-[#f0a087]"
          >
            Return to journey →
          </Link>
        </div>
      </section>
    </main>
  );
}