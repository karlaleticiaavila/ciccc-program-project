"use client";

import { useCallback, useEffect, useState } from "react";
import Hero from "./components/Hero";
import CreateMilestoneForm from "./components/CreateMilestoneForm";
import JourneyMap from "./components/JourneyMap";
import type { Milestone } from "../lib/types/milestone";
import MilestoneCard from "./components/MilestoneCard";
import Mission from "./components/Mission";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
const [isLoadingMilestones, setIsLoadingMilestones] = useState(true);
const [milestonesError, setMilestonesError] = useState("");
const fetchMilestones = useCallback(async () => {
  try {
    setIsLoadingMilestones(true);
    setMilestonesError("");

    const response = await fetch(
      "http://localhost:5000/api/milestones"
    );

    if (!response.ok) {
      throw new Error("Could not load milestones");
    }

    const data: Milestone[] = await response.json();
    setMilestones(data);
  } catch (error) {
    setMilestonesError(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  } finally {
    setIsLoadingMilestones(false);
  }
}, []);

useEffect(() => {
  fetchMilestones();
}, [fetchMilestones]);

  return (
   <main className="min-h-screen bg-[#FCFAF8] ">
    <Navbar />
      <Hero onOpenForm={() => setIsFormOpen(true)} />

      {isFormOpen && (
  <div className="fixed inset-0 z-[100]">
    <button
      type="button"
      aria-label="Close milestone form"
      onClick={() => setIsFormOpen(false)}
      className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
    />

    <aside
      className="
        absolute
        left-0
        top-0
        h-full
        w-full
        max-w-xl
        animate-[slideInLeft_0.45s_ease-out]
        shadow-2xl
      "
    >
      <CreateMilestoneForm
        onClose={() => setIsFormOpen(false)}
        onMilestoneCreated={async () => {
          await fetchMilestones();
          setIsFormOpen(false);
        }}
      />
    </aside>
  </div>
)}
<Mission />
      <JourneyMap
        milestones={milestones}
        isLoading={isLoadingMilestones}
        error={milestonesError}
        onMilestoneSelect={(milestone) => setSelectedMilestone(milestone)}
      />
<MilestoneCard milestone={selectedMilestone}
onClose={() => setSelectedMilestone(null)}
onMilestoneDeleted={fetchMilestones} />
<Footer />
    </main>
    
  );
}