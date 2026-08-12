"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#123b40] text-[#f5efe3]">
      <div className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#79a7b7]/15 blur-[130px]" />

      <div className="pointer-events-none absolute -bottom-32 right-0 h-[420px] w-[420px] rounded-full bg-[#e88b72]/15 blur-[130px]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="font-serif text-lg leading-none tracking-[-0.03em] transition hover:text-[#f0a087]"
        >
          WHO ARE YOU BECOMING?
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-[9px] uppercase tracking-[0.25em] text-[#f5efe3]/45 transition hover:text-white"
        >
          Back home
        </button>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-[1400px] items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_0.8fr] lg:px-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#f0a087]">
            Welcome back
          </p>

          <h1 className="mt-7 max-w-4xl font-serif text-[clamp(4.5rem,8vw,8rem)] leading-[0.82] tracking-[-0.065em]">
            Continue
            <br />
            becoming.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-[#f5efe3]/60 md:text-lg">
            Return to your personal archive, continue documenting
            your milestones and keep building the story behind your
            work.
          </p>
        </div>

        <div className="border border-[#f5efe3]/15 bg-[#174a50]/70 p-7 backdrop-blur-xl md:p-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#f5efe3]/42">
            Sign in
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight">
            Your journey is waiting.
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#f5efe3]/55">
            Choose how you would like to continue.
          </p>

          <div className="mt-9 space-y-4">
            <button
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/",
                })
              }
              className="
                w-full
                rounded-full
                bg-[#f5efe3]
                px-6
                py-4
                text-xs
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#173f43]
                transition
                hover:-translate-y-0.5
                hover:bg-white
              "
            >
              Continue with Google
            </button>

            <button
              type="button"
              disabled
              className="
                w-full
                cursor-not-allowed
                rounded-full
                border
                border-[#f5efe3]/20
                px-6
                py-4
                text-xs
                uppercase
                tracking-[0.16em]
                text-[#f5efe3]/35
              "
            >
              Continue with Apple
            </button>
          </div>

          <p className="mt-8 text-center text-xs leading-6 text-[#f5efe3]/35">
            Apple Sign In is coming next.
          </p>
        </div>
      </section>
    </main>
  );
}