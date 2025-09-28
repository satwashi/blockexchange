"use client";
import GenericTable from "../_cmp/Generic-table";
import UsersSkeleton from "../users/_cmps/skeletons/users-skeleton";
import { orderColumns } from "./_cmp/order-columns";
import getOrderActions from "./_cmp/order-actions";
import { useOrders } from "@/queries/orders/user-all-orders";
export default function Page() {
  const { orders, isLoading, error } = useOrders();

  if (isLoading) return <UsersSkeleton />;
  if (error) return <div className="mt-[100px]">Error loading users</div>;
  return (
    <div className="w-full mt-[100px] px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
      </div>

      <div className="w-full overflow-x-auto">
        <GenericTable
          data={orders!}
          columns={orderColumns}
          actions={getOrderActions}
        />
      </div>
    </div>
  );
}
