"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { symbolPairs } from "@/constants/symbol-pair";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SymbolSelectorProps {
  value: string;
  onChange?: (symbol: string) => void;
}

// Map symbol to icon path based on type and name from symbolPairs
const getIconPath = (symbol: string, name: string, type: string): string => {
  // Crypto icons - use name field (files are .svg)
  // e.g., "bitcoin" -> "/crypto-icons/bitcoin.svg"
  if (type === "Crypto") {
    return `/crypto-icons/${name.toLowerCase()}.svg`;
  }

  // Forex icons - use first 3 chars of symbol (uppercase currency code)
  // e.g., "EURUSD" -> "/forex-icons/EUR.png"
  if (type === "Forex") {
    const currencyCode = symbol.slice(0, 3).toUpperCase();
    return `/forex-icons/${currencyCode}.png`;
  }

  // Metals - use XAU/XAG (uppercase)
  if (type === "Metal") {
    const metalCode = symbol.slice(0, 3).toUpperCase(); // XAU or XAG
    return `/forex-icons/${metalCode}.png`;
  }

  // Oil/Energy - use name field (uppercase, .svg)
  if (type === "Oil") {
    return `/forex-icons/${name.toUpperCase()}.svg`;
  }

  // Index/CFD - use name field as-is (.svg)
  if (type === "Index/CFD") {
    return `/forex-icons/${name}.svg`;
  }

  return "";
};

// Get display symbol (e.g., "BTCUSD" -> "BTC")
const getDisplaySymbol = (symbol: string): string => {
  return symbol.replace(/USD$/, "");
};

// Get full pair display (e.g., "BTCUSD" -> "BTC/USD", "EURUSD" -> "EUR/USD")
const getFullPairDisplay = (symbol: string): string => {
  // Handle forex pairs (6 chars like EURUSD, GBPJPY)
  if (symbol.length === 6 && !symbol.endsWith("USD")) {
    return `${symbol.slice(0, 3)}/${symbol.slice(3)}`;
  }
  // Handle crypto and other USD pairs
  if (symbol.endsWith("USD")) {
    return `${symbol.replace(/USD$/, "")}/USD`;
  }
  // Return as-is for other symbols (indices, oil)
  return symbol;
};

// Get the quote currency icon path (the second part of the pair)
const getQuoteIconPath = (symbol: string, type: string): string | null => {
  if (type === "Crypto") {
    // Crypto pairs use Tether (USDT) icon
    return "/crypto-icons/tether.svg";
  }
  if (type === "Metal") {
    // Metals use USD
    return "/forex-icons/USD.png";
  }
  if (type === "Forex") {
    // Get second currency (e.g., EURUSD -> USD, GBPJPY -> JPY)
    const quote = symbol.slice(3, 6).toUpperCase();
    return `/forex-icons/${quote}.png`;
  }
  return null;
};

// Icon Pair Component - displays both base and quote icons
const IconPair = ({ 
  baseIcon, 
  quoteIcon, 
  size = "md" 
}: { 
  baseIcon: string; 
  quoteIcon: string | null; 
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = {
    sm: { base: "w-6 h-6", quote: "w-4 h-4", offset: "-right-1 -bottom-1" },
    md: { base: "w-8 h-8", quote: "w-5 h-5", offset: "-right-1.5 -bottom-1" },
    lg: { base: "w-10 h-10", quote: "w-6 h-6", offset: "-right-2 -bottom-1" },
  };
  const s = sizes[size];

  return (
    <div className="relative flex-shrink-0">
      <img
        src={baseIcon}
        alt="base"
        className={cn(s.base, "rounded-full object-contain bg-background ring-2 ring-background")}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=?&background=333&color=fff&size=32`;
        }}
      />
      {quoteIcon && (
        <img
          src={quoteIcon}
          alt="quote"
          className={cn(
            s.quote,
            s.offset,
            "absolute rounded-full object-contain bg-background ring-2 ring-background"
          )}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
    </div>
  );
};

// Group symbols by type
const groupedSymbols = symbolPairs.reduce((acc, pair) => {
  const type = pair.type;
  if (!acc[type]) acc[type] = [];
  acc[type].push(pair);
  return acc;
}, {} as Record<string, typeof symbolPairs>);

export function SymbolSelector({ value, onChange }: SymbolSelectorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedPair = symbolPairs.find((p) => p.symbol === value);

  // Filter symbols based on search
  const filteredGroups = useMemo(() => {
    if (!search) return groupedSymbols;

    const searchLower = search.toLowerCase();
    const filtered: Record<string, typeof symbolPairs> = {};

    Object.entries(groupedSymbols).forEach(([type, pairs]) => {
      const matchingPairs = pairs.filter(
        (p) =>
          p.symbol.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.name.toLowerCase().includes(searchLower)
      );
      if (matchingPairs.length > 0) {
        filtered[type] = matchingPairs;
      }
    });

    return filtered;
  }, [search]);

  const handleSelect = (symbol: string) => {
    onChange?.(symbol);
    // Update URL with new symbol
    router.push(`/trading/${symbol}`);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 bg-background/50 border-border/50 hover:bg-background/80"
        >
          <div className="flex items-center gap-3">
            {selectedPair && (
              <IconPair
                baseIcon={getIconPath(selectedPair.symbol, selectedPair.name, selectedPair.type)}
                quoteIcon={getQuoteIconPath(selectedPair.symbol, selectedPair.type)}
                size="sm"
              />
            )}
            <div className="flex flex-col items-start">
              <span className="font-semibold">
                {selectedPair ? getFullPairDisplay(selectedPair.symbol) : "Select symbol"}
              </span>
              {selectedPair && (
                <span className="text-xs text-muted-foreground">
                  {selectedPair.type}
                </span>
              )}
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Select Trading Symbol</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symbols..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Symbol List */}
        <ScrollArea className="h-[400px] px-2 pb-4">
          {Object.entries(filteredGroups).map(([type, pairs]) => (
            <div key={type} className="mb-4">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {type}
              </div>
              {pairs.map((pair) => {
                const iconPath = getIconPath(pair.symbol, pair.name, pair.type);
                const quoteIcon = getQuoteIconPath(pair.symbol, pair.type);
                return (
                <button
                  key={pair.symbol}
                  onClick={() => handleSelect(pair.symbol)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                    "hover:bg-accent hover:scale-[1.01]",
                    value === pair.symbol && "bg-accent ring-1 ring-primary/20"
                  )}
                >
                  <IconPair
                    baseIcon={iconPath}
                    quoteIcon={quoteIcon}
                    size="md"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{getFullPairDisplay(pair.symbol)}</div>
                    <div className="text-xs text-muted-foreground capitalize">{pair.name}</div>
                  </div>
                  {value === pair.symbol && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
                );
              })}
            </div>
          ))}

          {Object.keys(filteredGroups).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No symbols found
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

