import { Database } from '@/database.types'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export function supabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken()
      },
    },
  )
}