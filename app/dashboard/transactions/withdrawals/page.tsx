"use client";
import GenericTable from "../../_cmp/Generic-table";
import UsersSkeleton from "../../users/_cmps/skeletons/users-skeleton";
import getTransactionActions from "../_cmp/transaction-actions";
import { useAllTransactions } from "@/queries/transactions/admin/use-all-transactions";
import { withdrawColumns } from "../_cmp/transactions-columns";

export default function Page() {
  const { withdrawals, isLoading, error } = useAllTransactions();
  if (isLoading) return <UsersSkeleton />;
  if (error) return <div className="mt-[100px]">Error loading users</div>;
  return (
    <div className="w-full mt-[100px] px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">Withdrawals</h1>
      </div>

      <div className="w-full overflow-x-auto">
        <GenericTable
          data={withdrawals!}
          columns={withdrawColumns}
          actions={getTransactionActions}
        />
      </div>
    </div>
  );
}
