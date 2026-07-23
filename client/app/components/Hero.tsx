export default function Hero({
  onOpenForm,
}: {
  onOpenForm: () => void;
}) {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden text-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="/hero-butterflies.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-[#F8D7D3]/20" />

      <div className="relative z-10 px-6">
        <h1 className="font-serif text-6xl tracking-tight text-black md:text-8xl">
          WHO ARE YOU BECOMING?
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-black/70">
          Every milestone tells a story. Every story shapes who you become.
        </p>

        <button
          onClick={onOpenForm}
          className="mt-10 rounded-full bg-black px-8 py-3 text-white transition hover:scale-105"
        >
          + Add Milestone
        </button>
      </div>
    </section>
  );
}