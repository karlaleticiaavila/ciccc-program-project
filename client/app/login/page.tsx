"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "register">(
    "signin"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  const handleCredentialsSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (mode === "register" && !name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setIsLoading(true);

      // CREATE ACCOUNT FIRST
      if (mode === "register") {
        const registerResponse = await fetch(
          `${apiUrl}/api/users/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim(),
              password,
            }),
          }
        );

        const registerData =
          await registerResponse.json();

        if (!registerResponse.ok) {
          setError(
            registerData.message ||
              "Could not create account."
          );
          return;
        }
      }

      // SIGN IN THROUGH NEXTAUTH CREDENTIALS
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Credentials authentication error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* LEFT */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#f0a087]">
            {mode === "signin"
              ? "Welcome back"
              : "Begin your journey"}
          </p>

          <h1 className="mt-7 max-w-4xl font-serif text-[clamp(4.5rem,8vw,8rem)] leading-[0.82] tracking-[-0.065em]">
            {mode === "signin" ? (
              <>
                Continue
                <br />
                becoming.
              </>
            ) : (
              <>
                Start
                <br />
                becoming.
              </>
            )}
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-[#f5efe3]/60 md:text-lg">
            {mode === "signin"
              ? "Return to your personal archive, continue documenting your milestones and keep building the story behind your work."
              : "Create your personal archive, document meaningful milestones and begin building the story behind your work."}
          </p>
        </div>

        {/* AUTH CARD */}
        <div className="border border-[#f5efe3]/15 bg-[#174a50]/70 p-7 backdrop-blur-xl md:p-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#f5efe3]/42">
            {mode === "signin"
              ? "Sign in"
              : "Create account"}
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight">
            {mode === "signin"
              ? "Your journey is waiting."
              : "Your journey starts here."}
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#f5efe3]/55">
            Choose how you would like to continue.
          </p>

          {/* OAUTH */}
          <div className="mt-9 space-y-3">
            <button
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/",
                })
              }
              className="w-full rounded-full bg-[#f5efe3] px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#173f43] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Continue with Google
            </button>
<button
  type="button"
  onClick={() =>
    signIn("apple", {
      callbackUrl: "/",
    })
  }
  className="
    w-full
    rounded-full
    border
    border-[#f5efe3]/20
    px-6
    py-4
    text-xs
    uppercase
    tracking-[0.16em]
    text-[#f5efe3]
    transition
    hover:-translate-y-0.5
    hover:border-[#f5efe3]/40
    hover:bg-[#f5efe3]/5
  "
>
  Continue with Apple
</button>
          </div>

          {/* DIVIDER */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#f5efe3]/15" />

            <span className="text-[8px] uppercase tracking-[0.28em] text-[#f5efe3]/30">
              or continue with email
            </span>

            <div className="h-px flex-1 bg-[#f5efe3]/15" />
          </div>

          {/* EMAIL FORM */}
          <form
            onSubmit={handleCredentialsSubmit}
            className="space-y-4"
          >
            {mode === "register" && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-[#f5efe3]/45"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full border border-[#f5efe3]/15 bg-[#123b40]/40 px-5 py-4 text-sm text-[#f5efe3] outline-none transition placeholder:text-[#f5efe3]/25 focus:border-[#f0a087]"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-[#f5efe3]/45"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full border border-[#f5efe3]/15 bg-[#123b40]/40 px-5 py-4 text-sm text-[#f5efe3] outline-none transition placeholder:text-[#f5efe3]/25 focus:border-[#f0a087]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-[#f5efe3]/45"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                autoComplete={
                  mode === "register"
                    ? "new-password"
                    : "current-password"
                }
                className="w-full border border-[#f5efe3]/15 bg-[#123b40]/40 px-5 py-4 text-sm text-[#f5efe3] outline-none transition placeholder:text-[#f5efe3]/25 focus:border-[#f0a087]"
              />
            </div>

            {error && (
              <div className="border border-[#f0a087]/35 bg-[#f0a087]/10 px-4 py-3">
                <p className="text-xs leading-5 text-[#f5efe3]/80">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[#f0a087] px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#123b40] transition hover:-translate-y-0.5 hover:bg-[#f5aa94] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in with email"
                  : "Create account"}
            </button>
          </form>

          {/* SWITCH MODE */}
          <div className="mt-7 border-t border-[#f5efe3]/10 pt-6 text-center">
            <p className="text-xs text-[#f5efe3]/40">
              {mode === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <button
              type="button"
              onClick={() => {
                setMode(
                  mode === "signin"
                    ? "register"
                    : "signin"
                );
                setError("");
              }}
              className="mt-2 text-[9px] uppercase tracking-[0.24em] text-[#f0a087] transition hover:text-white"
            >
              {mode === "signin"
                ? "Create one →"
                : "Sign in →"}
            </button>
          </div>

          
        </div>
      </section>
    </main>
  );
}