"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#f5efe3]/15 bg-[#102f35] px-5 pb-8 pt-24 text-[#f5efe3] md:px-8 md:pt-32">
      <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[#79a7b7]/12 blur-[135px]" />

      <div className="pointer-events-none absolute -right-44 bottom-0 h-[440px] w-[440px] rounded-full bg-[#e88b72]/14 blur-[140px]" />

      <div className="relative mx-auto max-w-[1500px]">
        <div className="grid gap-14 border-b border-[#f5efe3]/15 pb-16 md:grid-cols-[1.3fr_0.7fr] md:items-end md:pb-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#f0a087]">
              Who are you becoming?
            </p>

            <h2 className="mt-7 max-w-5xl font-serif text-[clamp(4rem,9vw,9rem)] leading-[0.82] tracking-[-0.065em] text-[#f5efe3]">
              Keep your
              <br />
              story alive.
            </h2>
          </div>

          <div className="max-w-sm md:justify-self-end">
            <p className="text-sm leading-7 text-[#f5efe3]/55">
              A living archive of milestones, evidence and the
              people who helped shape your journey.
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              className="
                group
                mt-8
                flex
                items-center
                gap-4
                text-[10px]
                uppercase
                tracking-[0.24em]
                text-[#f5efe3]/65
                transition
                hover:text-[#f5efe3]
              "
            >
              <span className="border-b border-[#f0a087]/60 pb-1 transition group-hover:border-[#f0a087]">
                Back to top
              </span>

              <span className="text-[#f0a087] transition duration-300 group-hover:-translate-y-1">
                ↑
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 py-7 text-[9px] uppercase tracking-[0.22em] text-[#f5efe3]/35 md:flex-row md:items-center md:justify-between">
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
        className="pointer-events-none absolute -bottom-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap font-serif text-[14vw] leading-none tracking-[-0.08em] text-[#f5efe3]/[0.025] lg:block"
      >
        WHO ARE YOU BECOMING?
      </p>
    </footer>
  );
}