"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  MarkerType,
  type Node,
  type Edge,
  type NodeChange,
} from "@xyflow/react";

import type { Milestone } from "../../lib/types/milestone";
import CustomNode from "./CustomNode";

import "@xyflow/react/dist/style.css";

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
  isLoading,
  error,
  onMilestoneSelect,
}: JourneyMapProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((first, second) => {
      const firstDate = new Date(first.date).getTime();
      const secondDate = new Date(second.date).getTime();

      if (Number.isNaN(firstDate)) {
        return 1;
      }

      if (Number.isNaN(secondDate)) {
        return -1;
      }

      return firstDate - secondDate;
    });
  }, [milestones]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((currentNodes) =>
        applyNodeChanges(changes, currentNodes)
      );
    },
    []
  );

  useEffect(() => {
    setNodes((currentNodes) =>
      sortedMilestones.map((milestone, index) => {
        const existingNode = currentNodes.find(
          (node) => node.id === milestone._id
        );

        return {
          id: milestone._id,
          type: "milestone",

          position:
            existingNode?.position ?? {
              x: index * 410,
              y: index % 2 === 0 ? 70 : 285,
            },

          data: {
            milestone,
            visualIndex: index,
          },
        };
      })
    );

    const timelineEdges: Edge[] = sortedMilestones
      .slice(1)
      .map((milestone, index) => {
        const previousMilestone = sortedMilestones[index];

        return {
          id: `edge-${previousMilestone._id}-${milestone._id}`,
          source: previousMilestone._id,
          target: milestone._id,
          animated: true,

          style: {
            stroke: "rgba(244, 240, 232, 0.58)",
            strokeWidth: 1.4,
          },

          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: "rgba(244, 240, 232, 0.58)",
          },
        };
      });

    setEdges(timelineEdges);
  }, [sortedMilestones]);

  if (isLoading) {
    return (
      <section
        id="journey-map"
        className="border-t border-white/10 bg-[#090909] px-5 py-24 md:px-8 md:py-32"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="relative flex min-h-[480px] items-center justify-center overflow-hidden border border-white/10 bg-[#111]">
            <img
              src="/hero-forest-chair.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />

            <div className="absolute inset-0 bg-black/70" />

            <p className="relative text-xs uppercase tracking-[0.3em] text-white/50">
              Loading your journey...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="journey-map"
        className="border-t border-white/10 bg-[#090909] px-5 py-24 md:px-8 md:py-32"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="flex min-h-[360px] items-center justify-center border border-red-300/15 bg-red-950/20 px-6 text-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-red-200/50">
                Journey unavailable
              </p>

              <p className="mt-5 text-base text-red-100/80">
                {error}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (sortedMilestones.length === 0) {
    return (
      <section
        id="journey-map"
        className="border-t border-white/10 bg-[#090909] px-5 py-24 md:px-8 md:py-32"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-10 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.34em] text-white/40">
              Your journey
            </p>

            <h2 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.94] tracking-[-0.045em] text-[#F4F0E8] md:text-7xl">
              Every archive begins with one moment.
            </h2>
          </div>

          <div className="relative min-h-[520px] overflow-hidden border border-white/10 bg-black">
            <img
              src="/hero-forest-chair.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />

            <div className="absolute inset-0 bg-black/65" />

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

            <div className="relative flex min-h-[520px] items-end px-8 py-10 md:px-14 md:py-14">
              <div className="max-w-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                  Chapter 001
                </p>

                <h3 className="mt-5 font-serif text-4xl leading-tight text-[#F4F0E8] md:text-5xl">
                  Your story has space to begin.
                </h3>

                <p className="mt-6 max-w-md text-base leading-7 text-white/60">
                  Add a milestone from your dashboard. Your first chapter will
                  appear here with its date, category and evidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="journey-map"
      className="border-t border-white/10 bg-[#090909] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.34em] text-white/40">
              Your journey
            </p>

            <h2 className="mt-6 font-serif text-5xl leading-[0.94] tracking-[-0.045em] text-[#F4F0E8] md:text-7xl">
              The moments that shaped you.
            </h2>
          </div>

          <div className="max-w-sm border-l border-white/15 pl-5">
            <p className="text-sm leading-6 text-white/45">
              Move through your timeline, rearrange each chapter and select a
              milestone to explore its story and evidence.
            </p>
          </div>
        </div>

        <div className="relative h-[640px] w-full overflow-hidden border border-white/10 bg-black">
          <img
            src="/hero-forest-chair.jpg"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
          />

          <div className="pointer-events-none absolute inset-0 bg-black/68" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-black/70" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

          <div className="relative h-full w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={handleNodesChange}
              fitView
              fitViewOptions={{
                padding: 0.12,
                minZoom: 0.62,
                maxZoom: 1,
              }}
              minZoom={0.35}
              maxZoom={1.5}
              nodesDraggable
              panOnDrag
              zoomOnScroll
              zoomOnPinch
              proOptions={{
                hideAttribution: true,
              }}
              onNodeClick={(_event, node) => {
                const milestone =
                  node.data.milestone as Milestone;

                onMilestoneSelect(milestone);
              }}
            >
              <Background
                gap={48}
                size={1}
                color="rgba(255,255,255,0.12)"
              />

              <Controls
                showInteractive={false}
                className="
                  !overflow-hidden
                  !rounded-full
                  !border
                  !border-white/15
                  !bg-black/65
                  !shadow-none
                  !backdrop-blur-xl
                "
              />
            </ReactFlow>
          </div>

          <div className="pointer-events-none absolute bottom-5 right-6 z-10 hidden items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-white/35 md:flex">
            <span className="h-px w-10 bg-white/25" />
            Drag · Zoom · Explore
          </div>
        </div>
      </div>
    </section>
  );
}