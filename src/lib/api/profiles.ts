import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../supabase';
import { useAuth } from '@clerk/expo';

export const profileKeys = {
  all: ['profiles'] as const,
  detail: (userId: string) => [...profileKeys.all, userId] as const,
};

export function useProfile(options: { enabled?: boolean } = {}) {
  const supabase = useSupabase();
  const { userId, isLoaded } = useAuth();

  return useQuery({
    queryKey: profileKeys.detail(userId || ''),
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: (options.enabled !== undefined ? options.enabled : isLoaded) && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
