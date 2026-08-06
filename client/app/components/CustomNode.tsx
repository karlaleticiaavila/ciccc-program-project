"use client";

import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";

import type { Milestone } from "../../lib/types/milestone";

const journeyImages = [
  "/hero-graffiti.jpg",
  "/hero-meadows.jpg",
  "/hero-forest-chair.jpg",
  "/hero-sheep.jpg",
  "/hero-sky.jpg",
];

type CustomNodeData = {
  milestone: Milestone;
  visualIndex?: number;
};

type CustomMilestoneNode = Node<
  CustomNodeData,
  "milestone"
>;

export default function CustomNode({
  data,
}: NodeProps<CustomMilestoneNode>) {
  const { milestone, visualIndex = 0 } = data;

  const milestoneDate = new Date(milestone.date);

  const formattedYear = Number.isNaN(
    milestoneDate.getTime()
  )
    ? ""
    : milestoneDate.getFullYear();

  const image =
    journeyImages[visualIndex % journeyImages.length];

  return (
    <article
      className="
        group
        relative
        w-[300px]
        cursor-pointer
        overflow-hidden
        border
        border-white/15
        bg-black
        text-white
        shadow-[0_24px_70px_rgba(0,0,0,0.38)]
        transition
        duration-500
        hover:-translate-y-2
        hover:border-white/35
        hover:shadow-[0_32px_90px_rgba(0,0,0,0.55)]
      "
    >
      <Handle
        type="target"
        position={Position.Left}
        className="
          !h-3
          !w-3
          !border-2
          !border-black
          !bg-[#F4F0E8]
          !shadow-[0_0_18px_rgba(244,240,232,0.55)]
        "
      />

      <div className="relative h-[180px] overflow-hidden">
        <img
          src={image}
          alt=""
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition
            duration-700
            group-hover:scale-110
          "
        />

        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {formattedYear && (
          <p className="absolute bottom-4 left-5 font-serif text-5xl leading-none tracking-[-0.05em] text-white">
            {formattedYear}
          </p>
        )}

        <p className="absolute right-4 top-4 text-[9px] uppercase tracking-[0.28em] text-white/60">
          Chapter {String(visualIndex + 1).padStart(2, "0")}
        </p>
      </div>

      <div className="px-6 py-6">
        <p className="truncate text-[10px] uppercase tracking-[0.28em] text-white/45">
          {milestone.category || "Milestone"}
        </p>

        <h3
          className="
            mt-4
            line-clamp-2
            min-h-[62px]
            font-serif
            text-[29px]
            leading-[1]
            tracking-[-0.03em]
            text-[#F4F0E8]
          "
        >
          {milestone.title}
        </h3>

        <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-[9px] uppercase tracking-[0.24em] text-white/35">
            Open archive
          </span>

          <span
            aria-hidden="true"
            className="text-xl text-white/60 transition duration-300 group-hover:translate-x-1 group-hover:text-white"
          >
            →
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="
          !h-3
          !w-3
          !border-2
          !border-black
          !bg-[#F4F0E8]
          !shadow-[0_0_18px_rgba(244,240,232,0.55)]
        "
      />
    </article>
  );
}