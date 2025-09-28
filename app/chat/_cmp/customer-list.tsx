"use client";
import { Search, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useState } from "react";
import { Customer } from "../page";

interface CustomerListProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
}

export default function CustomerList({
  customers,
  selectedCustomer,
  onSelectCustomer,
}: CustomerListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-sidebar-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Customer Chat</h1>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => onSelectCustomer(customer)}
            className={`p-4 hover:bg-message-hover cursor-pointer transition-colors border-b border-border ${
              selectedCustomer?.id === customer.id ? "bg-message-hover" : ""
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {customer.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-online rounded-full border-2 border-background"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm truncate">
                    {customer.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {customer.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {customer.lastMessage}
                </p>
              </div>

              {customer.unreadCount && (
                <Badge className="bg-primary text-primary-foreground h-5 min-w-5 rounded-full text-xs flex items-center justify-center px-1.5">
                  {customer.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
