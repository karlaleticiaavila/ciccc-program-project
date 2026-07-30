"use client";
import type { Milestone } from "../../lib/types/milestone";
import { useCallback, useEffect, useState } from "react";
import {  ReactFlow,Background,Controls,applyNodeChanges,
  type Node,
  type Edge,
  type NodeChange,
} from "@xyflow/react";
import { socket } from "../../lib/socket";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";


const nodeTypes = {
  milestone: CustomNode,
};  
type JourneyMapProps = {
  milestones: Milestone[];
  isLoading: boolean;
  error: string;
  onMilestoneSelect: (milestone: Milestone) => void;
};

export default function JourneyMap({
  milestones,
  isLoading: isLoadingFromPage,
  error: errorFromPage,
  onMilestoneSelect,
}: JourneyMapProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  
const handleNodesChange = useCallback(
  (changes: NodeChange[]) => {
    setNodes((currentNodes) =>
      applyNodeChanges(changes, currentNodes)
    );
  },
  []
);
useEffect(() => {
  const milestoneNodes: Node[] = milestones.map(
    (milestone, index) => ({
      id: milestone._id,
      type: "milestone",
      position: {
        x: index * 200,
        y: index % 2 === 0 ? 50 : 90,
      },
      data: {
        milestone,
      },
    })
  );

  const milestoneEdges: Edge[] = milestones
    .slice(1)
    .map((milestone, index) => {
      const previousMilestone = milestones[index];

      return {
        id: `edge-${previousMilestone._id}-${milestone._id}`,
        source: previousMilestone._id,
        target: milestone._id,
        animated: true,
        style: {
          stroke: "#a08e9e",
          strokeWidth: 1.2,
        },
      };
    });

  setNodes(milestoneNodes);
  setEdges(milestoneEdges);
}, [milestones]);


  if (isLoadingFromPage) {
    return <p className="text-center">Loading journey...</p>;
  }

  if (errorFromPage) {
    return <p className="text-center text-red-600">{errorFromPage}</p>;
  }

  return (
  <section className="bg-[#black] px-4 py-20 md:px-8">
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-6">
  <p className="text-xs uppercase tracking-[0.3em] text-black/45">
    Your Journey
  </p>

  <p className="mt-2 text-sm text-black/55">
    Drag, rearrange and explore the moments that shaped you.
  </p>
</div>

      <div className="h-[500px] w-full overflow-hidden rounded-[32px] border border-black/10 bg-[#black] text-black">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          fitView
          nodesDraggable
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          onNodeClick={(_event, node) => {
            const milestone = node.data.milestone as Milestone;
            onMilestoneSelect(milestone);
          }}
        >
          <Background gap={34} size={1} />
          <Controls />
          
        </ReactFlow>
      </div>
    </div>
  </section>
);

}
