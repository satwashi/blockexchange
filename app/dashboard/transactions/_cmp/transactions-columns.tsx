import { TransactionWithUser } from "@/types/transactions";
import { formatDate } from "@/utils/format";
import {
  ClipboardIcon,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { toast } from "sonner";
import DepositeScreenshot from "./deposite-screenshot";
import { cn } from "@/lib/utils";

// Fast O(1) lookup Map for crypto icons
const CRYPTO_ICON_MAP = new Map<string, string>([
  // Bitcoin
  ["BTC", "/crypto-icons/bitcoin.svg"],
  ["BITCOIN", "/crypto-icons/bitcoin.svg"],
  // Ethereum
  ["ETH", "/crypto-icons/ethereum.svg"],
  ["ETHEREUM", "/crypto-icons/ethereum.svg"],
  // BNB
  ["BNB", "/crypto-icons/bnb.svg"],
  // Solana
  ["SOL", "/crypto-icons/solana.svg"],
  ["SOLANA", "/crypto-icons/solana.svg"],
  // XRP
  ["XRP", "/crypto-icons/xrp.svg"],
  ["RIPPLE", "/crypto-icons/xrp.svg"],
  // Cardano
  ["ADA", "/crypto-icons/cardano.svg"],
  ["CARDANO", "/crypto-icons/cardano.svg"],
  // Dogecoin
  ["DOGE", "/crypto-icons/dogecoin.svg"],
  ["DOGECOIN", "/crypto-icons/dogecoin.svg"],
  // Polkadot
  ["DOT", "/crypto-icons/polkadot.svg"],
  ["POLKADOT", "/crypto-icons/polkadot.svg"],
  // Litecoin
  ["LTC", "/crypto-icons/litecoin.svg"],
  ["LITECOIN", "/crypto-icons/litecoin.svg"],
  // Avalanche
  ["AVAX", "/crypto-icons/avalanche.svg"],
  ["AVALANCHE", "/crypto-icons/avalanche.svg"],
  // Tron
  ["TRX", "/crypto-icons/tron.svg"],
  ["TRON", "/crypto-icons/tron.svg"],
  // Tether
  ["USDT", "/crypto-icons/tether.svg"],
  ["TETHER", "/crypto-icons/tether.svg"],
  // BCH
  ["BCH", "/crypto-icons/bch.svg"],
  // EOS
  ["EOS", "/crypto-icons/eos.svg"],
  // Stellar
  ["XLM", "/crypto-icons/stellar.svg"],
  ["STELLAR", "/crypto-icons/stellar.svg"],
  // Dash
  ["DASH", "/crypto-icons/dash.svg"],
  // Zcash
  ["ZEC", "/crypto-icons/zcash.svg"],
  ["ZCASH", "/crypto-icons/zcash.svg"],
  // NEO
  ["NEO", "/crypto-icons/neo.svg"],
  // IOTA
  ["IOTA", "/crypto-icons/iota.svg"],
  // OMG
  ["OMG", "/crypto-icons/omg.svg"],
  // QTUM
  ["QTUM", "/crypto-icons/qtum.svg"],
]);

// Fast icon lookup
const getWalletIcon = (walletType: string): string | null => {
  if (!walletType) return null;
  return CRYPTO_ICON_MAP.get(walletType.toUpperCase()) || null;
};

// Wallet icon component
const WalletIcon = ({
  walletType,
  isDeposit,
}: {
  walletType: string;
  isDeposit: boolean;
}) => {
  const iconPath = getWalletIcon(walletType);

  if (iconPath) {
    return (
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          isDeposit ? "bg-emerald-500/15" : "bg-amber-500/15"
        )}
      >
        <img
          src={iconPath}
          alt={walletType}
          className="w-5 h-5"
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback icon
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center",
        isDeposit ? "bg-emerald-500/15" : "bg-amber-500/15"
      )}
    >
      {isDeposit ? (
        <ArrowDownToLine className="w-4 h-4 text-emerald-500" />
      ) : (
        <ArrowUpFromLine className="w-4 h-4 text-amber-500" />
      )}
    </div>
  );
};

const userColumn = {
  key: "user",
  label: "User",
  render: (tx: TransactionWithUser) => (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <User className="w-4 h-4 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-sm text-foreground">
          {tx.user?.name || "Unknown"}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {tx.user_id?.slice(0, 8)}...
        </span>
      </div>
    </div>
  ),
};

const commonColumns = [
  userColumn,
  {
    key: "id",
    label: "ID",
    render: (tx: TransactionWithUser) => (
      <span className="text-xs text-muted-foreground font-mono">
        #{tx.id.slice(0, 8)}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (tx: TransactionWithUser) => (
      <div className="flex items-center gap-2.5">
        <WalletIcon
          walletType={tx.wallet_type || ""}
          isDeposit={tx.transaction_type === "deposit"}
        />
        <div>
          <span className="font-semibold text-foreground">
            {tx.amount?.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground ml-1.5">
            {tx.wallet_type}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (tx: TransactionWithUser) => {
      const statusConfig = {
        pending: {
          class: "bg-amber-500/15 text-amber-500",
          dotClass: "bg-amber-500 animate-pulse",
        },
        verified: {
          class: "bg-emerald-500/15 text-emerald-500",
          dotClass: "bg-emerald-500",
        },
        failed: {
          class: "bg-red-500/15 text-red-500",
          dotClass: "bg-red-500",
        },
      };

      const config = statusConfig[tx.status] || statusConfig.pending;

      return (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize",
            config.class
          )}
        >
          <span
            className={cn("w-1.5 h-1.5 rounded-full mr-1.5", config.dotClass)}
          />
          {tx.status}
        </span>
      );
    },
  },
  {
    key: "created_at",
    label: "Created",
    render: (tx: TransactionWithUser) => (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>{formatDate(tx.created_at)}</span>
      </div>
    ),
  },
  {
    key: "verified_at",
    label: "Verified",
    render: (tx: TransactionWithUser) => (
      <span className="text-sm text-muted-foreground">
        {tx.verified_at ? formatDate(tx.verified_at) : "--"}
      </span>
    ),
  },
];

export const withdrawColumns = [
  {
    key: "address",
    label: "Address",
    render: (tx: TransactionWithUser) => {
      if (!tx.address) return <span className="text-muted-foreground">--</span>;

      const shortAddress = `${tx.address.slice(0, 6)}...${tx.address.slice(-4)}`;
      const copyToClipboard = () => {
        navigator.clipboard.writeText(tx.address!);
        toast.success("Address copied to clipboard!");
      };

      return (
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 hover:bg-muted text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          {shortAddress}
          <ClipboardIcon className="w-3.5 h-3.5" />
        </button>
      );
    },
  },
  ...commonColumns,
];

export const depositColumns = [
  {
    key: "image",
    label: "Screenshot",
    render: (tx: TransactionWithUser) => {
      return <DepositeScreenshot tx={tx} />;
    },
  },
  ...commonColumns,
];
