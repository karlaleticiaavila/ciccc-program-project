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

  return (
    <section className="relative min-h-[760px] overflow-hidden border-b border-white/10 bg-black pt-24">
      <img
        src="/hero-graffiti.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/35" />

      <div className="relative mx-auto flex min-h-[680px] max-w-[1500px] flex-col justify-between px-5 py-12 md:px-8 md:py-16">
        <div className="flex items-start justify-between gap-8">
          <p className="text-[10px] uppercase tracking-[0.34em] text-white/45">
            Personal archive
          </p>

          {userImage && (
            <img
              src={userImage}
              alt={fullName || firstName}
              className="h-14 w-14 shrink-0 rounded-full border border-white/30 object-cover shadow-[0_0_0_6px_rgba(255,255,255,0.05)] md:h-16 md:w-16"
            />
          )}
        </div>

        <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">
          <div className="max-w-5xl">
            <p className="text-xs uppercase tracking-[0.32em] text-white/50">
              Welcome back, {firstName}
            </p>

            <h1 className="mt-6 font-serif text-[clamp(4rem,9vw,9rem)] leading-[0.82] tracking-[-0.06em] text-[#F4F0E8]">
              Keep
              <br />
              becoming.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
              Document the milestones, evidence and experiences that continue
              shaping your identity, your work and your future.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenForm}
                className="rounded-full bg-[#F4F0E8] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-black transition duration-300 hover:scale-[1.03] hover:bg-white"
              >
                Add milestone
              </button>

              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("journey-map")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full border border-white/25 px-7 py-3.5 text-xs uppercase tracking-[0.16em] text-white transition hover:border-white hover:bg-white/10"
              >
                Explore journey
              </button>
            </div>
          </div>

          <div className="w-full border-t border-white/20 pt-6 lg:w-[280px]">
            <div className="flex items-end justify-between">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                Chapters recorded
              </p>

              <span className="text-xs text-white/35">Current archive</span>
            </div>

            <div className="mt-6 flex items-end gap-4">
              <p className="font-serif text-8xl leading-none tracking-[-0.06em] text-[#F4F0E8]">
                {String(milestoneCount).padStart(2, "0")}
              </p>

              <p className="pb-2 text-xs uppercase tracking-[0.22em] text-white/45">
                {milestoneCount === 1 ? "Milestone" : "Milestones"}
              </p>
            </div>

            <p className="mt-6 text-sm leading-6 text-white/50">
              Every chapter becomes part of the story you can share with
              mentors, recruiters and future collaborators.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}