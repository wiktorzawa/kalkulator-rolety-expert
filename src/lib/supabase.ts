import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

let _client: SupabaseClient | null = null;

/**
 * Lazily-created Supabase client.
 * Throws at call time (not module load time) when env vars are missing,
 * so tests that mock this module are not affected.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) {
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
          "Missing Supabase environment variables. Copy .env.example to .env and fill in your credentials.",
        );
      }
      _client = createClient(supabaseUrl, supabaseAnonKey);
    }
    const value = _client[prop as keyof SupabaseClient];
    if (typeof value === "function") {
      return value.bind(_client);
    }
    return value;
  },
});
