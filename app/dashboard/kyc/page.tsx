"use client";

import GenericTable from "../_cmp/Generic-table";
import UsersSkeleton from "../users/_cmps/skeletons/users-skeleton";
import getKycActions from "./_cmp/kyc-actions";
import { kycColumns } from "./_cmp/kyc-columns";
import { useKycs } from "@/queries/kyc/use-kycs";

export default function Page() {
  const { kycs, isLoading, error } = useKycs();
  if (isLoading) return <UsersSkeleton />;
  if (error)
    return <div className="mt-[100px]">Error loading KYC Submission</div>;
  return (
    <div className="w-full mt-[100px] px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">KYC Submissions</h1>
      </div>

      <div className="w-full overflow-x-auto">
        <GenericTable
          data={kycs!}
          columns={kycColumns}
          actions={getKycActions}
        />
      </div>
    </div>
  );
}
