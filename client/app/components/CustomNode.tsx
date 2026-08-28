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
  visualIndex?: number;
  evidenceImage?: string;
};

type CustomMilestoneNode = Node<
  CustomNodeData,
  "milestone"
>;

const categoryStyles: Record<
  string,
  {
    background: string;
    accent: string;
    label: string;
  }
> = {
  education: {
    background:
      "linear-gradient(135deg, #7aa8b7 0%, #2f7180 55%, #173f43 100%)",
    accent: "#f5efe3",
    label: "Education",
  },
  career: {
    background:
      "linear-gradient(135deg, #e88b72 0%, #bc6658 55%, #713f3a 100%)",
    accent: "#f5efe3",
    label: "Career",
  },
  creative: {
    background:
      "linear-gradient(135deg, #8b8984 0%, #5c6662 50%, #173f43 100%)",
    accent: "#f5efe3",
    label: "Creative",
  },
  personal: {
    background:
      "linear-gradient(135deg, #6f8b4b 0%, #4f6b36 55%, #173d2b 100%)",
    accent: "#f5efe3",
    label: "Personal",
  },
  travel: {
    background:
      "linear-gradient(135deg, #79a7b7 0%, #4a8793 50%, #164b53 100%)",
    accent: "#f5efe3",
    label: "Travel",
  },
  default: {
    background:
      "linear-gradient(135deg, #255f67 0%, #164b53 55%, #123b40 100%)",
    accent: "#f5efe3",
    label: "Milestone",
  },
};

function normalizeCategory(category?: string) {
  return category?.trim().toLowerCase() ?? "";
}

export default function CustomNode({
  data,
}: NodeProps<CustomMilestoneNode>) {
  const {
    milestone,
    visualIndex = 0,
    evidenceImage,
  } = data;

  const milestoneDate = new Date(milestone.date);

  const formattedYear = Number.isNaN(
    milestoneDate.getTime()
  )
    ? ""
    : milestoneDate.getFullYear();

  const normalizedCategory = normalizeCategory(
    milestone.category
  );

  const categoryStyle =
    categoryStyles[normalizedCategory] ??
    categoryStyles.default;

  const categoryLabel =
    milestone.category?.trim() ||
    categoryStyle.label;

  return (
    <article
      className="
        group
        relative
        w-[300px]
        cursor-pointer
        overflow-hidden
        border
        border-[#f5efe3]/15
        bg-[#123b40]
        text-[#f5efe3]
        shadow-[0_24px_65px_rgba(10,40,43,0.28)]
        transition-all
        duration-500
        ease-out
        hover:-translate-y-2
        hover:scale-[1.015]
        hover:border-[#f5efe3]/35
        hover:shadow-[0_36px_95px_rgba(10,40,43,0.45)]
      "
    >
      <Handle
        type="target"
        position={Position.Left}
        className="
          !h-3
          !w-3
          !border-2
          !border-[#174a50]
          !bg-[#f0a087]
          !shadow-[0_0_18px_rgba(240,160,135,0.55)]
        "
      />

      <div
        className="relative h-[170px] overflow-hidden"
        style={
          evidenceImage
            ? undefined
            : {
                background: categoryStyle.background,
              }
        }
      >
        {evidenceImage && (
          <img
            src={evidenceImage}
            alt=""
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              transition-all
              duration-700
              ease-out
              group-hover:scale-[1.08]
              group-hover:brightness-90
            "
          />
        )}

        {evidenceImage ? (
          <>
            <div className="absolute inset-0 bg-[#102f35]/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#102f35]/90 via-[#102f35]/15 to-black/10" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f35]/75 via-transparent to-white/5" />

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/15" />

            <div className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full border border-white/10" />
          </>
        )}

        <p className="absolute right-4 top-4 text-[9px] uppercase tracking-[0.28em] text-white/65">
          Chapter {String(visualIndex + 1).padStart(2, "0")}
        </p>

        {evidenceImage && (
          <p className="absolute left-5 top-4 text-[8px] uppercase tracking-[0.25em] text-white/55">
            Evidence
          </p>
        )}

        {formattedYear && (
          <p className="absolute bottom-4 left-5 font-serif text-5xl leading-none tracking-[-0.05em] text-white">
            {formattedYear}
          </p>
        )}
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <p className="truncate text-[10px] uppercase tracking-[0.28em] text-[#f0a087] transition-all duration-500 group-hover:tracking-[0.32em]">
            {categoryLabel}
          </p>

          {evidenceImage && (
            <span className="shrink-0 text-[8px] uppercase tracking-[0.2em] text-[#f5efe3]/35">
              Evidence attached
            </span>
          )}
        </div>

        <h3
          className="
            mt-4
            line-clamp-2
            min-h-[62px]
            font-serif
            text-[29px]
            leading-[1]
            tracking-[-0.03em]
            text-[#f5efe3]
            transition-all
            duration-500
            group-hover:translate-x-1
            group-hover:text-white
          "
        >
          {milestone.title}
        </h3>

        <div className="mt-7 flex items-center justify-between border-t border-[#f5efe3]/10 pt-4">
          <span className="text-[9px] uppercase tracking-[0.24em] text-[#f5efe3]/38 transition-all duration-300 group-hover:text-[#f5efe3]/65">
            Open chapter
          </span>

          <span
            aria-hidden="true"
            className="text-xl text-[#f5efe3]/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#f0a087]"
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
          !border-[#174a50]
          !bg-[#f0a087]
          !shadow-[0_0_18px_rgba(240,160,135,0.55)]
        "
      />
    </article>
  );
}