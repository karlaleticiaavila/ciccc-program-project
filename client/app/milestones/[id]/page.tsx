"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

type PublicMilestone = {
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

export default function PublicMilestonePage() {
  const params = useParams();
  const id = params.id as string;

  const [milestone, setMilestone] =
    useState<PublicMilestone | null>(null);

  const [evidences, setEvidences] = useState<Evidence[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchPublicMilestone = async () => {
      try {
        setIsLoading(true);
        setError("");

        const milestoneResponse = await fetch(
          `http://localhost:5000/api/milestones/public/${id}`
        );

        if (!milestoneResponse.ok) {
          throw new Error(
            "This milestone is private or unavailable."
          );
        }

        const milestoneData: PublicMilestone =
          await milestoneResponse.json();

        setMilestone(milestoneData);

        const evidenceResponse = await fetch(
          `http://localhost:5000/api/evidence/milestone/${id}`
        );

        if (evidenceResponse.ok) {
          const evidenceData: Evidence[] =
            await evidenceResponse.json();

          setEvidences(evidenceData);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not load milestone"
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPublicMilestone();
  }, [id]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#123b40] px-6 text-[#f5efe3]">
        <div className="text-center">
          <span className="mx-auto block h-2 w-2 animate-pulse rounded-full bg-[#f0a087]" />

          <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-[#f5efe3]/55">
            Opening chapter
          </p>
        </div>
      </main>
    );
  }

  if (error || !milestone) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#123b40] px-6 text-[#f5efe3]">
        <div className="max-w-lg text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#f0a087]">
            Chapter unavailable
          </p>

          <h1 className="mt-6 font-serif text-5xl leading-[0.95]">
            This milestone cannot be viewed.
          </h1>

          <p className="mt-6 text-sm leading-7 text-[#f5efe3]/60">
            {error}
          </p>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(
    milestone.date
  ).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const firstImage = evidences.find(
    (evidence) => evidence.type === "image"
  );

  return (
    <main className="min-h-screen bg-[#123b40] text-[#f5efe3]">
      <header className="border-b border-[#f5efe3]/12 px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-6">
          <p className="font-serif text-lg leading-none tracking-[-0.03em]">
            WHO ARE YOU BECOMING?
          </p>

          <p className="text-[9px] uppercase tracking-[0.28em] text-[#f5efe3]/40">
            Shared milestone
          </p>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1300px] lg:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col justify-center px-6 py-16 md:px-10 lg:px-14">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#f0a087]">
            {milestone.category || "Milestone"}
          </p>

          <h1 className="mt-6 max-w-3xl font-serif text-[clamp(4rem,8vw,7rem)] leading-[0.85] tracking-[-0.06em]">
            {milestone.title}
          </h1>

          <p className="mt-7 text-[10px] uppercase tracking-[0.24em] text-[#f5efe3]/42">
            {formattedDate}
          </p>

          <p className="mt-9 max-w-2xl text-base leading-8 text-[#f5efe3]/65">
            {milestone.description}
          </p>

          {milestone.userId?.name && (
            <div className="mt-12 border-t border-[#f5efe3]/15 pt-6">
              <p className="text-[9px] uppercase tracking-[0.28em] text-[#f5efe3]/35">
                Created by
              </p>

              <p className="mt-2 font-serif text-2xl">
                {milestone.userId.name}
              </p>

              {milestone.userId.email && (
                <a
                  href={`mailto:${milestone.userId.email}`}
                  className="mt-3 inline-block text-sm text-[#f0a087] transition hover:text-white"
                >
                  {milestone.userId.email}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-[#f5efe3]/10 bg-[#174a50] lg:border-l lg:border-t-0">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.title}
              className="h-full min-h-[520px] w-full object-cover"
            />
          ) : (
            <div className="flex min-h-[520px] h-full items-end bg-gradient-to-br from-[#255f67] via-[#174a50] to-[#102f35] p-10">
              <p className="max-w-sm font-serif text-4xl leading-tight text-[#f5efe3]/80">
                Every milestone holds part of the story.
              </p>
            </div>
          )}
        </div>
      </section>

      {evidences.length > 0 && (
        <section className="border-t border-[#f5efe3]/12 px-6 py-20 md:px-10">
          <div className="mx-auto max-w-[1300px]">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#f0a087]">
              Evidence
            </p>

            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              Work behind the chapter.
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {evidences.map((evidence) => (
                <a
                  key={evidence._id}
                  href={evidence.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-[#f5efe3]/12 bg-[#174a50] p-6 transition hover:border-[#f0a087]/60"
                >
                  <p className="text-[9px] uppercase tracking-[0.27em] text-[#f0a087]">
                    {evidence.type}
                  </p>

                  <h3 className="mt-4 font-serif text-2xl">
                    {evidence.title}
                  </h3>

                  {evidence.description && (
                    <p className="mt-4 text-sm leading-6 text-[#f5efe3]/55">
                      {evidence.description}
                    </p>
                  )}

                  <p className="mt-7 text-[9px] uppercase tracking-[0.2em] text-[#f5efe3]/40 transition group-hover:text-[#f0a087]">
                    View evidence →
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}