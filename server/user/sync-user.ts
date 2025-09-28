import supabaseAdmin from "@/lib/supabaseAdmin";
export default async function syncUser({ id }: { id: string }) {
  const { error, data } = await supabaseAdmin.from("users").upsert(
    { id },
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
