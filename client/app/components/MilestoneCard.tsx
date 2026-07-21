import type { Milestone } from "../../lib/types/milestone";
import { useState, useEffect } from "react";
import CreateEvidenceForm from "./CreateEvidenceForm";

type Evidence = {
  _id: string;
  title: string;
  type:
    | "image"
    | "certificate"
    | "link"
    | "github"
    | "video"
    | "document";
  url: string;
  description?: string;
  milestoneId: string;
};


type MilestoneCardProps = {
  milestone: Milestone | null;
};

export default function MilestoneCard({
  milestone,
}: MilestoneCardProps) {
const [evidences, setEvidences] = useState<Evidence[]>([]);

  const fetchEvidence = async () => {
    if (!milestone) {
      setEvidences([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/evidence/milestone/${milestone._id}`
      );

      if (!response.ok) {
        throw new Error("Could not fetch evidence");
      }

      const data: Evidence[] = await response.json();
      
      setEvidences(data);
    } catch (error) {
      console.error("Error fetching evidence:", error);
      setEvidences([]);
    }
  };


useEffect(() => {
  if (!milestone) {
    setEvidences([]);
    return;
  }

  fetchEvidence();
}, [milestone]);

if (!milestone) {
    return null;
  }


  return (
    <div className="mt-8 rounded-xl border border-black/20 p-6 text-black">
      <h2 className="text-2xl font-bold">
        {milestone.title}
      </h2>

      <p>{milestone.description}</p>

      <p>
        {new Date(milestone.date).toLocaleDateString()}
      </p>

      <p>{milestone.category}</p>
      <div className="mt-6">
  <h3 className="text-lg font-semibold">Evidence</h3>

  {evidences.length === 0 ? (
    <p className="mt-2 text-sm text-gray-500">
      No evidence added yet.
    </p>
  ) : (
    <div className="mt-3 space-y-3">
      {evidences.map((evidence) => (
        <a
  key={evidence._id}
  href={evidence.url}
  target="_blank"
  rel="noopener noreferrer"
  className="block rounded-lg border border-black/20 p-4 hover:bg-white/40 transition"
>
          <p className="font-semibold">{evidence.title}</p>

          <p className="text-sm capitalize">
            {evidence.type}
          </p>

          {evidence.description && (
            <p className="mt-1 text-sm text-gray-600">
              
              {evidence.description}
            </p>
          )}
        </a>
      ))}
    </div>
  )}
</div>
<CreateEvidenceForm milestoneId={milestone._id} onEvidenceCreated={fetchEvidence}/>
    </div>

);
}

