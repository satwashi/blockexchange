"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
export default async function syncUser({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const { error, data } = await supabaseAdmin.from("users").upsert(
    { id, name },
    {
      onConflict: "id", // Ensure uniqueness on `id`
    }
  );

  if (error) {
    console.error("Error upserting user:", error.message);
    throw new Error("Error creating/updating user: " + error.message);
  }

  console.log(data);
}
