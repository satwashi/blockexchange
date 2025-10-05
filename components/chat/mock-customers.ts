import { Customer } from "@/types/chat/customer";

export const mockCustomers: Customer[] = [
  {
    id: "1001",
    name: "Alice Johnson",
    lastMessage: "Thanks for the quick help!",
    timestamp: new Date().toISOString(),
    avatar: "",
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: "1002",
    name: "Bruce Wayne",
    lastMessage: "Payment failed, can you check?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    avatar: "",
    isOnline: false,
    unreadCount: 2,
  },
  {
    id: "1003",
    name: "Charlie P.",
    lastMessage: "All set now.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    avatar: "",
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: "1004",
    name: "Diana",
    lastMessage: "Can't login to my account.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    avatar: "",
    isOnline: false,
    unreadCount: 5,
  },
];

