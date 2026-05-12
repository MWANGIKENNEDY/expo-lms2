import { useAuth } from '@clerk/expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Database } from '../database.types';
import { useSupabase } from '../supabase';

type Course = Database['public']['Tables']['courses']['Row'];

// Query Keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters?: string) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

/**
 * Fetch all courses (published + user's own drafts if authenticated)
 */
export function useCourses() {
  const supabase = useSupabase();

  return useQuery({
    queryKey: courseKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
  });
}

/**
 * Fetch a single course by ID (including chapters and lessons)
 */
export function useCourse(id: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, chapters(*, lessons(*))')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Sort chapters and lessons by order_index
      if (data.chapters) {
        data.chapters.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
        data.chapters.forEach((chapter: any) => {
          if (chapter.lessons) {
            chapter.lessons.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
          }
        });
      }
      
      return data;
    },
    enabled: !!id,
  });
}

/**
 * Delete a course (only works if user owns it due to RLS)
 */
export function useDeleteCourse() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { error, count } = await supabase
        .from('courses')
        .delete({ count: 'exact' })
        .eq('id', courseId);

      if (error) throw error;
      
      // Check if any rows were deleted (RLS might have blocked it)
      if (count === 0) {
        throw new Error('Cannot delete this course. You may not be the owner.');
      }

      return { courseId };
    },
    onSuccess: () => {
      // Invalidate and refetch courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

/**
 * Create a new course
 */
export function useCreateCourse() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: async (
      courseData: Omit<
        Database['public']['Tables']['courses']['Insert'],
        'id' | 'created_at' | 'updated_at' | 'instructor_id'
      >
    ) => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          instructor_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

/**
 * Update a course (only works if user owns it due to RLS)
 */
export function useUpdateCourse() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Database['public']['Tables']['courses']['Update'];
    }) => {
      const { data, error, count } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as Course;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.id) });
    },
  });
}
