"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { LucideProps } from "lucide-react";

import Image from "next/image";

import { Badge } from "zentube/ui/badge";

type visibilityRecord = {
  type: string;
  label: string;
  icon: React.ReactElement<LucideProps>;
};

export type Video = {
  id: string;
  thumbnail: string;
  duration: string;
  title: string;
  description: string;
  visibility: visibilityRecord[];
  status: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
};

export const columns: ColumnDef<Video>[] = [
  {
    accessorKey: "title",
    header: "Video",
    cell: ({ row }) => {
      const video = row.original;
      return (
        <div className="flex items-center gap-4">
          <div className="relative w-[120px] h-[67px] shrink-0 overflow-hidden rounded-md">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
            />
            <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 text-xs text-white">
              {video.duration}
            </span>
          </div>
          <div className="flex flex-col justify-center h-full gap-1">
            <span className="font-semibold">{video.title}</span>
            <span className="text-sm text-muted-foreground">{video.description}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "visibility",
    header: () => <div className="text-center w-full">Visibility</div>,
    cell: ({ row }) => {
      const visibilities = row.getValue("visibility") as Video["visibility"];
      return (
        <div className="text-center w-full flex justify-center gap-2">
          {visibilities.map((v, i) => (
            <Badge key={i} variant="outline" className="flex items-center gap-1">
              {v.icon}
              {v.label}
            </Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "both")
        return true;
      const visArr = row.getValue(columnId) as { type: string }[];
      return Array.isArray(visArr) && visArr[0]?.type === filterValue;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center w-full">Status</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("status")}</div>,
  },
  {
    enableSorting: true,
    accessorKey: "date",
    header: () => <div className="text-center w-full">Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <div className="text-center w-full">{date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>;
    },
  },
  {
    accessorKey: "views",
    header: () => <div className="text-center w-full">Views</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("views")}</div>,
  },
  {
    accessorKey: "comments",
    header: () => <div className="text-center w-full">Comments</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("comments")}</div>,
  },
  {
    accessorKey: "likes",
    header: () => <div className="text-center w-full">Likes</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("likes")}</div>,
  },
];
