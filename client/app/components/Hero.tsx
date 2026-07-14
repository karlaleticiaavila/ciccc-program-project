type HeroProps = {
  onOpenForm: () => void;
};

export default function Hero({ onOpenForm }: HeroProps) {
  return (
    <section>
      <h1>WHO ARE YOU BECOMING?</h1>

      <p>
        Visualize the experiences that shaped your journey.
      </p>

      <button onClick={onOpenForm}>
        + Add Milestone
      </button>
    </section>
  );
}