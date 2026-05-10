# TanStack Query Setup

This document explains the TanStack Query setup for data fetching in the app.

## Installation

```bash
npm install @tanstack/react-query
```

## Configuration

### 1. Query Client Setup (`src/app/_layout.tsx`)

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        {/* App content */}
      </QueryClientProvider>
    </ClerkProvider>
  );
}
```

### 2. Database Types

Generated from Supabase schema:

```bash
supabase gen types typescript --local > src/lib/database.types.ts
```

## API Hooks (`src/lib/api/courses.ts`)

### Query Keys

Organized query keys for better cache management:

```typescript
export const courseKeys = {
  all: ['courses'],
  lists: () => [...courseKeys.all, 'list'],
  list: (filters?: string) => [...courseKeys.lists(), filters],
  details: () => [...courseKeys.all, 'detail'],
  detail: (id: string) => [...courseKeys.details(), id],
};
```

### Available Hooks

#### `useCourses()`

Fetch all courses (respects RLS policies):

```typescript
const { data: courses, isLoading, error, refetch } = useCourses();
```

**Returns:**
- Published courses for everyone
- Published + own drafts for authenticated users

#### `useCourse(id)`

Fetch a single course by ID:

```typescript
const { data: course, isLoading, error } = useCourse(courseId);
```

#### `useDeleteCourse()`

Delete a course (only works if user owns it):

```typescript
const deleteMutation = useDeleteCourse();

await deleteMutation.mutateAsync(courseId);
```

**Features:**
- Automatically checks RLS (only owner can delete)
- Invalidates course list cache on success
- Returns error if not authorized

#### `useCreateCourse()`

Create a new course:

```typescript
const createMutation = useCreateCourse();

await createMutation.mutateAsync({
  title: 'My Course',
  description: 'Course description',
  price: 49.99,
  is_published: false,
});
```

**Features:**
- Automatically sets `instructor_id` to current user
- Invalidates course list cache on success

#### `useUpdateCourse()`

Update a course (only works if user owns it):

```typescript
const updateMutation = useUpdateCourse();

await updateMutation.mutateAsync({
  id: courseId,
  updates: {
    title: 'Updated Title',
    is_published: true,
  },
});
```

## Search Tab Implementation

### Location

`src/app/(tabs)/(search)/index.tsx`

### Features

1. **Course List**
   - Displays all courses (respects RLS)
   - Shows course title
   - Indicates draft status
   - Shows ownership badge

2. **Delete Functionality**
   - Delete button only visible for owned courses
   - Confirmation dialog before deletion
   - RLS ensures only owner can delete
   - Automatic cache invalidation

3. **Loading States**
   - Loading indicator while fetching
   - Error state with retry button
   - Empty state when no courses

### UI Components

```typescript
// Course Item
<View style={styles.courseItem}>
  <View style={styles.courseInfo}>
    <Text style={styles.courseTitle}>{item.title}</Text>
    {/* Badges */}
  </View>
  {isOwner && (
    <Pressable onPress={handleDelete}>
      <Text>Delete</Text>
    </Pressable>
  )}
</View>
```

### Delete Flow

```typescript
const handleDelete = (courseId, courseTitle, instructorId) => {
  // 1. Check ownership (UI level)
  if (instructorId !== userId) {
    Alert.alert('Error', 'You can only delete your own courses');
    return;
  }

  // 2. Confirm deletion
  Alert.alert('Delete Course', `Are you sure?`, [
    { text: 'Cancel' },
    {
      text: 'Delete',
      onPress: async () => {
        try {
          // 3. Delete (RLS enforces ownership at DB level)
          await deleteMutation.mutateAsync(courseId);
          Alert.alert('Success', 'Course deleted');
        } catch (error) {
          Alert.alert('Error', error.message);
        }
      },
    },
  ]);
};
```

## Cache Management

### Automatic Invalidation

Mutations automatically invalidate relevant queries:

```typescript
// After delete
queryClient.invalidateQueries({ queryKey: courseKeys.lists() });

// After create
queryClient.invalidateQueries({ queryKey: courseKeys.lists() });

// After update
queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) });
```

### Manual Refetch

```typescript
const { refetch } = useCourses();

// Trigger manual refetch
await refetch();
```

## Error Handling

### Query Errors

```typescript
const { data, error, isLoading } = useCourses();

if (error) {
  return <Text>Error: {error.message}</Text>;
}
```

### Mutation Errors

```typescript
try {
  await deleteMutation.mutateAsync(courseId);
} catch (error) {
  Alert.alert('Error', error.message);
}
```

### RLS-Specific Errors

When RLS blocks an operation:

```typescript
// Delete returns count: 0 if blocked
if (count === 0) {
  throw new Error('Cannot delete this course. You may not be the owner.');
}
```

## Best Practices

### 1. Use Query Keys Consistently

```typescript
// ✅ Good
queryClient.invalidateQueries({ queryKey: courseKeys.lists() });

// ❌ Bad
queryClient.invalidateQueries({ queryKey: ['courses', 'list'] });
```

### 2. Handle Loading States

```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
```

### 3. Optimistic Updates (Optional)

For better UX, update UI before server responds:

```typescript
const deleteMutation = useDeleteCourse({
  onMutate: async (courseId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: courseKeys.lists() });

    // Snapshot previous value
    const previousCourses = queryClient.getQueryData(courseKeys.lists());

    // Optimistically update
    queryClient.setQueryData(courseKeys.lists(), (old) =>
      old?.filter((course) => course.id !== courseId)
    );

    return { previousCourses };
  },
  onError: (err, courseId, context) => {
    // Rollback on error
    queryClient.setQueryData(courseKeys.lists(), context.previousCourses);
  },
});
```

### 4. Check Mutation Status

```typescript
const deleteMutation = useDeleteCourse();

<Pressable
  disabled={deleteMutation.isPending}
  onPress={handleDelete}
>
  <Text>{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</Text>
</Pressable>
```

## Testing

### Test Course List

```typescript
// Should show all published courses + your drafts
const { data: courses } = useCourses();
console.log('Courses:', courses.length);
```

### Test Delete

```typescript
// Should only work for your courses
const deleteMutation = useDeleteCourse();

try {
  await deleteMutation.mutateAsync(yourCourseId); // ✅ Works
  await deleteMutation.mutateAsync(otherCourseId); // ❌ Fails
} catch (error) {
  console.log('Error:', error.message);
}
```

## Troubleshooting

### Problem: Courses not loading

**Check:**
1. Is Supabase running? `supabase status`
2. Is user authenticated? `const { userId } = useAuth();`
3. Check browser/console for errors

### Problem: Delete not working

**Check:**
1. Is `instructor_id` matching `userId`?
2. Check RLS policies in database
3. Look for error messages in Alert

### Problem: Stale data after mutation

**Solution:** Ensure cache invalidation:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
}
```

## References

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Supabase + React Query](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
