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

type Evidence = {
  _id: string;
  title: string;
  type:
    | "image"
    | "certificate"
    | "link"
    | "github"
    | "video"
    | "document";
  url: string;
  description?: string;
  milestoneId: string;
};

export default function JourneyMap({
  milestones,
  isLoading,
  error,
  onMilestoneSelect,
}: JourneyMapProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [evidenceImages, setEvidenceImages] =
    useState<Record<string, string>>({});

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

  /*
   * Fetch the first image evidence for every milestone.
   */
  useEffect(() => {
    if (sortedMilestones.length === 0) {
      setEvidenceImages({});
      return;
    }

    let isCancelled = false;

    const fetchEvidenceImages = async () => {
      try {
        const results = await Promise.all(
          sortedMilestones.map(async (milestone) => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/evidence/milestone/${milestone._id}`
              );

              if (!response.ok) {
                return {
                  milestoneId: milestone._id,
                  imageUrl: "",
                };
              }

              const evidence: Evidence[] =
                await response.json();

              const firstImage = evidence.find(
                (item) => item.type === "image"
              );

              return {
                milestoneId: milestone._id,
                imageUrl: firstImage?.url ?? "",
              };
            } catch {
              return {
                milestoneId: milestone._id,
                imageUrl: "",
              };
            }
          })
        );

        if (isCancelled) {
          return;
        }

        const imageMap: Record<string, string> = {};

        results.forEach((result) => {
          if (result.imageUrl) {
            imageMap[result.milestoneId] =
              result.imageUrl;
          }
        });

        setEvidenceImages(imageMap);
      } catch (error) {
        console.error(
          "Could not load evidence images:",
          error
        );
      }
    };

    void fetchEvidenceImages();

    return () => {
      isCancelled = true;
    };
  }, [sortedMilestones]);

  /*
   * Build React Flow nodes + edges.
   */
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
              y: index % 2 === 0 ? 75 : 290,
            },

          data: {
            milestone,
            visualIndex: index,
            evidenceImage:
              evidenceImages[milestone._id] || undefined,
          },
        };
      })
    );

    const timelineEdges: Edge[] = sortedMilestones
      .slice(1)
      .map((milestone, index) => {
        const previousMilestone =
          sortedMilestones[index];

        return {
          id: `edge-${previousMilestone._id}-${milestone._id}`,
          source: previousMilestone._id,
          target: milestone._id,
          animated: true,

          style: {
            stroke: "rgba(240, 160, 135, 0.82)",
            strokeWidth: 1.7,
          },
        };
      });

    setEdges(timelineEdges);
  }, [sortedMilestones, evidenceImages]);

  if (isLoading) {
    return (
      <section
        id="journey-map"
        className="relative scroll-mt-24 overflow-hidden bg-[#123b40] px-5 py-24 text-[#f5efe3] md:scroll-mt-28 md:px-8 md:py-32"
      >
        <JourneyGlow />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="flex min-h-[420px] items-center justify-center border border-[#f5efe3]/15 bg-[#174a50]">
            <div className="text-center">
              <span className="mx-auto block h-2 w-2 animate-pulse rounded-full bg-[#f0a087]" />

              <p className="mt-5 text-[10px] uppercase tracking-[0.32em] text-[#f5efe3]/55">
                Loading your journey
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="journey-map"
        className="relative overflow-hidden bg-[#123b40] px-5 py-24 text-[#f5efe3] md:px-8 md:py-32"
      >
        <JourneyGlow />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="flex min-h-[340px] items-center justify-center border border-[#f0a087]/30 bg-[#713f3a]/25 px-6 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#f0a087]">
                Journey unavailable
              </p>

              <p className="mt-5 max-w-lg text-base leading-7 text-[#f5efe3]/75">
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
        className="relative overflow-hidden bg-[#123b40] px-5 py-24 text-[#f5efe3] md:px-8 md:py-32"
      >
        <JourneyGlow />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="mb-10 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.34em] text-[#f0a087]">
              Your journey
            </p>

            <h2 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.94] tracking-[-0.045em] md:text-7xl">
              Every archive begins with one moment.
            </h2>
          </div>

          <div className="relative min-h-[520px] overflow-hidden border border-[#f5efe3]/15">
            <img
              src="/hero-forest-chair.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#123b40]/30" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#102f35]/90 via-[#123b40]/55 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#102f35]/70 via-transparent to-transparent" />

            <div className="relative flex min-h-[520px] items-end px-8 py-10 md:px-14 md:py-14">
              <div className="max-w-xl">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#f0a087]">
                  Your first chapter
                </p>

                <h3 className="mt-5 font-serif text-4xl leading-[0.98] tracking-[-0.04em] md:text-6xl">
                  Make space for who you are becoming.
                </h3>

                <p className="mt-6 max-w-md text-base leading-7 text-[#f5efe3]/68">
                  Add your first milestone from the dashboard.
                  Its story, evidence and date will begin your
                  personal timeline.
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
      className="relative overflow-hidden bg-[#123b40] px-5 py-24 text-[#f5efe3] md:px-8 md:py-32"
    >
      <JourneyGlow />

      <div className="relative mx-auto max-w-[1500px]">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.34em] text-[#f0a087]">
              Your journey
            </p>

            <h2 className="mt-6 font-serif text-5xl leading-[0.94] tracking-[-0.045em] md:text-7xl">
              The moments that shaped you.
            </h2>
          </div>

          <div className="max-w-sm border-l border-[#f5efe3]/20 pl-5">
            <p className="text-sm leading-6 text-[#f5efe3]/55">
              Move through your timeline, rearrange each chapter
              and open a milestone to explore its story and
              evidence.
            </p>
          </div>
        </div>

        <div className="relative h-[560px] w-full overflow-hidden border border-[#f5efe3]/15 bg-[#174a50] md:h-[640px]">
          <div className="pointer-events-none absolute -left-28 -top-28 h-[360px] w-[360px] rounded-full bg-[#79a7b7]/20 blur-[110px]" />

          <div className="pointer-events-none absolute -bottom-32 right-[10%] h-[380px] w-[380px] rounded-full bg-[#e88b72]/15 blur-[120px]" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#255f67]/30 via-transparent to-[#102f35]/55" />

          <div className="relative h-full w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={handleNodesChange}
              fitView
              fitViewOptions={{
                padding: 0.13,
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
                gap={52}
                size={1}
                color="rgba(245, 239, 227, 0.13)"
              />

              <Controls
                showInteractive={false}
                className="
                  !overflow-hidden
                  !rounded-full
                  !border
                  !border-[#f5efe3]/20
                  !bg-[#123b40]/90
                  !shadow-[0_12px_40px_rgba(10,35,38,0.25)]
                  !backdrop-blur-xl
                "
              />
            </ReactFlow>
          </div>

          <div className="pointer-events-none absolute bottom-5 right-6 z-10 hidden items-center gap-3 text-[9px] uppercase tracking-[0.26em] text-[#f5efe3]/40 md:flex">
            <span className="h-px w-10 bg-[#f0a087]/65" />
            Drag · Zoom · Explore
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneyGlow() {
  return (
    <>
      <div className="pointer-events-none absolute -left-40 top-16 h-[420px] w-[420px] rounded-full bg-[#79a7b7]/14 blur-[135px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[440px] w-[440px] rounded-full bg-[#e88b72]/12 blur-[140px]" />
    </>
  );
}