"use client";

import { useState } from "react";
import CreateMilestoneForm from "./components/CreateMilestoneForm";
import JourneyMap from "./components/JourneyMap";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <CreateMilestoneForm onMilestoneCreated={() => {}} />
      <JourneyMap />
    </main>
  );
}