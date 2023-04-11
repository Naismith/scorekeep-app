import { createClient } from "@supabase/supabase-js";
import { Database } from "./models/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

declare global {
  interface Window {
    supabase: typeof supabase;
  }
}

window.supabase = supabase;
