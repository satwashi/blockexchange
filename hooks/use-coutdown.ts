import { formatDuration } from "@/utils/format";
import { useEffect, useState } from "react";

export default function useCountdown(targetDate: Date) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(
        Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Return both seconds and formatted string
  return {
    seconds: remainingSeconds,
    formatted: formatDuration(remainingSeconds),
  };
}
