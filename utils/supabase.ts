import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const useSupabaseClient = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const config = useRuntimeConfig();

  supabaseClient = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );

  return supabaseClient;
};
