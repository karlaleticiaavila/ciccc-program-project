"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { socket } from "../../lib/socket";

type RecruiterMilestone = {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  isPublic?: boolean;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
    bio?: string;
    profilePicture?: string;
    role?: "user" | "mentor" | "recruiter";
  };
};
type Evidence = {
  _id: string;
  title: string;
  type: string;
  url: string;
  description?: string;
  milestoneId: string;
  resourceType?: string;
};

type Candidate = {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  profilePicture?: string;
  role?: "user" | "mentor" | "recruiter";
  milestones: RecruiterMilestone[];
  categories: string[];
};

export default function RecruitersPage() {
  const router = useRouter();

  const [milestones, setMilestones] = useState<RecruiterMilestone[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [evidenceByMilestone, setEvidenceByMilestone] =
  useState<Record<string, Evidence[]>>({});

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchEvidenceForMilestones = useCallback(
  async (publicMilestones: RecruiterMilestone[]) => {
    try {
      const entries = await Promise.all(
        publicMilestones.map(async (milestone) => {
          try {
            const response = await fetch(
              `${apiUrl}/api/evidence/public/milestone/${milestone._id}`
            );

            if (!response.ok) {
              return [milestone._id, []] as const;
            }

            const data: Evidence[] = await response.json();

            return [milestone._id, data] as const;
          } catch {
            return [milestone._id, []] as const;
          }
        })
      );

      setEvidenceByMilestone(Object.fromEntries(entries));
    } catch (error) {
      console.error("Error loading evidence:", error);
    }
  },
  [apiUrl]
);
    const fetchPublicMilestones = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(
        `${apiUrl}/api/milestones/public`
      );

      if (!response.ok) {
        throw new Error("Could not load public journeys.");
      }

     const data: RecruiterMilestone[] =
  await response.json();

setMilestones(data);

await fetchEvidenceForMilestones(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, fetchEvidenceForMilestones]);

  useEffect(() => {
    void fetchPublicMilestones();
  }, [fetchPublicMilestones]);

  /*
    Real-time refresh:
    when a creator creates, edits, deletes or changes
    visibility of a milestone, the recruiter archive can
    refresh without requiring a manual page reload.
  */
  useEffect(() => {
    const refresh = () => {
      void fetchPublicMilestones();
    };

    socket.on("milestoneCreated", refresh);
    socket.on("milestoneUpdated", refresh);
    socket.on("milestoneDeleted", refresh);

    return () => {
      socket.off("milestoneCreated", refresh);
      socket.off("milestoneUpdated", refresh);
      socket.off("milestoneDeleted", refresh);
    };
  }, [fetchPublicMilestones]);

  const candidates = useMemo<Candidate[]>(() => {
    const candidateMap = new Map<string, Candidate>();

    milestones.forEach((milestone) => {
      const creator = milestone.userId;

      const id =
        creator?._id ||
        creator?.email ||
        creator?.name ||
        `unknown-${milestone._id}`;

      const existingCandidate = candidateMap.get(id);

      if (existingCandidate) {
        existingCandidate.milestones.push(milestone);

        if (
          milestone.category &&
          !existingCandidate.categories.includes(
            milestone.category
          )
        ) {
          existingCandidate.categories.push(
            milestone.category
          );
        }
      } else {
        candidateMap.set(id, {
          id,
          name: creator?.name || "Anonymous creator",
          email: creator?.email,
          bio: creator?.bio,
          profilePicture: creator?.profilePicture,
          role: creator?.role,
          milestones: [milestone],
          categories: milestone.category
            ? [milestone.category]
            : [],
        });
      }
    });

    return Array.from(candidateMap.values()).map(
      (candidate) => ({
        ...candidate,
        milestones: [...candidate.milestones].sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        ),
      })
    );
  }, [milestones]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();

    milestones.forEach((milestone) => {
      if (milestone.category) {
        uniqueCategories.add(milestone.category);
      }
    });

    return ["All", ...Array.from(uniqueCategories).sort()];
  }, [milestones]);

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return candidates.filter((candidate) => {
      const matchesCategory =
        selectedCategory === "All" ||
        candidate.categories.includes(selectedCategory);

      const matchesSearch =
        !normalizedSearch ||
        candidate.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        candidate.email
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        candidate.categories.some((category) =>
          category
            .toLowerCase()
            .includes(normalizedSearch)
        ) ||
        candidate.milestones.some(
          (milestone) =>
            milestone.title
              .toLowerCase()
              .includes(normalizedSearch) ||
            milestone.description
              .toLowerCase()
              .includes(normalizedSearch)
        );

      return matchesCategory && matchesSearch;
    });
  }, [
    candidates,
    search,
    selectedCategory,
  ]);

  const selectedCandidate = useMemo(() => {
    if (!selectedCandidateId) {
      return filteredCandidates[0] || null;
    }

    return (
      candidates.find(
        (candidate) =>
          candidate.id === selectedCandidateId
      ) || filteredCandidates[0] || null
    );
  }, [
    candidates,
    filteredCandidates,
    selectedCandidateId,
  ]);
  const selectedFeaturedEvidence = useMemo(() => {
  if (!selectedCandidate) {
    return undefined;
  }

  for (const milestone of selectedCandidate.milestones) {
    const evidence =
      evidenceByMilestone[milestone._id] || [];

    const imageEvidence = evidence.find(
      (item) =>
        item.resourceType === "image" ||
        item.type.toLowerCase() === "image"
    );

    if (imageEvidence) {
      return imageEvidence;
    }
  }

  return undefined;
}, [selectedCandidate, evidenceByMilestone]);

  const initials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  return (
    <main className="min-h-screen bg-[#123b40] text-[#f5efe3]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#f5efe3]/10 bg-[#123b40]/90 px-5 py-5 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="font-serif text-lg leading-[0.9] tracking-[-0.035em] transition hover:text-[#f0a087]"
          >
            WHO ARE YOU
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            BECOMING?
          </button>

          <div className="flex items-center gap-5">
            <span className="hidden text-[9px] uppercase tracking-[0.3em] text-[#f5efe3]/35 sm:block">
              Talent Observatory
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-[#f0a087]" />
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-[#f5efe3]/10 px-5 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-14 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.36em] text-[#f0a087]">
                Recruiter discovery
              </p>

              <h1 className="mt-7 max-w-5xl font-serif text-[clamp(4.2rem,9vw,8.5rem)] leading-[0.78] tracking-[-0.065em]">
                Beyond
                <br />
                the résumé.
              </h1>
            </div>

            <div className="max-w-lg xl:justify-self-end">
              <p className="text-lg leading-8 text-[#f5efe3]/65">
                Discover the people behind the experience.
                Explore public journeys, meaningful milestones
                and the stories that rarely fit on a résumé.
              </p>

              <div className="mt-9 flex flex-wrap gap-x-10 gap-y-6 border-t border-[#f5efe3]/12 pt-7">
                <div>
                  <p className="font-serif text-4xl">
                    {candidates.length}
                  </p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-[#f5efe3]/35">
                    People
                  </p>
                </div>

                <div>
                  <p className="font-serif text-4xl">
                    {milestones.length}
                  </p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-[#f5efe3]/35">
                    Public chapters
                  </p>
                </div>

                <div>
                  <p className="font-serif text-4xl">
                    {Math.max(categories.length - 1, 0)}
                  </p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-[#f5efe3]/35">
                    Categories
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVERY CONTROLS */}
      <section className="border-b border-[#f5efe3]/10 px-5 py-7 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search people, skills, chapters..."
                className="w-full border-b border-[#f5efe3]/20 bg-transparent py-4 pr-10 text-sm text-[#f5efe3] outline-none transition placeholder:text-[#f5efe3]/30 focus:border-[#f0a087]"
              />

              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#f5efe3]/30">
                ↗
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-[8px] uppercase tracking-[0.22em] transition ${
                    selectedCategory === category
                      ? "border-[#f0a087] bg-[#f0a087] text-[#123b40]"
                      : "border-[#f5efe3]/15 text-[#f5efe3]/45 hover:border-[#f5efe3]/40 hover:text-[#f5efe3]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1500px]">
          {isLoading ? (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="text-center">
                <span className="mx-auto block h-2 w-2 animate-pulse rounded-full bg-[#f0a087]" />

                <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-[#f5efe3]/40">
                  Discovering people
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="border border-[#f0a087]/30 bg-[#713f3a]/20 p-8">
              <p className="font-serif text-3xl">
                Something interrupted the search.
              </p>

              <p className="mt-3 text-sm text-[#f5efe3]/55">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void fetchPublicMilestones()
                }
                className="mt-7 text-[9px] uppercase tracking-[0.25em] text-[#f0a087]"
              >
                Try again →
              </button>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="flex min-h-[450px] items-center justify-center border border-[#f5efe3]/10">
              <div className="max-w-md text-center">
                <p className="font-serif text-4xl">
                  No journeys found.
                </p>

                <p className="mt-5 text-sm leading-7 text-[#f5efe3]/50">
                  Try another name, category or keyword.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-10 xl:grid-cols-[0.72fr_1.28fr]">
              {/* PEOPLE DIRECTORY */}
              <aside>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#f5efe3]/38">
                    People
                  </p>

                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#f5efe3]/25">
                    {filteredCandidates.length} found
                  </span>
                </div>

                <div className="space-y-2">
                  {filteredCandidates.map(
                    (candidate, index) => {
                      const isSelected =
                        selectedCandidate?.id ===
                        candidate.id;

                      return (
                        <button
                          key={candidate.id}
                          type="button"
                          onClick={() =>
                            setSelectedCandidateId(
                              candidate.id
                            )
                          }
                          className={`group w-full border p-5 text-left transition duration-300 ${
                            isSelected
                              ? "border-[#f0a087]/70 bg-[#174a50]"
                              : "border-[#f5efe3]/10 bg-[#123b40] hover:border-[#f5efe3]/25 hover:bg-[#16464c]"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                           {candidate.profilePicture ? (
 <img
  src={candidate.profilePicture}
  alt={candidate.name}
  referrerPolicy="no-referrer"
  className={`h-12 w-12 shrink-0 rounded-full object-cover ring-1 transition ${
    isSelected
      ? "ring-[#f0a087]"
      : "ring-[#f5efe3]/15"
  }`}
/>
) : (
  <div
    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-serif text-lg transition ${
      isSelected
        ? "border-[#f0a087] bg-[#f0a087] text-[#123b40]"
        : "border-[#f5efe3]/15 text-[#f5efe3]/70"
    }`}
  >
    {initials(candidate.name)}
  </div>
)}

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-serif text-2xl leading-none">
                                    {candidate.name}
                                  </p>

                                  <p className="mt-2 text-[8px] uppercase tracking-[0.2em] text-[#f5efe3]/35">
                                    {
                                      candidate.milestones
                                        .length
                                    }{" "}
                                    {candidate.milestones
                                      .length === 1
                                      ? "public chapter"
                                      : "public chapters"}
                                  </p>
                                </div>

                                <span
                                  className={`text-sm transition ${
                                    isSelected
                                      ? "text-[#f0a087]"
                                      : "text-[#f5efe3]/25 group-hover:translate-x-1 group-hover:text-[#f5efe3]"
                                  }`}
                                >
                                  →
                                </span>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {candidate.categories
                                  .slice(0, 3)
                                  .map((category) => (
                                    <span
                                      key={category}
                                      className="text-[7px] uppercase tracking-[0.2em] text-[#f0a087]/75"
                                    >
                                      {category}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </aside>

              {/* CANDIDATE EXPERIENCE */}
              {selectedCandidate && (
                <article className="overflow-hidden border border-[#f5efe3]/12 bg-[#174a50]">
                  {/* PROFILE HERO */}
                  <div className="relative overflow-hidden border-b border-[#f5efe3]/12 p-7 md:p-10 lg:p-12">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-[#f0a087]/15"
                    />

                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-6 -top-12 h-52 w-52 rounded-full border border-[#f5efe3]/10"
                    />

                    <div className="relative">
                      <p className="text-[9px] uppercase tracking-[0.34em] text-[#f0a087]">
                        Candidate journey
                      </p>

                      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        <div>
                          <div className="mb-6">
  {selectedCandidate.profilePicture ? (
    <img
  src={selectedCandidate.profilePicture}
  alt={selectedCandidate.name}
  referrerPolicy="no-referrer"
  className="h-20 w-20 rounded-full object-cover ring-1 ring-[#f5efe3]/20"
/>
  ) : (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f5efe3] font-serif text-2xl text-[#123b40]">
      {initials(selectedCandidate.name)}
    </div>
  )}
</div>

                          <h2 className="max-w-3xl font-serif text-[clamp(3.3rem,7vw,6.5rem)] leading-[0.82] tracking-[-0.055em]">
                            {selectedCandidate.name}
                          </h2>
<p className="mt-6 max-w-2xl text-sm leading-7 text-[#f5efe3]/60">
  {selectedCandidate.bio?.trim()
    ? selectedCandidate.bio
    : "A public collection of the experiences, work and milestones this person chose to make part of their professional story."}
</p>
                        </div>

                        {selectedCandidate.email && (
                          <a
                            href={`mailto:${selectedCandidate.email}`}
                            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#f0a087] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#123b40] transition hover:-translate-y-0.5 hover:bg-[#f5b09a]"
                          >
                            Contact candidate
                          </a>
                        )}
                      </div>

                      <div className="mt-10 flex flex-wrap gap-2">
                        {selectedCandidate.categories.map(
                          (category) => (
                            <span
                              key={category}
                              className="rounded-full border border-[#f5efe3]/15 px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-[#f5efe3]/50"
                            >
                              {category}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {/* FEATURED EVIDENCE */}
{selectedFeaturedEvidence && (
  <div className="relative min-h-[360px] overflow-hidden border-b border-[#f5efe3]/12 md:min-h-[480px]">
    <img
      src={selectedFeaturedEvidence.url}
      alt={selectedFeaturedEvidence.title}
      className="absolute inset-0 h-full w-full object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-[#123b40] via-[#123b40]/35 to-transparent" />

    <div className="absolute inset-x-0 bottom-0 p-7 md:p-10 lg:p-12">
      <p className="text-[8px] uppercase tracking-[0.28em] text-[#f0a087]">
        Featured evidence
      </p>

      <h3 className="mt-3 max-w-xl font-serif text-3xl leading-none tracking-[-0.03em] md:text-5xl">
        {selectedFeaturedEvidence.title}
      </h3>

      {selectedFeaturedEvidence.description && (
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#f5efe3]/65">
          {selectedFeaturedEvidence.description}
        </p>
      )}
    </div>
  </div>
)}

                  {/* JOURNEY */}
                  <div className="p-7 md:p-10 lg:p-12">
                    <div className="flex items-end justify-between gap-6 border-b border-[#f5efe3]/12 pb-6">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.28em] text-[#f0a087]">
                          Public Journey
                        </p>

                        <h3 className="mt-2 font-serif text-3xl">
                          Selected chapters
                        </h3>
                      </div>

                      <p className="text-[8px] uppercase tracking-[0.2em] text-[#f5efe3]/30">
                        {
                          selectedCandidate.milestones
                            .length
                        }{" "}
                        visible
                      </p>
                    </div>

                    <div>
                      {selectedCandidate.milestones.map(
  (milestone, index) => {
    const formattedDate =
      new Date(milestone.date).toLocaleDateString(
        "en-CA",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );

    const milestoneEvidence =
      evidenceByMilestone[milestone._id] || [];

    const featuredEvidence =
      milestoneEvidence.find(
        (item) =>
          item.resourceType === "image" ||
          item.type.toLowerCase() === "image"
      );

    return (
                            <button
                              key={milestone._id}
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/milestones/${milestone._id}`
                                )
                              }
                              className="group grid w-full gap-6 border-b border-[#f5efe3]/10 py-8 text-left transition last:border-b-0 md:grid-cols-[90px_1fr_180px_auto] md:items-start"
                            >
                              <div>
                                <p className="font-serif text-3xl text-[#f0a087]/80">
                                  {String(
                                    index + 1
                                  ).padStart(2, "0")}
                                </p>
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                                  <span className="text-[8px] uppercase tracking-[0.24em] text-[#f0a087]">
                                    {milestone.category ||
                                      "Milestone"}
                                  </span>

                                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#f5efe3]/28">
                                    {formattedDate}
                                  </span>
                                </div>

                                <h4 className="mt-4 font-serif text-3xl leading-none tracking-[-0.03em] md:text-4xl">
                                  {milestone.title}
                                </h4>

                                <p className="mt-4 max-w-2xl line-clamp-3 text-sm leading-7 text-[#f5efe3]/50">
                                  {milestone.description}
                                </p>
                                <div className="mt-5 overflow-hidden rounded-sm border border-[#f5efe3]/10 bg-[#123b40]/40">
  {featuredEvidence ? (
    <img
      src={featuredEvidence.url}
      alt={featuredEvidence.title}
      className="h-32 w-full object-cover transition duration-500 group-hover:scale-[1.04] md:h-28"
    />
  ) : (
    <div className="flex h-32 items-center justify-center md:h-28">
      <span className="text-[8px] uppercase tracking-[0.22em] text-[#f5efe3]/25">
        No visual evidence
      </span>
    </div>
  )}
</div>
                              </div>

                              <span className="text-sm text-[#f5efe3]/25 transition duration-300 group-hover:translate-x-2 group-hover:text-[#f0a087]">
                                →
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* BOTTOM STATEMENT */}
                  <div className="border-t border-[#f5efe3]/12 bg-[#123b40]/35 p-7 md:p-10">
                    <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                      <p className="max-w-2xl font-serif text-3xl leading-tight text-[#f5efe3]/85 md:text-4xl">
                        A résumé shows where someone has
                        been.
                        <br />
                        <span className="text-[#f0a087]">
                          Their journey shows who they are
                          becoming.
                        </span>
                      </p>

                      <span className="text-[8px] uppercase tracking-[0.26em] text-[#f5efe3]/25">
                        Who Are You Becoming?
                      </span>
                    </div>
                  </div>
                </article>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}