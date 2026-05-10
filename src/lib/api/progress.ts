import { useAuth } from '@clerk/expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Database } from '../database.types';
import { useSupabase } from '../supabase';

type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];

export const progressKeys = {
  all: ['progress'] as const,
  course: (userId: string, courseId: string) => [...progressKeys.all, 'course', userId, courseId] as const,
  lesson: (userId: string, lessonId: string) => [...progressKeys.all, 'lesson', userId, lessonId] as const,
};

/**
 * Fetch all lesson progress for a specific course
 */
export function useCourseProgress(courseId: string) {
  const supabase = useSupabase();
  const { userId } = useAuth();

  return useQuery({
    queryKey: progressKeys.course(userId || '', courseId),
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) throw error;
      return data as LessonProgress[];
    },
    enabled: !!userId && !!courseId,
  });
}

/**
 * Update lesson progress (mark as complete or update position)
 */
export function useUpdateLessonProgress() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: async ({
      lessonId,
      courseId,
      completed,
      lastPositionSeconds,
    }: {
      lessonId: string;
      courseId: string;
      completed?: boolean;
      lastPositionSeconds?: number;
    }) => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          course_id: courseId,
          completed: completed ?? false,
          last_position_seconds: lastPositionSeconds ?? 0,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,lesson_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data as LessonProgress;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: progressKeys.lesson(userId || '', data.lesson_id) });
      queryClient.invalidateQueries({ queryKey: progressKeys.course(userId || '', data.course_id) });
    },
  });
}
