import { useAuth } from '@clerk/expo';
import { createClient } from '@supabase/supabase-js';
// import type { Database } from './database.types';
import { useMemo } from 'react';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Returns a Supabase client that automatically attaches the
 * current Clerk session token to every request.
 *
 * Usage:
 *   const supabase = useSupabase();
 *   const { data } = await supabase.from('courses').select();
 */
export function useSupabase() {
  const { getToken } = useAuth();

  return useMemo(
    () =>
      createClient(supabaseUrl, supabaseAnonKey, {
        async accessToken() {
          return (await getToken()) ?? null;
        },
      }),
    [getToken],
  );
}