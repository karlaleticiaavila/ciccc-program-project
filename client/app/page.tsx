"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import CreateMilestoneForm from "./components/CreateMilestoneForm";
import JourneyMap from "./components/JourneyMap";
import type { Milestone } from "../lib/types/milestone";
import MilestoneCard from "./components/MiestoneCard";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  return (
   <main className="min-h-screen bg-[#F8D7D3] px-8 py-12">
      <Hero onOpenForm={() => setIsFormOpen(true)} />

      {isFormOpen && (
        <CreateMilestoneForm
          onMilestoneCreated={() => setIsFormOpen(false)}
        />
      )}

      <JourneyMap
  onMilestoneSelect={(milestone) => {
    setSelectedMilestone(milestone);
  }}
/>
<MilestoneCard milestone={selectedMilestone} />
    </main>
  );
}