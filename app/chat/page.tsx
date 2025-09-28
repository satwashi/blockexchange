"use client";
import { useState } from "react";
import CustomerList from "./_cmp/customer-list";
import AdminChatPage from "@/components/chat/admin-chat";

export interface Customer {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isOnline: boolean;
  unreadCount?: number;
}

const mockCustomers: Customer[] = [
  {
    unreadCount: 2,
    timestamp: "2 min ago",
    lastMessage: "Thank you for your help with the order!",
    name: "Yonas",
    isOnline: true,
    avatar: "https://forkast.news/wp-content/uploads/2022/03/NFT-Avatar.png",
    id: "uFzack9B31ouVkHn4Rh7VFG7IdtWKCaG",
  },

  {
    unreadCount: 2,
    timestamp: "2 min ago",
    lastMessage: "Thank you for your help with the order!",
    name: "Yonas",
    isOnline: true,
    avatar: "https://forkast.news/wp-content/uploads/2022/03/NFT-Avatar.png",
    id: "uFzack9B31ouVkHn4Rh7VFG7IdtWKCaG",
  },

  {
    unreadCount: 2,
    timestamp: "2 min ago",
    lastMessage: "Thank you for your help with the order!",
    name: "Yonas1",
    isOnline: true,
    avatar: "https://forkast.news/wp-content/uploads/2022/03/NFT-Avatar.png",
    id: "uFzack9B31ouVkHn4Rh7VFG7IdtWKCaG",
  },

  {
    unreadCount: 2,
    timestamp: "2 min ago",
    lastMessage: "Thank you for your help with the order!",
    name: "Yonas2",
    isOnline: true,
    avatar: "https://forkast.news/wp-content/uploads/2022/03/NFT-Avatar.png",
    id: "uFzack9B31ouVkHn4Rh7VFG7IdtWKCaG",
  },

  {
    unreadCount: 2,
    timestamp: "2 min ago",
    lastMessage: "Thank you for your help with the order!",
    name: "Yonas",
    isOnline: true,
    avatar: "https://forkast.news/wp-content/uploads/2022/03/NFT-Avatar.png",
    id: "uFzack9B31ouVkHn4Rh7VFG7IdtWKCaG",
  },

  {
    unreadCount: 2,
    timestamp: "2 min ago",
    lastMessage: "Thank you for your help with the order!",
    name: "Yonas3",
    isOnline: true,
    avatar: "https://forkast.news/wp-content/uploads/2022/03/NFT-Avatar.png",
    id: "uFzack9B31ouVkHn4Rh7VFG7IdtWKCaG",
  },
];

export default function ChatLayout() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    mockCustomers[0]
  );
  const [showCustomerList, setShowCustomerList] = useState(true);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    // Hide customer list on mobile when a customer is selected
    setShowCustomerList(false);
  };

  // const handleBackToList = () => {
  //   setShowCustomerList(true);
  // };

  return (
    <div className="flex h-screen bg-background">
      {/* Customer List - Hidden on mobile when chat is open */}
      <div
        className={`${
          showCustomerList ? "block" : "hidden"
        } md:block w-full md:w-80 lg:w-96`}
      >
        <CustomerList
          customers={mockCustomers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={handleSelectCustomer}
        />
      </div>

      {/* Chat Area - Hidden on mobile when customer list is open */}
      <div
        className={`${!showCustomerList ? "block" : "hidden"} md:block flex-1`}
      >
        <AdminChatPage customer={selectedCustomer!} />
      </div>
    </div>
  );
}
