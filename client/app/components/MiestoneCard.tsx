import type { Milestone } from "../../lib/types/milestone";

type MilestoneCardProps = {
  milestone: Milestone | null;
};

export default function MilestoneCard({
  milestone,
}: MilestoneCardProps) {
  if (!milestone) {
    return null;
  }

  return (
    <div className="mt-8 rounded-xl border p-6">
      <h2 className="text-2xl font-bold">
        {milestone.title}
      </h2>

      <p>{milestone.description}</p>

      <p>
        {new Date(milestone.date).toLocaleDateString()}
      </p>

      <p>{milestone.category}</p>
    </div>
  );
}