"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrdersList from "./orders-list";

import useMyOrders from "@/queries/orders/use-my-orders";
import OrdersSkeleton from "./skeletons/orders-skeleton";

export default function Main({ user_id }: { user_id: string }) {
  const { orders, isLoading, openOrders, closedOrders } = useMyOrders(user_id);

  return (
    <div className="mx-6 mt-6">
      <Tabs className="" defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 mb-6 p-2 h-16 bg-muted py-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? <OrdersSkeleton /> : <OrdersList orders={orders} />}
        </TabsContent>

        <TabsContent value="open">
          {isLoading ? <OrdersSkeleton /> : <OrdersList orders={openOrders} />}
        </TabsContent>

        <TabsContent value="closed">
          {isLoading ? (
            <OrdersSkeleton />
          ) : (
            <OrdersList orders={closedOrders} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
