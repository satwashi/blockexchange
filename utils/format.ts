// utils/format.ts

// Format date as human-readable string
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "--";

  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(); // customize if needed
}

// Convert seconds to "X min Y sec"
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return seconds > 0 ? `${minutes} min ${seconds} sec` : `${minutes} min`;
  }
  return `${seconds} sec`;
}

export function formatTimeSeonds(seconds: number, post_fix: boolean = true) {
  if (seconds < 60) {
    return `${seconds}s`; // keep seconds if < 1 minute
  }

  const minutes = Math.floor(seconds / 60);
  return `${minutes}m`;
}
