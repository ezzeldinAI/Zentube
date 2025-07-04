"use client";

import MuxPlayer from "@mux/mux-player-react";

type VideoPlayer = {
  playbackId?: string | null | undefined;
  thumbnailUrl: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
};

export function VideoPlayer({ playbackId, thumbnailUrl, autoPlay = false, onPlay }: VideoPlayer) {
  // if(!playbackId) return null;

  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl || "/placeholder.svg"}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className="w-full h-full object-contain"
      accentColor="#184EC0"
      onPlay={onPlay}
    />
  );
}
