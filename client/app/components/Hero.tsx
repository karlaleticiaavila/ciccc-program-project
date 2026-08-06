"use client";

export default function Hero({
  onOpenForm,
}: {
  onOpenForm: () => void;
}) {
  const scrollToMission = () => {
    document
      .getElementById("mission")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#2f7180] text-[#f5efe3]">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-butterflies.mp4" type="video/mp4" />
      </video>

      {/* Tinte azul ligero: conserva el color y el movimiento del video */}
      <div className="absolute inset-0 bg-[#145567]/15" />

      {/* Oscurece solamente el lado del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#102f35]/90 via-[#194b55]/45 to-transparent" />

      {/* Profundidad inferior, sin convertir todo en negro */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#123f46]/75 via-transparent to-[#296979]/15" />

      {/* Resplandor coral tomado de la imagen del cielo */}
      <div className="pointer-events-none absolute -left-40 top-[18%] h-[420px] w-[420px] rounded-full bg-[#e88b72]/20 blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] flex-col justify-between px-5 pb-8 pt-32 md:px-10 md:pb-10 md:pt-40">
        <div className="flex items-start justify-between gap-8">
          <p className="max-w-[260px] text-[10px] uppercase leading-5 tracking-[0.32em] text-[#f5efe3]/65">
            A living archive of growth, evidence and identity
          </p>

          <div className="hidden items-center gap-3 md:flex">
            <span className="h-2 w-2 rounded-full bg-[#f0a087]" />

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#f5efe3]/55">
              Your story is still unfolding
            </p>
          </div>
        </div>

        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="max-w-6xl">
            <p className="text-xs uppercase tracking-[0.34em] text-[#f0a087]">
              More than a résumé
            </p>

            <h1 className="mt-7 font-serif text-[clamp(4.5rem,10vw,10rem)] leading-[0.8] tracking-[-0.07em] text-[#f5efe3]">
              Who are
              <br />
              you becoming?
            </h1>
          </div>

          <div className="border-t border-[#f5efe3]/30 pt-6 lg:mb-3">
            <p className="text-base leading-7 text-[#f5efe3]/78">
              Preserve the milestones, people and evidence that reveal how
              your life, identity and ambitions continue to evolve.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={onOpenForm}
                className="
                  rounded-full
                  bg-[#f2a086]
                  px-7
                  py-3.5
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.17em]
                  text-[#173d42]
                  shadow-[0_12px_35px_rgba(232,139,114,0.25)]
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#f5b09a]
                  hover:shadow-[0_18px_45px_rgba(232,139,114,0.38)]
                "
              >
                Begin your archive
              </button>

              <button
                type="button"
                onClick={scrollToMission}
                className="
                  border-b
                  border-[#f5efe3]/40
                  pb-1
                  text-[10px]
                  uppercase
                  tracking-[0.22em]
                  text-[#f5efe3]/75
                  transition
                  hover:border-[#f5efe3]
                  hover:text-[#f5efe3]
                "
              >
                Discover the mission
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#f5efe3]/20 pt-5">
          <p className="text-[9px] uppercase tracking-[0.28em] text-[#f5efe3]/45">
            Scroll to explore
          </p>

          <div className="hidden items-center gap-4 sm:flex">
            <span className="h-px w-14 bg-[#f0a087]/65" />

            <p className="text-[9px] uppercase tracking-[0.25em] text-[#f5efe3]/50">
              Milestones · Evidence · Mentorship
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}