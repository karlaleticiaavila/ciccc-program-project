"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RecruiterMilestone = {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  isPublic?: boolean;
  userId?: {
    name?: string;
    email?: string;
  };
};

export default function RecruitersPage() {
  const router = useRouter();

  const [milestones, setMilestones] = useState<
    RecruiterMilestone[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicMilestones = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/milestones/public`
        );

        if (!response.ok) {
          throw new Error(
            "Could not load public milestones"
          );
        }

        const data: RecruiterMilestone[] =
          await response.json();

        setMilestones(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPublicMilestones();
  }, []);

  return (
    <main className="min-h-screen bg-[#123b40] text-[#f5efe3]">
      <header className="border-b border-[#f5efe3]/12 px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="font-serif text-lg leading-none tracking-[-0.03em] transition hover:text-[#f0a087]"
          >
            WHO ARE YOU BECOMING?
          </button>

          <p className="text-[9px] uppercase tracking-[0.28em] text-[#f5efe3]/40">
            Recruiter discovery
          </p>
        </div>
      </header>

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.6fr] lg:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#f0a087]">
                Discover potential
              </p>

              <h1 className="mt-6 max-w-5xl font-serif text-[clamp(4rem,8vw,7rem)] leading-[0.84] tracking-[-0.06em]">
                Find the stories
                <br />
                behind the work.
              </h1>
            </div>

            <p className="max-w-md text-base leading-8 text-[#f5efe3]/58">
              Explore public milestones, real evidence and the
              experiences people choose to share with future
              collaborators.
            </p>
          </div>

          <div className="mt-16 border-t border-[#f5efe3]/15 pt-8">
            <div className="flex items-center justify-between gap-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#f5efe3]/42">
                Public archive
              </p>

              {!isLoading && !error && (
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#f5efe3]/35">
                  {milestones.length}{" "}
                  {milestones.length === 1
                    ? "chapter"
                    : "chapters"}
                </p>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <span className="mx-auto block h-2 w-2 animate-pulse rounded-full bg-[#f0a087]" />

                <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-[#f5efe3]/45">
                  Discovering stories
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="mt-10 border border-[#f0a087]/25 bg-[#713f3a]/25 px-6 py-8">
              <p className="text-sm text-[#f5efe3]/75">
                {error}
              </p>
            </div>
          ) : milestones.length === 0 ? (
            <div className="flex min-h-[400px] items-center">
              <div>
                <p className="font-serif text-4xl leading-tight">
                  No public chapters yet.
                </p>

                <p className="mt-5 max-w-lg text-sm leading-7 text-[#f5efe3]/55">
                  Public milestones will appear here when people
                  choose to share their work and experiences.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-px overflow-hidden border border-[#f5efe3]/12 bg-[#f5efe3]/12 md:grid-cols-2 xl:grid-cols-3">
              {milestones.map((milestone) => {
                const formattedDate = new Date(
                  milestone.date
                ).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <article
                    key={milestone._id}
                    className="group flex min-h-[390px] flex-col bg-[#174a50] p-7 transition duration-300 hover:bg-[#1b5258]"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <p className="text-[9px] uppercase tracking-[0.28em] text-[#f0a087]">
                        {milestone.category || "Milestone"}
                      </p>

                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#f5efe3]/32">
                        {formattedDate}
                      </p>
                    </div>

                    <h2 className="mt-8 font-serif text-4xl leading-[0.95] tracking-[-0.04em]">
                      {milestone.title}
                    </h2>

                    <p className="mt-6 line-clamp-4 text-sm leading-7 text-[#f5efe3]/55">
                      {milestone.description}
                    </p>

                    <div className="mt-auto border-t border-[#f5efe3]/12 pt-6">
                      {milestone.userId?.name && (
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.25em] text-[#f5efe3]/30">
                            Created by
                          </p>

                          <p className="mt-2 font-serif text-xl">
                            {milestone.userId.name}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 flex items-center justify-between gap-4">
                        {milestone.userId?.email ? (
                          <a
                            href={`mailto:${milestone.userId.email}`}
                            className="text-[9px] uppercase tracking-[0.2em] text-[#f0a087] transition hover:text-white"
                          >
                            Contact
                          </a>
                        ) : (
                          <span />
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/milestones/${milestone._id}`
                            )
                          }
                          className="text-[9px] uppercase tracking-[0.2em] text-[#f5efe3]/48 transition group-hover:translate-x-1 group-hover:text-[#f5efe3]"
                        >
                          View chapter →
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}