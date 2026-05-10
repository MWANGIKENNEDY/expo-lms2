-- Create chapters table
CREATE TABLE IF NOT EXISTS "public"."chapters" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "course_id" uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  "title" text NOT NULL,
  "order_index" integer DEFAULT 0,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  PRIMARY KEY ("id")
);

-- Add chapter_id to lessons table
ALTER TABLE "public"."lessons" 
ADD COLUMN IF NOT EXISTS "chapter_id" uuid REFERENCES public.chapters(id) ON DELETE CASCADE;

-- Enable RLS for chapters
ALTER TABLE "public"."chapters" ENABLE ROW LEVEL SECURITY;

-- Policies for chapters
CREATE POLICY "Anyone can view chapters of published courses"
ON "public"."chapters"
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = public.chapters.course_id 
    AND public.courses.is_published = true
  )
);

-- Grant access
GRANT SELECT ON TABLE "public"."chapters" TO "anon", "authenticated";
