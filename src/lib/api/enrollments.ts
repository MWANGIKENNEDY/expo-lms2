import { useAuth } from '@clerk/expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Database } from '../database.types';
import { useSupabase } from '../supabase';

type Enrollment = Database['public']['Tables']['enrollments']['Row'];

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  lists: () => [...enrollmentKeys.all, 'list'] as const,
  userEnrollments: (userId: string) => [...enrollmentKeys.lists(), userId] as const,
  status: (userId: string, courseId: string) => [...enrollmentKeys.all, 'status', userId, courseId] as const,
};

/**
 * Fetch all enrollments for a specific user
 */
export function useUserEnrollments() {
  const supabase = useSupabase();
  const { userId } = useAuth();

  return useQuery({
    queryKey: enrollmentKeys.userEnrollments(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

/**
 * Check if the user is enrolled in a specific course
 */
export function useCourseEnrollmentStatus(courseId: string) {
  const supabase = useSupabase();
  const { userId } = useAuth();

  return useQuery({
    queryKey: enrollmentKeys.status(userId || '', courseId),
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;
      return data as Enrollment | null;
    },
    enabled: !!userId && !!courseId,
  });
}

/**
 * Enroll the current user in a course
 */
export function useEnrollInCourse() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          status: 'enrolled',
          progress: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Enrollment;
    },
    onSuccess: (_, courseId) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: enrollmentKeys.status(userId, courseId) });
        queryClient.invalidateQueries({ queryKey: enrollmentKeys.userEnrollments(userId) });
      }
    },
  });
}
