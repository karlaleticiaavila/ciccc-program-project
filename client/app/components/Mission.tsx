"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

const missionImages = [
  {
    src: "/hero-meadows.jpg",
    alt: "A person resting in a green meadow",
  },
  {
    src: "/hero-forest-chair.jpg",
    alt: "A white chair in a deep green forest",
  },
  {
    src: "/hero-sheep.jpg",
    alt: "A sheep leaping across a green field",
  },
  {
    src: "/hero-sky.jpg",
    alt: "A surreal coral and turquoise sky",
  },
];

export default function Mission() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage(
        (currentImage) =>
          (currentImage + 1) % missionImages.length
      );
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section
      id="mission"
      className="relative overflow-hidden bg-[#173f43] px-5 py-24 text-[#f5efe3] md:px-8 md:py-32"
    >
      <div className="pointer-events-none absolute -right-44 top-16 h-[420px] w-[420px] rounded-full bg-[#e88b72]/15 blur-[130px]" />

      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#78a8b8]/15 blur-[140px]" />

      <div className="relative mx-auto grid max-w-[1500px] items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-24">
        <div className="relative min-h-[520px] overflow-hidden border border-[#f5efe3]/15 md:min-h-[720px]">
          {missionImages.map((image, index) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={`
                object-cover
                transition-[opacity,transform,filter]
                duration-[2600ms]
                ease-in-out
                ${
                  index === activeImage
                    ? "scale-100 opacity-100 blur-0"
                    : "scale-[1.025] opacity-0 blur-[2px]"
                }
              `}
            />
          ))}

          <div className="absolute inset-0 bg-[#173f43]/10" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#102f35]/65 via-transparent to-[#173f43]/10" />
        </div>

        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f5efe3]/45">
            Our mission
          </p>

          <h2 className="mt-7 font-serif text-5xl leading-[0.95] tracking-[-0.045em] text-[#f5efe3] md:text-7xl">
            Your journey is more than a résumé.
          </h2>

          <div className="mt-10 max-w-xl space-y-6 text-base leading-8 text-[#f5efe3]/68 md:text-lg">
            <p>
              Most platforms document where you worked and what title you
              held. We preserve the experiences that reveal who you became
              along the way.
            </p>

            <p>
              Every milestone can hold growth, resilience, evidence, mentors
              and the moments that continue shaping your future.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => signIn("google")}
              className="rounded-full bg-[#f0a087] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.17em] text-[#173f43] shadow-[0_12px_35px_rgba(232,139,114,0.2)] transition duration-300 hover:-translate-y-1 hover:bg-[#f5b09a] hover:shadow-[0_18px_45px_rgba(232,139,114,0.32)]"
            >
              Begin your journey
            </button>

            <p className="max-w-[250px] text-xs leading-5 text-[#f5efe3]/45">
              Build a personal archive that grows with your life, work and
              ambitions.
            </p>
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 right-0 hidden font-serif text-[clamp(8rem,17vw,18rem)] leading-none tracking-[-0.08em] text-[#f5efe3]/[0.035] lg:block"
      >
        BECOMING
      </p>
    </section>
  );
}