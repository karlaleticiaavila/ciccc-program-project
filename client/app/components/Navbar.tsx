"use client";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-10 py-6">

        {/* Logo */}
        <h1 className="font-serif text-xl tracking-tight text-black">
          WHO ARE YOU BECOMING?
        </h1>

        {/* Navigation */}
        <div className="hidden items-center gap-10 text-sm uppercase tracking-[0.18em] md:flex">
          <button className="transition hover:opacity-60">
            Journey
          </button>

          <button className="transition hover:opacity-60">
            Mentors
          </button>

          <button className="transition hover:opacity-60">
            Recruiters
          </button>
        </div>

        {/* Login */}
        <button className="rounded-full border border-black px-5 py-2 text-sm transition hover:bg-black hover:text-white">
          Sign In
        </button>

      </nav>
    </header>
  );
}