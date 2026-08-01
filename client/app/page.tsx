"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import type { Milestone } from "../lib/types/milestone";
import CreateMilestoneForm from "./components/CreateMilestoneForm";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import JourneyMap from "./components/JourneyMap";
import MilestoneCard from "./components/MilestoneCard";
import Mission from "./components/Mission";
import Navbar from "./components/Navbar";

export default function Home() {
  const { data: session, status } = useSession();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] =
    useState<Milestone | null>(null);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoadingMilestones, setIsLoadingMilestones] =
    useState(true);
  const [milestonesError, setMilestonesError] = useState("");

  const fetchMilestones = useCallback(async () => {
    if (!session?.accessToken) {
      setMilestones([]);
      setSelectedMilestone(null);
      setIsLoadingMilestones(false);
      return;
    }

    try {
      setMilestonesError("");

      const response = await fetch(
        "http://localhost:5000/api/milestones",
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load milestones");
      }

      setMilestones(data);

      setSelectedMilestone((currentMilestone) => {
        if (!currentMilestone) {
          return null;
        }

        const updatedMilestone = data.find(
          (milestone: Milestone) =>
            milestone._id === currentMilestone._id
        );

        return updatedMilestone ?? null;
      });
    } catch (error) {
      setMilestonesError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoadingMilestones(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    void fetchMilestones();
  }, [status, fetchMilestones]);

  return (
    <main className="min-h-screen bg-[#FCFAF8]">
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
        onMilestoneSelect={(milestone) => {
          setSelectedMilestone(milestone);
        }}
      />

      <MilestoneCard
        milestone={selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
        onMilestoneDeleted={fetchMilestones}
        onMilestoneUpdated={fetchMilestones}
      />

      <Footer />
    </main>
  );
}