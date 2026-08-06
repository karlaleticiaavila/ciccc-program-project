"use client";

import type { Session } from "next-auth";

type DashboardProps = {
  session: Session;
  milestoneCount: number;
  onOpenForm: () => void;
};

export default function Dashboard({
  session,
  milestoneCount,
  onOpenForm,
}: DashboardProps) {
  const fullName = session.user?.name?.trim() ?? "";
  const firstName = fullName.split(" ")[0] || "there";
  const userImage = session.user?.image;

  const scrollToJourney = () => {
    document
      .getElementById("journey-map")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[#164b53] pt-24 text-[#f5efe3]">
      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#e88b72]/15 blur-[130px]" />

      <div className="pointer-events-none absolute bottom-0 right-[25%] h-[380px] w-[380px] rounded-full bg-[#79a7b7]/15 blur-[130px]" />

      <div className="mx-auto grid min-h-[760px] max-w-[1600px] lg:grid-cols-[1.08fr_0.92fr]">
        {/* LEFT: USER DASHBOARD */}
        <div className="relative flex min-h-[680px] flex-col justify-between px-5 py-12 md:px-10 md:py-16 lg:min-h-[760px] lg:px-14">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {userImage ? (
                <img
                  src={userImage}
                  alt={fullName || firstName}
                  className="h-14 w-14 rounded-full border border-[#f5efe3]/25 object-cover shadow-[0_0_0_6px_rgba(245,239,227,0.06)]"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#f5efe3]/20 bg-[#f5efe3]/10 font-serif text-xl">
                  {firstName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#f5efe3]/45">
                  Personal archive
                </p>

                <p className="mt-1 text-sm text-[#f5efe3]/75">
                  Welcome back, {firstName}
                </p>
              </div>
            </div>

            <span className="hidden text-[10px] uppercase tracking-[0.28em] text-[#f0a087] sm:block">
              Your story is unfolding
            </span>
          </div>

          <div className="py-16 md:py-20">
            <p className="text-xs uppercase tracking-[0.34em] text-[#f0a087]">
              Continue your journey
            </p>

            <h1 className="mt-7 max-w-4xl font-serif text-[clamp(4.7rem,8vw,8.5rem)] leading-[0.8] tracking-[-0.07em]">
              Keep
              <br />
              becoming.
            </h1>

            <p className="mt-9 max-w-2xl text-base leading-8 text-[#f5efe3]/68 md:text-lg">
              Document the milestones, evidence and experiences shaping your
              identity, your work and the future you are building.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenForm}
                className="rounded-full bg-[#f0a087] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.17em] text-[#173f43] shadow-[0_12px_35px_rgba(232,139,114,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#f5b09a] hover:shadow-[0_18px_45px_rgba(232,139,114,0.34)]"
              >
                Add milestone
              </button>

              <button
                type="button"
                onClick={scrollToJourney}
                className="rounded-full border border-[#f5efe3]/30 px-7 py-3.5 text-xs uppercase tracking-[0.17em] text-[#f5efe3]/80 transition duration-300 hover:border-[#f5efe3] hover:bg-[#f5efe3]/10 hover:text-[#f5efe3]"
              >
                Explore journey
              </button>
            </div>
          </div>

          <div className="grid gap-6 border-t border-[#f5efe3]/20 pt-7 sm:grid-cols-[auto_1fr] sm:items-end">
            <div className="flex items-end gap-4">
              <p className="font-serif text-7xl leading-none tracking-[-0.06em] text-[#f5efe3] md:text-8xl">
                {String(milestoneCount).padStart(2, "0")}
              </p>

              <p className="pb-2 text-[10px] uppercase tracking-[0.24em] text-[#f5efe3]/45">
                {milestoneCount === 1 ? "Chapter" : "Chapters"}
                <br />
                recorded
              </p>
            </div>

            <p className="max-w-md text-sm leading-6 text-[#f5efe3]/48 sm:justify-self-end">
              Every chapter becomes part of the story you can share with
              mentors, recruiters and future collaborators.
            </p>
          </div>
        </div>

        {/* RIGHT: GRAFFITI / REFLECTION */}
        <div className="relative min-h-[620px] overflow-hidden border-t border-[#f5efe3]/10 lg:min-h-[760px] lg:border-l lg:border-t-0">
          <img
            src="/hero-graffiti.jpg"
            alt="Are you proud of who you have become?"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Light overlays only, so the image remains visible */}
          <div className="absolute inset-0 bg-[#153f43]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102f35]/80 via-transparent to-[#164b53]/10" />

          <div className="absolute inset-x-0 bottom-0 p-7 md:p-10 lg:p-12">
            <div className="border-t border-white/35 pt-6">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/65">
                A question worth revisiting
              </p>

              <p className="mt-4 max-w-lg font-serif text-3xl leading-tight text-white md:text-4xl">
                Growth is not only what you achieve. It is who you become along
                the way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}