"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-50
        border-b
        border-[#f5efe3]/15
        bg-[#123b40]/75
        backdrop-blur-xl
      "
    >
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-4 md:px-8 md:py-5">
        <button
          type="button"
          onClick={scrollToTop}
          className="
            max-w-[175px]
            text-left
            font-serif
            text-base
            leading-[0.95]
            tracking-[-0.035em]
            text-[#f5efe3]
            transition
            hover:text-[#f0a087]
            md:max-w-none
            md:text-lg
          "
        >
          WHO ARE YOU
          <span className="hidden sm:inline"> </span>
          <br className="sm:hidden" />
          BECOMING?
        </button>

        <div className="hidden items-center gap-8 text-[10px] uppercase tracking-[0.24em] text-[#f5efe3]/55 md:flex">
          {status === "authenticated" ? (
            <>
              <button
                type="button"
                onClick={scrollToJourney}
                className="relative py-2 transition hover:text-[#f5efe3]"
              >
                Journey
              </button>

              <button
                type="button"
                className="cursor-default py-2 opacity-40"
                title="Coming soon"
              >
                Mentors
              </button>

              <button
                type="button"
                className="cursor-default py-2 opacity-40"
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
                className="relative py-2 transition hover:text-[#f5efe3]"
              >
                Mission
              </button>

              <button
                type="button"
                className="cursor-default py-2 opacity-40"
                title="Coming soon"
              >
                Mentors
              </button>

              <button
                type="button"
                className="cursor-default py-2 opacity-40"
                title="Coming soon"
              >
                Recruiters
              </button>
            </>
          )}
        </div>

        {status === "loading" ? (
          <div className="h-10 w-24 animate-pulse rounded-full border border-[#f5efe3]/15 bg-[#f5efe3]/5" />
        ) : status === "authenticated" ? (
          <button
            type="button"
            onClick={() => signOut()}
            className="
              shrink-0
              rounded-full
              border
              border-[#f5efe3]/30
              px-5
              py-2.5
              text-[10px]
              uppercase
              tracking-[0.17em]
              text-[#f5efe3]/80
              transition
              duration-300
              hover:border-[#f5efe3]
              hover:bg-[#f5efe3]
              hover:text-[#173f43]
            "
          >
            Sign out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => signIn("google")}
            className="
              shrink-0
              rounded-full
              bg-[#f0a087]
              px-5
              py-2.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.17em]
              text-[#173f43]
              shadow-[0_8px_24px_rgba(232,139,114,0.2)]
              transition
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#f5b09a]
              hover:shadow-[0_12px_30px_rgba(232,139,114,0.3)]
            "
          >
            Sign in
          </button>
        )}
      </nav>
    </header>
  );
}