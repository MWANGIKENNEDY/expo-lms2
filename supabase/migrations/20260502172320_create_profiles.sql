-- Create profiles table
CREATE TABLE "public"."profiles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL UNIQUE,  -- Clerk user ID
  "interest" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

-- Primary key is implicitly indexed
ALTER TABLE "public"."profiles" ADD PRIMARY KEY ("id");

--------------------------------------------------
-- 🔐 PERMISSIONS
--------------------------------------------------

-- Revoke all default permissions first
REVOKE ALL ON TABLE "public"."profiles" FROM "anon";
REVOKE ALL ON TABLE "public"."profiles" FROM "authenticated";

-- Authenticated users -> full access (RLS controls actual behavior)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."profiles" TO "authenticated";

-- Service role -> full access
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

--------------------------------------------------
-- 🔐 RLS POLICIES
--------------------------------------------------

-- 1. Users can view their own profile
CREATE POLICY "Users can view own profile"
ON "public"."profiles"
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.jwt() ->> 'sub'));

-- 2. Users can create their own profile
CREATE POLICY "Users can insert own profile"
ON "public"."profiles"
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));

-- 3. Users can update their own profile
CREATE POLICY "Users can update own profile"
ON "public"."profiles"
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.jwt() ->> 'sub'));
