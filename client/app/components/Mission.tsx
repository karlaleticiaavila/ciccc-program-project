"use client";

import Image from "next/image";

export default function Mission() {
  return (
    <section className="mx-auto mt-24 max-w-7xl">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative h-[650px] overflow-hidden rounded-3xl">
          <Image
            src="/hero-meadows.jpg"
            alt="Person reflecting in a peaceful meadow"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="max-w-xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-black/50">
            Our Mission
          </p>

          <h2 className="font-serif text-5xl leading-tight text-black">
            Every life deserves to be remembered.
          </h2>

          <p className="mt-8 text-lg leading-8 text-black/70">
            Most platforms tell people where you've worked.
            We want to show who you've become.
          </p>

          <p className="mt-6 text-lg leading-8 text-black/70">
            Every milestone represents growth, resilience and the experiences
            that shaped your journey.
          </p>

          <button className="mt-10 rounded-full bg-black px-8 py-4 text-white transition hover:opacity-90">
            Begin Your Journey
          </button>
        </div>
      </div>
    </section>
  );
}