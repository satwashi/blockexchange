import { MessageCircle } from "lucide-react";

import { ActionItem } from "../../_cmp/Generic-table";
import { Transaction } from "@/types/transactions";
import VerfiyTransaction from "./verfiy-transaction";

// function update

export default function getTransactionActions(
  order: Transaction
): ActionItem<Transaction>[] {
  return [
    {
      label: "Verify Transaction",
      render: (transaction: Transaction) => {
        return <VerfiyTransaction transaction_id={transaction.id} />;
      },
    },

    {
      label: "Message user",
      icon: <MessageCircle className="mr-2 h-4 w-4 text-muted-foreground" />,
      onClick: () => console.log(`Navigate to order ${order.id}`),
    },
  ];
}
