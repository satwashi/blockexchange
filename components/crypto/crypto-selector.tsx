"use client";
import { Badge } from "@/components/ui/badge";

interface CryptoSelectorProps {
  cryptos: { symbol: string; name: string }[];
  currentSymbol: string;
  onSelect: (symbol: string) => void;
}

export const CryptoSelector: React.FC<CryptoSelectorProps> = ({
  cryptos,
  currentSymbol,
  onSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
      {cryptos.map((crypto) => (
        <Badge
          key={crypto.symbol}
          variant={currentSymbol === crypto.symbol ? "secondary" : "outline"}
          className="cursor-pointer"
          onClick={() => onSelect(crypto.symbol)}
        >
          {crypto.name}
        </Badge>
      ))}
    </div>
  );
};
