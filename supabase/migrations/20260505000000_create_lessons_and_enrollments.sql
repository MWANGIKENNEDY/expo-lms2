-- Create lessons table
CREATE TABLE "public"."lessons" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "course_id" uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  "title" text NOT NULL,
  "content" text,
  "video_url" text,
  "order_index" integer NOT NULL,
  "duration_minutes" integer DEFAULT 0,
  "is_preview" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Create enrollments table
CREATE TABLE "public"."enrollments" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL, -- Clerk user ID
  "course_id" uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  "status" text DEFAULT 'enrolled', -- 'enrolled', 'completed'
  "progress" integer DEFAULT 0, -- 0-100
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."enrollments" ENABLE ROW LEVEL SECURITY;

-- Policies for Lessons
CREATE POLICY "Anyone can view lessons of published courses"
ON "public"."lessons"
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = public.lessons.course_id 
    AND public.courses.is_published = true
  )
);

-- Policies for Enrollments
CREATE POLICY "Users can view own enrollments"
ON "public"."enrollments"
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can enroll themselves"
ON "public"."enrollments"
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own enrollment progress"
ON "public"."enrollments"
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.jwt() ->> 'sub'));

-- Grant access
GRANT SELECT ON TABLE "public"."lessons" TO "anon", "authenticated";
GRANT ALL ON TABLE "public"."enrollments" TO "authenticated";
