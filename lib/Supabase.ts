import { createClient } from '@supabase/supabase-js'
import { Database } from "../database.types";

export default function supabaseClient(session:any){// eslint-disable-line @typescript-eslint/no-explicit-any
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: () => {
        return session?.getToken();
      },
    }
  )
}