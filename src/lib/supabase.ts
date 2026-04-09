import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Lazily-created Supabase client.
 * Throws at call time (not module load time) when env vars are missing,
 * so tests that mock this module are not affected.
 */
export function getSupabase(): SupabaseClient {
  if (_client) {
    return _client;
  }

  const supabaseUrl: unknown = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey: unknown = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (typeof supabaseUrl !== "string" || !supabaseUrl) {
    throw new Error(
      "Missing VITE_SUPABASE_URL. Copy .env.example to .env and fill in your credentials.",
    );
  }

  if (typeof supabaseAnonKey !== "string" || !supabaseAnonKey) {
    throw new Error(
      "Missing VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your credentials.",
    );
  }

  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}
