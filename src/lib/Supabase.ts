import { createClient } from '@supabase/supabase-js'
import { Database } from '../../database.types';

// Create a single supabase client for interacting with your database
export function createSupabaseClient(){
    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    return supabase;
}