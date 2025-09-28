import { getServerSession } from "@/server/user/users";
import Main from "./_cmp/main";

export default async function OrdersTabs() {
  const { id: user_id } = await getServerSession();
  return <Main user_id={user_id} />;
}
