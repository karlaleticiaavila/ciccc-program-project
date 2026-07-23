"use client";

import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";

import type { Milestone } from "../../lib/types/milestone";

type CustomNodeData = {
  milestone: Milestone;
};

type CustomMilestoneNode = Node<
  CustomNodeData,
  "milestone"
>;

export default function CustomNode({
  data,
}: NodeProps<CustomMilestoneNode>) {
  const milestone = data.milestone;

  return (
    <div className="min-w-[300px] max-w-[320px] rounded-[24px] border border-black/15 bg-white/90 p-7 text-black shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-black"
      />

      <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">
        {milestone.category}
      </p>

      <h3 className="mt-4 font-serif text-2xl leading-tight">
        {milestone.title}
      </h3>

      <p className="mt-6 text-sm text-black/45">
        {new Date(milestone.date).getFullYear()}
      </p>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-black"
      />
    </div>
  );
}