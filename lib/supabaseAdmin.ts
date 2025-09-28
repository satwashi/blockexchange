import { createClient } from "@supabase/supabase-js";

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});

export default supabaseAdmin;
