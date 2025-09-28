"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CryptoSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSubmit: () => void;
}

export const CryptoSearch: React.FC<CryptoSearchProps> = ({
  searchTerm,
  setSearchTerm,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <Input
        placeholder="Enter crypto symbol"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-full sm:w-48"
      />
      <Button type="submit" variant="default">
        <Search className="w-4 h-4 mr-1" />
        Search
      </Button>
    </form>
  );
};
