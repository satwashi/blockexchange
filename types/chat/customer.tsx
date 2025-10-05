export type Customer = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isOnline: boolean;
  unreadCount?: number;
};
