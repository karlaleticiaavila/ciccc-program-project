export default function Hero({
  onOpenForm,
}: {
  onOpenForm: () => void;
}) {
  return (
    <section className="flex flex-col items-center py-20 text-center">
      <h1 className="font-serif text-6xl md:text-8xl tracking-tight text-black">
        WHO ARE YOU BECOMING?
      </h1>

      <p className="mt-6 max-w-xl text-gray-600 text-lg">
        Every milestone tells a story.
        Every story shapes who you become.
      </p>

      <button
        onClick={onOpenForm}
        className="mt-10 rounded-full bg-black px-8 py-3 text-white transition hover:scale-105"
      >
        + Add Milestone
      </button>
    </section>
  );
}