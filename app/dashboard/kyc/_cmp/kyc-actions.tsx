import { Kyc } from "@/types/kyc/kyc";
import { MessageCircle } from "lucide-react";
import ChangeKycStatus from "./change-Kyc-status";
import { ActionItem } from "../../_cmp/Generic-table";

// function update

export default function getKycActions(order: Kyc): ActionItem<Kyc>[] {
  return [
    {
      label: "Verify",
      render: (kyc: Kyc) => {
        return <ChangeKycStatus kyc={kyc} kyc_status="verified" />;
      },
    },
    {
      label: "Reject",
      render: (kyc: Kyc) => {
        return <ChangeKycStatus kyc={kyc} kyc_status="rejected" />;
      },
    },
    {
      label: "Message user",
      icon: <MessageCircle className="mr-2 h-4 w-4 text-muted-foreground" />,
      onClick: () => console.log(`Navigate to order ${order.id}`),
    },
  ];
}
