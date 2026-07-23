"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import CreateMilestoneForm from "./components/CreateMilestoneForm";
import JourneyMap from "./components/JourneyMap";
import type { Milestone } from "../lib/types/milestone";
import MilestoneCard from "./components/MilestoneCard";
import Mission from "./components/Mission";
import Navbar from "./components/Navbar";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  return (
   <main className="min-h-screen bg-[#FCFAF8] ">
    <Navbar />
      <Hero onOpenForm={() => setIsFormOpen(true)} />

      {isFormOpen && (
        <CreateMilestoneForm
          onMilestoneCreated={() => setIsFormOpen(false)}
        />
      )}
<Mission />
      <JourneyMap
  onMilestoneSelect={(milestone) => {
    setSelectedMilestone(milestone);
  }}
/>
<MilestoneCard milestone={selectedMilestone} />
    </main>
  );
}