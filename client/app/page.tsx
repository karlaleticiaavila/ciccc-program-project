"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import CreateMilestoneForm from "./components/CreateMilestoneForm";
import JourneyMap from "./components/JourneyMap";
import type { Milestone } from "../lib/types/milestone";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  return (
    <main className="min-h-screen p-8">
      <Hero onOpenForm={() => setIsFormOpen(true)} />

      {isFormOpen && (
        <CreateMilestoneForm
          onMilestoneCreated={() => setIsFormOpen(false)}
        />
      )}

      <JourneyMap />
    </main>
  );
}