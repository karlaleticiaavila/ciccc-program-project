"use client";
import type { Milestone } from "../../lib/types/milestone";
import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import { socket } from "../../lib/socket";

import "@xyflow/react/dist/style.css";

type JourneyMapProps = {
  onMilestoneSelect: (milestone: Milestone) => void;
};

export default function JourneyMap({
  onMilestoneSelect,
}: JourneyMapProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  

  const fetchMilestones = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/milestones"
      );

      if (!response.ok) {
        throw new Error("Could not load milestones");
      }

      const data: Milestone[] = await response.json();

      const milestoneNodes: Node[] = data.map(
        (milestone, index) => ({
          id: milestone._id,
          position: {
            x: index * 350,
            y: index % 2 === 0 ? 100 : 260,
          },
          data: {
            label: milestone.title,
            milestone,
          },
        })
      );

      const milestoneEdges: Edge[] = data
        .slice(1)
        .map((milestone, index) => {
          const previousMilestone = data[index];

          return {
            id: `edge-${previousMilestone._id}-${milestone._id}`,
            source: previousMilestone._id,
            target: milestone._id,
            animated: true,
          };
        });

      setNodes(milestoneNodes);
      setEdges(milestoneEdges);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

 useEffect(() => {
  const handleConnect = () => {
    console.log("✅ Connected to server:", socket.id);
  };

  const handleMilestoneCreated = () => {
    fetchMilestones();
  };

  socket.on("connect", handleConnect);
  socket.on("milestoneCreated", handleMilestoneCreated);

  return () => {
    socket.off("connect", handleConnect);
    socket.off("milestoneCreated", handleMilestoneCreated);
  };
}, [fetchMilestones]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  if (isLoading) {
    return <p className="text-center">Loading journey...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="h-[700px] w-full text-black">
      <ReactFlow
  nodes={nodes}
  edges={edges}
  fitView
  onNodeClick={(_event, node) => {
    const milestone = node.data.milestone as Milestone;
    onMilestoneSelect(milestone);
  }}
>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}



