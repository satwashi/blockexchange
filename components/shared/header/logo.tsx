import React from "react";

export default function Logo() {
  return (
    <>
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-primary" />

          <span className="text-xl font-bold text-primary">Blockechange</span>
        </div>
      </div>
    </>
  );
}
