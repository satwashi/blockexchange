// "use server";

// import supabaseAdmin from "@/lib/supabaseAdmin";
// import { Chat } from "@/queries/chat/use-chats";
// import { getServerSession } from "../user/users";

// const fetchChats = async (): Promise<Chat[]> => {
//   const { isAdmin } = await getServerSession();
//   if (!isAdmin) throw new Error("Unauthorized");

//   const { data, error } = await supabaseAdmin.rpc("chat_rooms_summary");

//   // const { data, error } = await supabaseAdmin
//   //   .from("chats_with_latest_message")
//   //   .select("*")
//   //   .order("last_message_time", { ascending: false });

//   if (error) throw new Error(error.message);

//   console.log(data);

//   return data.map((chat) => ({
//     id: chat.id,
//     customer_name: chat.customer_name || "Anonymose",
//     last_message: chat.last_message || "No messages yet",
//     last_message_time: chat.last_message_time,
//     unread_count: chat.unread_count,
//   }));
// };

// export default fetchChats;

"use server";

import supabaseAdmin from "@/lib/supabaseAdmin";
import { Chat } from "@/queries/chat/use-chats";
import { getServerSession } from "../user/users";

const fetchChats = async (): Promise<Chat[]> => {
  const { isAdmin } = await getServerSession();
  if (!isAdmin) throw new Error("Unauthorized");

  // Query the view instead of RPC
  const { data, error } = await supabaseAdmin
    .from("chat_rooms_summary") // <-- your view name
    .select("*")
    .order("last_message_time", { ascending: false });

  if (error) throw new Error(error.message);

  console.log(data);

  return data.map((chat) => ({
    id: chat.id,
    customer_name: chat.customer_name || "Anonymose",
    last_message: chat.last_message || "No messages yet",
    last_message_time: chat.last_message_time,
    unread_count: chat.unread_count,
  }));
};

export default fetchChats;
