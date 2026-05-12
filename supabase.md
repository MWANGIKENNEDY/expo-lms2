# Supabase Documentation

Complete guide for working with Supabase in this project.

## Table of Contents

- [Setup](#setup)
- [Configuration](#configuration)
- [Clerk Integration](#clerk-integration)
- [Database Schema](#database-schema)
- [Storage](#storage)
- [Row Level Security (RLS)](#row-level-security-rls)
- [Viewing RLS Policies](#viewing-rls-policies)
- [Migrations](#migrations)
- [Usage Examples](#usage-examples)

---

## Setup

### Prerequisites

- Docker Desktop installed and running
- Supabase CLI installed
- Node.js and npm/yarn

### Initial Setup

```bash
# Initialize Supabase
supabase init

# Start local Supabase stack
supabase start

# View status and connection info
supabase status
```

### Local Development URLs

- **Studio (UI)**: http://127.0.0.1:54323
- **API**: http://127.0.0.1:54321
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **MCP Server**: http://127.0.0.1:54321/mcp

---

## Configuration

### Environment Variables (`.env`)

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Supabase Config (`supabase/config.toml`)

Key configurations:

```toml
[api]
port = 54321

[db]
port = 54322

[studio]
port = 54323

[auth.third_party.clerk]
enabled = true
domain = "in-bobcat-87.clerk.accounts.dev"
```

---

## Clerk Integration

This project uses **Clerk** for authentication with Supabase as the database backend.

### Supabase Client Setup

The client automatically attaches Clerk session tokens to every request:

```typescript
// src/lib/supabase.ts
export function useSupabase() {
  const { getToken } = useAuth();

  return useMemo(
    () =>
      createClient(supabaseUrl, supabaseAnonKey, {
        async accessToken() {
          return (await getToken()) ?? null;
        },
      }),
    [getToken],
  );
}
```

### Key Differences from Supabase Auth

| Feature | Supabase Auth | Clerk |
|---------|--------------|-------|
| User ID Type | UUID | TEXT (string) |
| User ID Access | `auth.uid()` | `auth.jwt()->>'sub'` |
| Email Access | `auth.email()` | `auth.jwt()->>'email'` |

---

## Database Schema

### Courses Table

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id TEXT NOT NULL,  -- Clerk user ID
  thumbnail_url TEXT,
  price DECIMAL(10, 2) DEFAULT 0.00,
  is_published BOOLEAN DEFAULT FALSE,
  category TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_courses_instructor` - Fast lookup by instructor
- `idx_courses_published` - Fast filtering of published courses
- `idx_courses_category` - Fast filtering by category

---

## Storage

### Buckets

| Bucket Name | Access | Purpose |
|-------------|--------|---------|
| `lesson-resources` | Authenticated Only | Videos, PDFs, and other lesson materials |

### Directory Structure

Resources follow a strict path convention for RLS policy efficiency:
`courses/{course_id}/lessons/{lesson_id}/{filename}`

### Storage RLS Policies

| Policy Name | Command | Who | Condition |
|------------|---------|-----|-----------|
| Authenticated users can view resources | SELECT | Authenticated | Course is published OR user is instructor |
| Instructors can manage own resources | ALL | Authenticated | instructor_id matches `auth.jwt()->>'sub'` |

**Note:** Public access is disabled for all storage buckets. Users must be logged in via Clerk to access any lesson materials.

## Row Level Security (RLS)

RLS is enabled on all tables to ensure data security at the database level.

### Courses Table Policies

| Policy Name | Command | Who | Condition |
|------------|---------|-----|-----------|
| Public can view published courses | SELECT | Everyone | `is_published = true` |
| Users can view own and published courses | SELECT | Authenticated | `is_published = true` OR owns course |
| Users can create courses | INSERT | Authenticated | `instructor_id = auth.jwt()->>'sub'` |
| Users can update own courses | UPDATE | Authenticated | `instructor_id = auth.jwt()->>'sub'` |
| Users can delete own courses | DELETE | Authenticated | `instructor_id = auth.jwt()->>'sub'` |

### Policy Summary

**Anonymous Users (not logged in):**
- ✅ Can view published courses only
- ❌ Cannot see draft courses
- ❌ Cannot create, update, or delete courses

**Authenticated Users:**
- ✅ Can view all published courses
- ✅ Can view their own draft courses
- ✅ Can create courses
- ✅ Can update/delete ONLY their own courses
- ❌ Cannot see other users' draft courses
- ❌ Cannot update/delete other users' courses

### Table Permissions

| Role | Permissions |
|------|-------------|
| `anon` | SELECT only (read-only) |
| `authenticated` | SELECT, INSERT, UPDATE, DELETE (controlled by RLS) |
| `service_role` | ALL (full admin access) |

### How RLS Works with Clerk

```sql
-- Example: Users can see published courses OR their own courses
CREATE POLICY "Users can view own and published courses"
  ON courses FOR SELECT
  TO authenticated
  USING (
    is_published = true
    OR instructor_id = (SELECT auth.jwt() ->> 'sub')
  );
```

The `auth.jwt()->>'sub'` extracts the Clerk user ID from the JWT token.

**Important:** RLS policies don't throw errors when they block operations. Instead, they return empty results or affect 0 rows. Always check your query results to ensure operations succeeded.

For detailed examples and testing strategies, see [RLS_POLICIES.md](./RLS_POLICIES.md).

---

## Viewing RLS Policies

### Option 1: SQL Query (Quick)

```sql
-- View all policies for a table
SELECT 
  policyname AS "Policy Name",
  cmd AS "Command",
  CASE 
    WHEN roles = '{public}' THEN 'Everyone'
    WHEN roles = '{authenticated}' THEN 'Authenticated Users'
    ELSE roles::text
  END AS "Who Can Use",
  COALESCE(qual, 'No restriction') AS "USING (read check)",
  COALESCE(with_check, 'No restriction') AS "WITH CHECK (write check)"
FROM pg_policies 
WHERE tablename = 'courses'
ORDER BY cmd, policyname;
```

### Option 2: Supabase Studio (Visual)

1. Open http://127.0.0.1:54323
2. Navigate to **Database** → **Tables** → **courses**
3. Click on the **Policies** tab
4. View and manage policies visually

### Option 3: Check RLS Status

```sql
-- Check if RLS is enabled on tables
SELECT 
  tablename,
  rowsecurity AS "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Option 4: View Policy Count

```sql
-- Count policies per table
SELECT 
  t.tablename,
  t.rowsecurity AS "RLS Enabled",
  COUNT(pol.policyname) AS "Number of Policies"
FROM pg_tables t
LEFT JOIN pg_policies pol ON t.tablename = pol.tablename AND t.schemaname = pol.schemaname
WHERE t.schemaname = 'public'
GROUP BY t.schemaname, t.tablename, t.rowsecurity
ORDER BY t.tablename;
```

### Option 5: Detailed Policy Definitions

```sql
-- View full policy definitions with expressions
SELECT 
  policyname,
  cmd,
  pg_get_expr(polqual, polrelid) as using_expression,
  pg_get_expr(polwithcheck, polrelid) as with_check_expression
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
WHERE c.relname = 'courses';
```

---

## Seed Data

### Seed File Location

`supabase/seed.sql` - Contains sample data for development and testing.

### What's Included

The seed file populates the database with **18 sample courses**:
- 15 published courses (visible to everyone)
- 3 draft courses (only visible to instructors)
- Multiple categories: Mobile Development, Programming, Backend, Design, etc.
- Various difficulty levels: beginner, intermediate, advanced
- 4 different instructor IDs for testing

### Applying Seed Data

```bash
# Reset database and apply seed data
supabase db reset
```

This command will:
1. Drop all tables
2. Apply all migrations
3. Run the seed.sql file

### Customizing Seed Data

Edit `supabase/seed.sql` to add your own sample data. The file runs automatically during `supabase db reset`.

**Note:** The seed file uses placeholder instructor IDs (`user_instructor_001`, etc.). Replace these with actual Clerk user IDs when testing with real authentication.

---

## Migrations

### Creating Migrations

```bash
# Make schema changes via SQL, then generate migration
supabase db diff --local --file migration_name

# Example: After creating a table
supabase db diff --local --file create_courses_table
```

### Applying Migrations

```bash
# Reset local database and apply all migrations
supabase db reset

# Push migrations to production
supabase db push
```

### Migration Files

Located in `supabase/migrations/`:

- `20260424183320_create_courses_table.sql` - Initial courses table
- `20260424183901_update_courses_for_clerk.sql` - Clerk compatibility updates

### Viewing Migration Status

```bash
# List applied migrations
supabase migration list --local
```

---

## Usage Examples

### Creating a Course

```typescript
const supabase = useSupabase();
const { userId } = useAuth(); // Clerk user ID

const { data, error } = await supabase
  .from('courses')
  .insert({
    title: 'Introduction to React Native',
    description: 'Learn mobile development',
    instructor_id: userId,
    category: 'Programming',
    level: 'beginner',
    price: 49.99,
    is_published: false
  });
```

### Querying Published Courses

```typescript
const { data: courses, error } = await supabase
  .from('courses')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false });
```

### Querying User's Own Courses

```typescript
const { userId } = useAuth();

const { data: myCourses } = await supabase
  .from('courses')
  .select('*')
  .eq('instructor_id', userId)
  .order('created_at', { ascending: false });
```

### Updating a Course

```typescript
const { data, error } = await supabase
  .from('courses')
  .update({ 
    is_published: true,
    updated_at: new Date().toISOString()
  })
  .eq('id', courseId)
  .eq('instructor_id', userId); // RLS ensures only owner can update
```

### Deleting a Course

```typescript
const { error } = await supabase
  .from('courses')
  .delete()
  .eq('id', courseId);
  // RLS automatically ensures only the owner can delete
```

---

## TypeScript Types

### Generating Types

```bash
# Generate TypeScript types from database schema
supabase gen types typescript --local > src/lib/database.types.ts
```

### Using Types

```typescript
import { Database } from './lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];
type CourseInsert = Database['public']['Tables']['courses']['Insert'];
type CourseUpdate = Database['public']['Tables']['courses']['Update'];
```

---

## Troubleshooting

### Supabase Won't Start

```bash
# Stop all containers
supabase stop

# Start fresh
supabase start
```

### Port Conflicts

Check `supabase/config.toml` and ensure ports aren't in use:
- 54321 (API)
- 54322 (Database)
- 54323 (Studio)

### RLS Blocking Queries

```sql
-- Temporarily disable RLS for testing (local only!)
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Re-enable when done
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
```

### View Postgres Logs

```bash
# View logs
supabase logs postgres

# Or via MCP
# Use the get_logs tool with service: "postgres"
```

---

## Useful Commands

```bash
# Start/Stop
supabase start
supabase stop

# Database
supabase db reset              # Reset and apply migrations
supabase db diff --local       # Show schema changes
supabase db push               # Push to production

# Migrations
supabase migration list --local
supabase migration new <name>

# Types
supabase gen types typescript --local

# Status
supabase status
```

---

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase + Clerk Integration](https://supabase.com/docs/guides/auth/third-party/clerk)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk JWT Claims](https://clerk.com/docs/backend-requests/making/jwt-templates)
