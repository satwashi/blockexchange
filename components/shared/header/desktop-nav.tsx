import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function DesktopNav() {
  return (
    <nav className="hidden md:flex space-x-6">
      <Button variant="ghost" className="text-sm font-medium">
        <Link href={"/market"}>Markets</Link>
      </Button>
      <Button variant="ghost" className="text-sm font-medium">
        <Link href={"/trading"}>Trade</Link>
      </Button>
      <Button variant="ghost" className="text-sm font-medium">
        <Link href={"/orders"}>Orders</Link>
      </Button>

      <Button variant="ghost" className="text-sm font-medium">
        <Link href={"/wallet"}>Wallet</Link>
      </Button>
    </nav>
  );
}
