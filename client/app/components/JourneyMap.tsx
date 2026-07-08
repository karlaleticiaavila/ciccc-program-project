"use client";

import { useEffect, useState } from "react";
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

type Milestone = {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
};

export default function JourneyMap() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    const fetchMilestones = async () => {
      const res = await fetch("http://localhost:5000/api/milestones");
      const data: Milestone[] = await res.json();

      const milestoneNodes: Node[] = data.map((milestone, index) => ({
        id: milestone._id,
        position: {
          x: index * 350,
          y: index % 2 === 0 ? 100 : 260,
        },
        data: {
          label: milestone.title,
        },
      }));

      const milestoneEdges: Edge[] = data.slice(1).map((milestone, index) => ({
        id: `edge-${data[index]._id}-${milestone._id}`,
        source: data[index]._id,
        target: milestone._id,
        animated: true,
      }));

      setNodes(milestoneNodes);
      setEdges(milestoneEdges);
    };

    fetchMilestones();
  }, []);

  return (
    <div style={{ width: "100%", height: "700px", color: "black" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}