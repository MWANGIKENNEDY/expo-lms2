-- Enable full CRUD for chapters by instructors
CREATE POLICY "Instructors can manage their own chapters"
ON "public"."chapters"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = public.chapters.course_id 
    AND public.courses.instructor_id = (SELECT auth.jwt() ->> 'sub')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = public.chapters.course_id 
    AND public.courses.instructor_id = (SELECT auth.jwt() ->> 'sub')
  )
);

-- Enable full CRUD for lessons by instructors
CREATE POLICY "Instructors can manage their own lessons"
ON "public"."lessons"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = public.lessons.course_id 
    AND public.courses.instructor_id = (SELECT auth.jwt() ->> 'sub')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = public.lessons.course_id 
    AND public.courses.instructor_id = (SELECT auth.jwt() ->> 'sub')
  )
);

-- Grant permissions for authenticated users
GRANT ALL ON TABLE "public"."chapters" TO "authenticated";
GRANT ALL ON TABLE "public"."lessons" TO "authenticated";
