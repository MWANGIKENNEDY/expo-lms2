# Clerk + Supabase Integration

This project uses Clerk for authentication with Supabase as the database backend.

## Configuration

### 1. Supabase Config (`supabase/config.toml`)

Clerk is enabled as a third-party auth provider:

```toml
[auth.third_party.clerk]
enabled = true
domain = "in-bobcat-87.clerk.accounts.dev"
```

### 2. Environment Variables (`.env`)

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aW4tYm9iY2F0LTg3LmNsZXJrLmFjY291bnRzLmRldiQ
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Supabase Client (`src/lib/supabase.ts`)

The Supabase client is configured to use Clerk session tokens:

```typescript
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

## Row Level Security (RLS) Policies

All RLS policies use Clerk's JWT claims instead of Supabase Auth's `auth.uid()`.

### Key Difference

- **Supabase Auth**: `auth.uid()` returns UUID
- **Clerk**: `auth.jwt()->>'sub'` returns TEXT (Clerk user ID)

### Example: Courses Table

```sql
-- Anyone can view published courses
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (is_published = TRUE);

-- Instructors can only access their own courses
CREATE POLICY "Instructors can view their own courses"
  ON courses FOR SELECT
  TO authenticated
  USING (instructor_id = (auth.jwt()->>'sub'));
```

## Database Schema Changes

The `instructor_id` column uses `TEXT` instead of `UUID` to support Clerk user IDs:

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id TEXT NOT NULL,  -- Clerk user ID (not UUID)
  ...
);
```

## Usage in React Native

```typescript
const supabase = useSupabase();
const { userId } = useAuth(); // Clerk user ID

// Create a course
const { data, error } = await supabase
  .from('courses')
  .insert({
    title: 'My Course',
    instructor_id: userId,  // Use Clerk's userId
    is_published: false
  });

// Query user's courses
const { data: myCourses } = await supabase
  .from('courses')
  .select('*')
  .eq('instructor_id', userId);
```

## Available JWT Claims from Clerk

You can access these claims in RLS policies:

- `auth.jwt()->>'sub'` - User ID
- `auth.jwt()->>'email'` - User email
- `auth.jwt()->>'org_id'` - Organization ID (if using Clerk Organizations)
- `auth.jwt()->>'org_role'` - Organization role (e.g., 'org:admin')

## Migrations

Two migrations were created:

1. `20260424183320_create_courses_table.sql` - Initial courses table
2. `20260424183901_update_courses_for_clerk.sql` - Updated for Clerk compatibility

## References

- [Supabase + Clerk Documentation](https://supabase.com/docs/guides/auth/third-party/clerk)
- [Clerk JWT Claims](https://clerk.com/docs/backend-requests/making/jwt-templates)
