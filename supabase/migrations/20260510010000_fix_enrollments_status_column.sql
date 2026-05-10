-- Add missing status column to enrollments table if it doesn't exist
ALTER TABLE "public"."enrollments" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'enrolled';

-- Add missing updated_at column if it doesn't exist
ALTER TABLE "public"."enrollments" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now();

-- Ensure user_id can handle Clerk IDs (text) if it was accidentally set to UUID
-- Note: This is a bit destructive if there are existing FKs to auth.users, 
-- but common in Clerk + Supabase setups where users aren't synced.
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'enrollments' 
        AND column_name = 'user_id' 
        AND data_type = 'uuid'
    ) THEN
        ALTER TABLE "public"."enrollments" DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey;
        ALTER TABLE "public"."enrollments" ALTER COLUMN "user_id" TYPE text;
    END IF;
END $$;
