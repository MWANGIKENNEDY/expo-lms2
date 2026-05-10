# Row Level Security (RLS) Policies

This document explains the optimized RLS policies implemented for the courses table.

## Policy Overview

| Policy Name | Command | Who Can Use | Condition |
|------------|---------|-------------|-----------|
| **Public can view published courses** | SELECT | Everyone (including anonymous) | `is_published = true` |
| **Users can view own and published courses** | SELECT | Authenticated Users | `is_published = true` OR owns the course |
| **Users can create courses** | INSERT | Authenticated Users | Must set instructor_id to their own user ID |
| **Users can update own courses** | UPDATE | Authenticated Users | instructor_id must match their user ID |
| **Users can delete own courses** | DELETE | Authenticated Users | instructor_id must match their user ID |

## Permissions vs RLS

### Table Permissions (What roles CAN attempt)

| Role | Permissions |
|------|-------------|
| `anon` (anonymous) | SELECT only (read-only) |
| `authenticated` | SELECT, INSERT, UPDATE, DELETE |
| `service_role` | ALL (full admin access) |

### RLS Policies (What actually gets allowed)

Even though `authenticated` users have INSERT/UPDATE/DELETE permissions, **RLS policies control what they can actually do**.

---

## Policy Details

### 1. Public Can View Published Courses

```sql
CREATE POLICY "Public can view published courses"
ON courses
FOR SELECT
TO public
USING (is_published = true);
```

**What it does:**
- Anonymous users (not logged in) can ONLY see published courses
- Draft courses are hidden from public view
- Perfect for public course catalog browsing

**Example:**
```typescript
// Anonymous user (no auth)
const supabase = createClient(url, anonKey);

// ✅ Can see published courses
const { data } = await supabase
  .from('courses')
  .select('*')
  .eq('is_published', true);

// ❌ Cannot see draft courses (filtered out by RLS)
const { data: drafts } = await supabase
  .from('courses')
  .select('*')
  .eq('is_published', false);
// Returns empty array
```

---

### 2. Users Can View Own and Published Courses

```sql
CREATE POLICY "Users can view own and published courses"
ON courses
FOR SELECT
TO authenticated
USING (
  is_published = true
  OR instructor_id = (SELECT auth.jwt() ->> 'sub')
);
```

**What it does:**
- Authenticated users can see ALL published courses
- Authenticated users can ALSO see their own draft courses
- Users cannot see other users' draft courses

**Example:**
```typescript
const { userId } = useAuth();
const supabase = useSupabase();

// ✅ Can see all published courses
const { data: published } = await supabase
  .from('courses')
  .select('*')
  .eq('is_published', true);

// ✅ Can see your own draft courses
const { data: myDrafts } = await supabase
  .from('courses')
  .select('*')
  .eq('instructor_id', userId)
  .eq('is_published', false);

// ❌ Cannot see other users' draft courses (filtered by RLS)
const { data: otherDrafts } = await supabase
  .from('courses')
  .select('*')
  .neq('instructor_id', userId)
  .eq('is_published', false);
// Returns empty array
```

---

### 3. Users Can Create Courses

```sql
CREATE POLICY "Users can create courses"
ON courses
FOR INSERT
TO authenticated
WITH CHECK (
  instructor_id = (SELECT auth.jwt() ->> 'sub')
);
```

**What it does:**
- Only authenticated users can create courses
- The `instructor_id` must match the user's Clerk user ID
- Prevents users from creating courses on behalf of others

**Example:**
```typescript
const { userId } = useAuth();
const supabase = useSupabase();

// ✅ This works - instructor_id matches userId
const { data, error } = await supabase
  .from('courses')
  .insert({
    title: 'My Course',
    instructor_id: userId,
    price: 49.99,
    is_published: false
  });

// ❌ This fails - trying to create course for someone else
const { error } = await supabase
  .from('courses')
  .insert({
    title: 'My Course',
    instructor_id: 'someone_else_id',
    price: 49.99
  });
// Error: new row violates row-level security policy
```

---

### 4. Users Can Update Own Courses

```sql
CREATE POLICY "Users can update own courses"
ON courses
FOR UPDATE
TO authenticated
USING (
  instructor_id = (SELECT auth.jwt() ->> 'sub')
);
```

**What it does:**
- Only authenticated users can update courses
- Users can ONLY update courses where they are the instructor
- Automatically filters to only show/update their own courses

**Example:**
```typescript
const { userId } = useAuth();
const supabase = useSupabase();

// ✅ Update your own course
const { data, error } = await supabase
  .from('courses')
  .update({ 
    title: 'Updated Title',
    is_published: true 
  })
  .eq('id', myCourseId);

// ❌ Try to update someone else's course
const { data, error } = await supabase
  .from('courses')
  .update({ title: 'Hacked!' })
  .eq('id', someoneElsesCourseId);
// No error, but 0 rows updated
```

---

### 5. Users Can Delete Own Courses

```sql
CREATE POLICY "Users can delete own courses"
ON courses
FOR DELETE
TO authenticated
USING (
  instructor_id = (SELECT auth.jwt() ->> 'sub')
);
```

**What it does:**
- Only authenticated users can delete courses
- Users can ONLY delete courses where they are the instructor
- Prevents accidental or malicious deletion of others' courses

**Example:**
```typescript
const supabase = useSupabase();

// ✅ Delete your own course
const { error } = await supabase
  .from('courses')
  .delete()
  .eq('id', myCourseId);

// ❌ Try to delete someone else's course
const { error } = await supabase
  .from('courses')
  .delete()
  .eq('id', someoneElsesCourseId);
// No error, but 0 rows deleted
```

---

## Key Improvements

### 🔒 Better Security

**Before:**
- Everyone could see ALL courses (including drafts)

**After:**
- Anonymous users only see published courses
- Authenticated users see published + their own drafts
- Other users' drafts are hidden

### ⚡ Optimized Performance

**Before:**
- Single policy checked both conditions for everyone

**After:**
- Separate policies for public vs authenticated
- More efficient query planning by PostgreSQL

### 🎯 Clearer Intent

**Before:**
- Generic "view all courses" policy

**After:**
- Clear separation: public sees published, users see published + own

---

## Testing Scenarios

### Scenario 1: Anonymous User Browsing

```typescript
// No authentication
const supabase = createClient(url, anonKey);

// ✅ Can view published courses
const { data } = await supabase
  .from('courses')
  .select('*');
// Returns only published courses

// ❌ Cannot create courses
const { error } = await supabase
  .from('courses')
  .insert({ title: 'Test' });
// Error: permission denied
```

### Scenario 2: Instructor Managing Courses

```typescript
const { userId } = useAuth();
const supabase = useSupabase();

// ✅ View all published courses + own drafts
const { data: allMyCourses } = await supabase
  .from('courses')
  .select('*');

// ✅ Create a draft course
const { data: newCourse } = await supabase
  .from('courses')
  .insert({
    title: 'New Course',
    instructor_id: userId,
    is_published: false
  });

// ✅ Publish the course
await supabase
  .from('courses')
  .update({ is_published: true })
  .eq('id', newCourse.id);

// ✅ Delete own course
await supabase
  .from('courses')
  .delete()
  .eq('id', newCourse.id);
```

### Scenario 3: User Trying to Hack

```typescript
const { userId } = useAuth();
const supabase = useSupabase();

// ❌ Try to see other users' drafts
const { data } = await supabase
  .from('courses')
  .select('*')
  .eq('is_published', false);
// Only returns YOUR drafts, not others'

// ❌ Try to update someone else's course
await supabase
  .from('courses')
  .update({ price: 0 })
  .eq('instructor_id', 'other_user_id');
// 0 rows updated

// ❌ Try to create course for someone else
await supabase
  .from('courses')
  .insert({
    title: 'Fake Course',
    instructor_id: 'other_user_id'
  });
// Error: new row violates row-level security policy
```

---

## Viewing Policies

### SQL Query

```sql
SELECT 
  policyname AS "Policy Name",
  cmd AS "Command",
  CASE 
    WHEN roles = '{public}' THEN 'Everyone'
    WHEN roles = '{authenticated}' THEN 'Authenticated'
    ELSE roles::text
  END AS "Role",
  qual AS "Condition"
FROM pg_policies 
WHERE tablename = 'courses'
ORDER BY cmd, policyname;
```

### Check Permissions

```sql
SELECT 
  grantee AS "Role",
  string_agg(privilege_type, ', ' ORDER BY privilege_type) AS "Permissions"
FROM information_schema.table_privileges 
WHERE table_name = 'courses' AND table_schema = 'public'
GROUP BY grantee
ORDER BY grantee;
```

### Supabase Studio

1. Open http://127.0.0.1:54323
2. Navigate to **Database** → **Tables** → **courses**
3. Click on the **Policies** tab

---

## Security Best Practices

### ✅ Do This

```typescript
// Always use authenticated user's ID
const { userId } = useAuth();
await supabase.from('courses').insert({
  instructor_id: userId,
  // ...
});

// Check operation results
const { data, error } = await supabase
  .from('courses')
  .update({ title: 'New' })
  .eq('id', courseId);

if (!data || data.length === 0) {
  console.error('Update failed - not your course?');
}

// Use is_published flag correctly
await supabase.from('courses').insert({
  title: 'Draft Course',
  instructor_id: userId,
  is_published: false  // Start as draft
});
```

### ❌ Don't Do This

```typescript
// Don't hardcode user IDs
await supabase.from('courses').insert({
  instructor_id: 'hardcoded_id',  // Bad!
});

// Don't assume operations succeed
await supabase.from('courses').update({ title: 'New' });
// Always check the result!

// Don't try to bypass RLS
await supabase.from('courses').insert({
  instructor_id: 'other_user_id',  // Will fail
});
```

---

## Troubleshooting

### Problem: Can't see my draft courses

**Check:**
1. Are you authenticated? `const { userId } = useAuth();`
2. Is `instructor_id` set to your `userId`?
3. Query without filters to see what RLS returns

### Problem: Anonymous users see no courses

**Cause:** No courses are published. Check:
```sql
SELECT COUNT(*) FROM courses WHERE is_published = true;
```

### Problem: Update succeeds but nothing changes

**Cause:** RLS blocked the update because you don't own the course.
```typescript
// Check ownership first
const { data } = await supabase
  .from('courses')
  .select('instructor_id')
  .eq('id', courseId)
  .single();

console.log('Owner:', data.instructor_id);
console.log('You:', userId);
```

---

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk + Supabase Integration](https://supabase.com/docs/guides/auth/third-party/clerk)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
