import { TransactionWithUser } from "@/types/transactions";
import { formatDate } from "@/utils/format";
import { ClipboardIcon, User } from "lucide-react";
import { toast } from "sonner";
import DepositeScreenshot from "./deposite-screenshot";

const userColumn = {
  key: "user",
  label: "User",
  render: (tx: TransactionWithUser) => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="w-4 h-4 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-sm">{tx.user?.name || "Unknown"}</span>
        <span className="text-xs text-muted-foreground font-mono">{tx.user_id?.slice(0, 8)}...</span>
      </div>
    </div>
  ),
};

const commonColums = [
  userColumn,
  {
    key: "id",
    label: "ID",
    render: (tx: TransactionWithUser) => (
      <span className="text-gray-600">#{tx.id}</span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (tx: TransactionWithUser) => (
      <span className="font-medium">
        {tx.amount} {tx.wallet_type}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (tx: TransactionWithUser) => (
      <span
        className={`capitalize font-medium ${
          tx.status === "pending"
            ? "text-yellow-600"
            : tx.status === "verified"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {tx.status}
      </span>
    ),
  },
  {
    key: "created_at",
    label: "Created At",
    render: (tx: TransactionWithUser) => <span>{formatDate(tx.created_at)}</span>,
  },
  {
    key: "verified_at",
    label: "Verified At",
    render: (tx: TransactionWithUser) => (
      <span>{tx.verified_at ? formatDate(tx.verified_at) : "--"}</span>
    ),
  },
];

export const withdrawColumns = [
  {
    key: "address",
    label: "Address",
    render: (tx: TransactionWithUser) => {
      if (!tx.address) return "--";
      // Shorten the address for display
      const shortAddress = `${tx.address.slice(0, 6)}...${tx.address.slice(-4)}`;
      const copyToClipboard = () => {
        navigator.clipboard.writeText(tx.address!);
        toast.success("Address copied!");
      };

      return (
        <span
          className="font-medium cursor-pointer hover:underline flex items-center gap-1"
          onClick={copyToClipboard}
        >
          {shortAddress}
          <ClipboardIcon className="w-4 h-4 text-gray-400" />
        </span>
      );
    },
  },
  ...commonColums,
];

export const depositColumns = [
  {
    key: "image",
    label: "Image",
    render: (tx: TransactionWithUser) => {
      return <DepositeScreenshot tx={tx} />;
    },
  },
  ...commonColums,
];
