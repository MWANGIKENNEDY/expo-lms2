import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Database } from '../database.types';
import { useSupabase } from '../supabase';
import { courseKeys } from './courses';

type Chapter = Database['public']['Tables']['chapters']['Row'];
type ChapterInsert = Database['public']['Tables']['chapters']['Insert'];
type ChapterUpdate = Database['public']['Tables']['chapters']['Update'];

type Lesson = Database['public']['Tables']['lessons']['Row'];
type LessonInsert = Database['public']['Tables']['lessons']['Insert'];
type LessonUpdate = Database['public']['Tables']['lessons']['Update'];

/**
 * Chapters Hooks
 */

export function useCreateChapter() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chapterData: Omit<ChapterInsert, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('chapters')
        .insert(chapterData)
        .select()
        .single();

      if (error) throw error;
      return data as Chapter;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.course_id) });
    },
  });
}

export function useUpdateChapter() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ChapterUpdate }) => {
      const { data, error } = await supabase
        .from('chapters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Chapter;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.course_id) });
    },
  });
}

export function useDeleteChapter() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id, courseId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.courseId) });
    },
  });
}

/**
 * Lessons Hooks
 */

export function useCreateLesson() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonData: Omit<LessonInsert, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select()
        .single();

      if (error) throw error;
      return data as Lesson;
    },
    onSuccess: (data) => {
      if (data.course_id) {
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.course_id) });
      }
    },
  });
}

export function useUpdateLesson() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: LessonUpdate }) => {
      const { data, error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Lesson;
    },
    onSuccess: (data) => {
      if (data.course_id) {
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.course_id) });
      }
    },
  });
}

export function useDeleteLesson() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id, courseId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.courseId) });
    },
  });
}
