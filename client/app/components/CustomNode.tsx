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
    <div className="min-w-[220px] rounded-2xl border border-black/20 bg-white/80 p-5 text-black backdrop-blur-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-black"
      />

      <p className="text-xs uppercase tracking-[0.25em] text-black/50">
        {milestone.category}
      </p>

      <h3 className="mt-3 font-serif text-xl leading-tight">
        {milestone.title}
      </h3>

      <p className="mt-4 text-xs text-black/50">
        {new Date(milestone.date).getFullYear()}
      </p>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-black"
      />
    </div>
  );
}