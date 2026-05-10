-- Create courses table for LMS system
-- Uses Clerk authentication with optimized RLS policies

CREATE TABLE "public"."courses" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "description" text,
  "instructor_id" text NOT NULL,  -- Clerk user ID
  "thumbnail_url" text,
  "price" numeric(10,2) DEFAULT 0.00,
  "is_published" boolean DEFAULT false,
  "category" text,
  "level" text,
  "duration_hours" integer,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE UNIQUE INDEX courses_pkey ON public.courses USING btree (id);
CREATE INDEX idx_courses_category ON public.courses USING btree (category);
CREATE INDEX idx_courses_instructor ON public.courses USING btree (instructor_id);
CREATE INDEX idx_courses_published 
  ON public.courses USING btree (is_published) 
  WHERE (is_published = true);

-- Primary key
ALTER TABLE "public"."courses" 
ADD CONSTRAINT "courses_pkey" PRIMARY KEY USING INDEX "courses_pkey";

-- Level constraint
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_level_check" 
CHECK (level = ANY (ARRAY['beginner','intermediate','advanced']));

--------------------------------------------------
-- 🔐 PERMISSIONS (FIXED)
--------------------------------------------------

-- Revoke all default permissions first
REVOKE ALL ON TABLE "public"."courses" FROM "anon";
REVOKE ALL ON TABLE "public"."courses" FROM "authenticated";

-- Anonymous users → read-only
GRANT SELECT ON TABLE "public"."courses" TO "anon";

-- Authenticated users → full access (RLS controls actual behavior)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."courses" TO "authenticated";

-- Service role → full access (backend/admin)
GRANT ALL ON TABLE "public"."courses" TO "service_role";

--------------------------------------------------
-- 🔐 RLS POLICIES (OPTIMIZED)
--------------------------------------------------

-- 1. Public can only see published courses
CREATE POLICY "Public can view published courses"
ON "public"."courses"
FOR SELECT
TO public
USING (is_published = true);

-- 2. Authenticated users can see:
--    - published courses
--    - their own courses (even if unpublished)
CREATE POLICY "Users can view own and published courses"
ON "public"."courses"
FOR SELECT
TO authenticated
USING (
  is_published = true
  OR instructor_id = (SELECT auth.jwt() ->> 'sub')
);

-- 3. Users can create their own courses
CREATE POLICY "Users can create courses"
ON "public"."courses"
FOR INSERT
TO authenticated
WITH CHECK (
  instructor_id = (SELECT auth.jwt() ->> 'sub')
);

-- 4. Users can update only their own courses
CREATE POLICY "Users can update own courses"
ON "public"."courses"
FOR UPDATE
TO authenticated
USING (
  instructor_id = (SELECT auth.jwt() ->> 'sub')
);

-- 5. Users can delete only their own courses
CREATE POLICY "Users can delete own courses"
ON "public"."courses"
FOR DELETE
TO authenticated
USING (
  instructor_id = (SELECT auth.jwt() ->> 'sub')
);