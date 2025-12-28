"use client";

import Link from "next/link";
import { Hexagon } from "lucide-react";
import { useEffect, useState } from "react";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Blockechange";

// Check if we are in Christmas week (Dec 24–31)
const isChristmasWeek = () => {
  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();
  return month === 11 && date >= 24 && date <= 31;
};

export default function Logo() {
  const showTreeWeek = isChristmasWeek();
  const [showChristmasTree, setShowChristmasTree] = useState(showTreeWeek);

  // Toggle between tree and hexagon every 3 seconds
  useEffect(() => {
    if (!showTreeWeek) return;

    const interval = setInterval(() => {
      setShowChristmasTree((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, [showTreeWeek]);

  // Inline SVG for mini tree background
  const miniTreeSVG = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><polygon points='5,0 0,10 10,10' fill='green'/><rect x='4' y='7' width='2' height='3' fill='#8B4513'/></svg>`
  );

  return (
    <Link
      href="/"
      aria-label="Go to home"
      className="flex items-center gap-2.5 group relative"
    >
      <div className="relative flex items-center">
        <div className="h-9 w-9 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          {/* Christmas Tree */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              showChristmasTree ? "opacity-100" : "opacity-0"
            } ${
              showChristmasTree
                ? `bg-[url('data:image/svg+xml,${miniTreeSVG}')] bg-repeat bg-center`
                : ""
            }`}
          >
            <svg
              viewBox="0 0 64 64"
              className="h-9 w-9"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Green tree layers */}
              <polygon points="32,4 8,36 56,36" fill="green" />
              <polygon points="32,12 12,40 52,40" fill="green" />
              {/* Brown trunk */}
              <rect x="28" y="36" width="8" height="12" fill="#8B4513" />
            </svg>
          </div>

          {/* Hexagon logo */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              showChristmasTree ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-shadow duration-300">
              <Hexagon className="h-5 w-5 text-background" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Logo text */}
        <div className="flex flex-col ml-2">
          <span className="text-lg font-bold tracking-tight text-foreground leading-none">
            {appName}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
            Trade Smart
          </span>
        </div>
      </div>
    </Link>
  );
}
