export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black px-5 pb-8 pt-24 text-[#F4F0E8] md:px-8 md:pt-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-14 border-b border-white/10 pb-16 md:grid-cols-[1.3fr_0.7fr] md:items-end md:pb-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">
              Who are you becoming?
            </p>

            <h2 className="mt-7 max-w-5xl font-serif text-[clamp(4rem,9vw,9rem)] leading-[0.82] tracking-[-0.065em] text-[#F4F0E8]">
              Keep your
              <br />
              story alive.
            </h2>
          </div>

          <div className="max-w-sm md:justify-self-end">
            <p className="text-sm leading-7 text-white/45">
              A living archive of milestones, evidence and the people who
              helped shape your journey.
            </p>

            <button
              type="button"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="mt-8 border-b border-white/40 pb-1 text-[10px] uppercase tracking-[0.24em] text-white/65 transition hover:border-white hover:text-white"
            >
              Back to top ↑
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 py-7 text-[10px] uppercase tracking-[0.2em] text-white/30 md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} Who Are You Becoming?
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <span>Personal archive</span>
            <span>Mentors</span>
            <span>Recruiters</span>
          </div>

          <p>All rights reserved</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap font-serif text-[14vw] leading-none tracking-[-0.08em] text-white/[0.025] lg:block"
      >
        WHO ARE YOU BECOMING?
      </p>
    </footer>
  );
}