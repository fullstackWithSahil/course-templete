import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";

export default function supabaseClient(supabaseToken:any){
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global:{headers:{Authorization:`Bearer ${supabaseToken}`},}
    }
  );
  return supabase;
}