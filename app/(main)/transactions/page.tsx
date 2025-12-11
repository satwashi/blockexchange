import { Suspense } from "react";
import Main from "./_cmp/main";
import { Card } from "@/components/ui/card";

function TransactionsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="h-32 animate-pulse bg-muted/50 border-border/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsLoading />}>
      <Main />
    </Suspense>
  );
}
