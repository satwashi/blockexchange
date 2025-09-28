import { Transaction } from "@/types/transactions";
import { useState } from "react";
import Image from "next/image";

export default function DepositeScreenshot({ tx }: { tx: Transaction }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      {tx.image ? (
        <div className="w-16 h-16 relative cursor-pointer rounded-md overflow-hidden hover:shadow-lg transition">
          <Image
            src={tx.image}
            alt="Deposit"
            fill
            className="object-cover"
            onClick={() => setIsOpen(true)}
          />
        </div>
      ) : (
        <span className="text-gray-400">--</span>
      )}

      {/* Modal / Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full max-w-lg h-[90vh]">
            {/* Use layout="fill" with absolute positioning */}
            <Image
              src={tx.image}
              alt="Deposit"
              fill
              className="object-contain rounded-md shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
