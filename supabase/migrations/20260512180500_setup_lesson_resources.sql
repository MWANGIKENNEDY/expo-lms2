-- 1. Create the lesson-resources bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'lesson-resources', 'lesson-resources', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'lesson-resources'
);

-- 2. Add resource columns to lessons table for tracking files
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS "resource_url" text,
ADD COLUMN IF NOT EXISTS "resource_type" text CHECK (resource_type IN ('video', 'pdf', 'other'));

-- 3. Storage RLS Policies
-- Enable RLS on storage.objects (usually enabled by default in Supabase)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts during iteration
DROP POLICY IF EXISTS "Public can view resources of published courses" ON storage.objects;
DROP POLICY IF EXISTS "Instructors can manage own course resources" ON storage.objects;

-- 3a. Allow authenticated users to view resources of published courses
-- File path pattern: courses/{course_id}/lessons/{lesson_id}/{filename}
CREATE POLICY "Authenticated users can view resources of published courses"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lesson-resources'
  AND (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE (c.is_published = true OR c.instructor_id = (SELECT auth.jwt() ->> 'sub'))
      AND c.id::text = (storage.foldername(name))[2]
    )
  )
);

-- 3b. Allow instructors to manage their own course resources
CREATE POLICY "Instructors can manage own course resources"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'lesson-resources'
  AND (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.instructor_id = (SELECT auth.jwt() ->> 'sub')
      AND c.id::text = (storage.foldername(name))[2]
    )
  )
)
WITH CHECK (
  bucket_id = 'lesson-resources'
  AND (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.instructor_id = (SELECT auth.jwt() ->> 'sub')
      AND c.id::text = (storage.foldername(name))[2]
    )
  )
);
