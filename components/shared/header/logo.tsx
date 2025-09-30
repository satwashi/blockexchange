import React from "react";
import Link from "next/link";

export default function Logo() {
  return (
    <>
      <div className="flex items-center space-x-8">
        <Link
          href="/"
          aria-label="Go to home"
          className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <div className="h-8 w-8 rounded bg-primary" />
          <span className="text-xl font-bold text-primary">Blockechange</span>
        </Link>
      </div>
    </>
  );
}
