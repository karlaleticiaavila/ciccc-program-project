"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();

  const scrollToJourney = () => {
    document
      .getElementById("journey-map")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMission = () => {
    document
      .getElementById("mission")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-5 md:px-8">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="max-w-[190px] text-left font-serif text-base leading-tight tracking-[-0.02em] text-[#F4F0E8] md:max-w-none md:text-lg"
        >
          WHO ARE YOU BECOMING?
        </button>

        <div className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-white/55 md:flex">
          {status === "authenticated" ? (
            <>
              <button
                type="button"
                onClick={scrollToJourney}
                className="transition hover:text-white"
              >
                Journey
              </button>

              <button
                type="button"
                className="cursor-default opacity-40"
                title="Coming soon"
              >
                Mentors
              </button>

              <button
                type="button"
                className="cursor-default opacity-40"
                title="Coming soon"
              >
                Recruiters
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={scrollToMission}
                className="transition hover:text-white"
              >
                Mission
              </button>

              <button
                type="button"
                className="cursor-default opacity-40"
                title="Coming soon"
              >
                Mentors
              </button>

              <button
                type="button"
                className="cursor-default opacity-40"
                title="Coming soon"
              >
                Recruiters
              </button>
            </>
          )}
        </div>

        {status === "loading" ? (
          <div className="h-10 w-24 rounded-full border border-white/10 bg-white/5" />
        ) : status === "authenticated" ? (
          <button
            type="button"
            onClick={() => signOut()}
            className="shrink-0 rounded-full border border-white/25 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-white transition hover:border-white hover:bg-white hover:text-black"
          >
            Sign out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => signIn("google")}
            className="shrink-0 rounded-full bg-[#F4F0E8] px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-black transition hover:bg-white"
          >
            Sign in
          </button>
        )}
      </nav>
    </header>
  );
}