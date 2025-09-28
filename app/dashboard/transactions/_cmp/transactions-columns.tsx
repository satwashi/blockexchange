import { Transaction } from "@/types/transactions";
import { formatDate } from "@/utils/format";
import { ClipboardIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import DepositeScreenshot from "./deposite-screenshot";
const commonColums = [
  {
    key: "id",
    label: "ID",
    render: (tx: Transaction) => (
      <span className="text-gray-600">#{tx.id}</span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (tx: Transaction) => (
      <span className="font-medium">
        {tx.amount} {tx.wallet_type}
      </span>
    ),
  },

  {
    key: "status",
    label: "Status",
    render: (tx: Transaction) => (
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
    render: (tx: Transaction) => <span>{formatDate(tx.created_at)}</span>,
  },
  {
    key: "verified_at",
    label: "Verified At",
    render: (tx: Transaction) => (
      <span>{tx.verified_at ? formatDate(tx.verified_at) : "--"}</span>
    ),
  },
];

export const withdrawColumns = [
  {
    key: "address",
    label: "address",
    render: (tx: Transaction) => {
      // Shorten the address for display
      const shortAddress = `${tx.address.slice(0, 6)}...${tx.address.slice(
        -4
      )}`;
      const copyToClipboard = () => {
        navigator.clipboard.writeText(tx.address);
        toast.success("Address copied!"); // optional
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
    render: (tx: Transaction) => {
      return <DepositeScreenshot tx={tx} />;
    },
  },
  ...commonColums,
];
