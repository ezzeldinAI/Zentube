import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: number) {
  const seconds = Math.floor((duration % 60000) / 1000).toString().padStart(2, "0");
  const minutes = Math.floor((duration / 60000)).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function snakeCaseToTitle(str: string) {
  return str.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}
