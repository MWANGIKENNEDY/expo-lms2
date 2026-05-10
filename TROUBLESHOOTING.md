# Troubleshooting Guide

Common issues and solutions for the LMS app.

## TanStack Query Issues

### Error: "Property 'QueryClientProvider' doesn't exist"

**Cause:** Missing import or Metro bundler cache issue

**Solution:**

1. **Check imports in `src/app/_layout.tsx`:**
   ```typescript
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   ```

2. **Clear Metro bundler cache:**
   ```bash
   # Stop the dev server, then:
   npx expo start -c
   ```

3. **Clean install dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Restart development server:**
   ```bash
   npm start
   ```

### Error: "Cannot find module '@tanstack/react-query'"

**Solution:**
```bash
npm install @tanstack/react-query
```

---

## Supabase Issues

### Error: "MCP server not connected"

**Cause:** Supabase local instance not running

**Solution:**
```bash
supabase start
```

### Error: "relation 'courses' does not exist"

**Cause:** Migrations not applied

**Solution:**
```bash
supabase db reset
```

### Error: "Cannot delete course"

**Possible causes:**
1. Not the course owner (RLS blocking)
2. Not authenticated
3. Supabase not running

**Check:**
```typescript
const { userId } = useAuth();
console.log('User ID:', userId);
console.log('Course instructor_id:', course.instructor_id);
console.log('Match:', userId === course.instructor_id);
```

---

## Clerk Authentication Issues

### Warning: "Codegen didn't run for ClerkAuthView"

**Cause:** Babel preset warning (can be ignored for now)

**Solution (if it becomes an error):**

1. Update babel.config.js:
   ```javascript
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: [
         '@react-native/babel-preset',
         ["babel-preset-expo", { jsxImportSource: "nativewind" }],
         "nativewind/babel",
       ],
     };
   };
   ```

2. Install preset:
   ```bash
   npm install --save-dev @react-native/babel-preset
   ```

### Error: "User not authenticated"

**Check:**
```typescript
const { userId, isSignedIn } = useAuth();
console.log('Signed in:', isSignedIn);
console.log('User ID:', userId);
```

---

## React Native / Expo Issues

### Error: "Unable to resolve 'react/jsx-runtime'"

**Cause:** React Navigation packages incompatible with React 19

**Solution:**
```bash
# Update React Navigation packages
npm install @react-navigation/elements@latest @react-navigation/bottom-tabs@latest @react-navigation/native@latest

# Clear caches
watchman watch-del-all  # If watchman is installed
npx expo start -c
```

### Metro bundler not updating

**Solution:**
```bash
# Clear cache and restart
npx expo start -c
```

### TypeScript errors

**Solution:**
```bash
# Regenerate types
supabase gen types typescript --local > src/lib/database.types.ts
```

### App crashes on startup

**Check:**
1. Environment variables in `.env`
2. Supabase is running: `supabase status`
3. Check console for error messages

---

## Development Workflow

### After changing database schema

```bash
# 1. Make changes via SQL or Supabase Studio
# 2. Generate migration
supabase db diff --local --file migration_name

# 3. Regenerate types
supabase gen types typescript --local > src/lib/database.types.ts

# 4. Restart app
npx expo start -c
```

### After pulling new code

```bash
# 1. Install dependencies
npm install

# 2. Reset database
supabase db reset

# 3. Start app
npm start
```

### Clean slate (nuclear option)

```bash
# 1. Clean dependencies
rm -rf node_modules package-lock.json
npm install

# 2. Clean Supabase
supabase stop
supabase start

# 3. Reset database
supabase db reset

# 4. Clear Metro cache
npx expo start -c
```

---

## Common Error Messages

### "Error: Invalid hook call"

**Cause:** Using hooks outside of React components or wrong React version

**Check:**
- Hooks must be called inside function components
- Check for duplicate React installations: `npm ls react`

### "Network request failed"

**Cause:** Supabase not running or wrong URL

**Check:**
1. `supabase status`
2. `.env` file has correct URL: `http://127.0.0.1:54321`
3. Device/emulator can reach localhost

### "RLS policy violation"

**Cause:** Trying to perform unauthorized action

**Check:**
- Are you authenticated?
- Do you own the resource?
- Are RLS policies correct?

**Debug:**
```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'courses';

-- Temporarily disable RLS (local only!)
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
-- Test your query
-- Re-enable
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
```

---

## Debugging Tips

### Enable React Query DevTools (Web only)

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Log Supabase queries

```typescript
const supabase = useSupabase();

const { data, error } = await supabase
  .from('courses')
  .select('*')
  .then(result => {
    console.log('Query result:', result);
    return result;
  });
```

### Check RLS in action

```sql
-- Run as authenticated user
SET request.jwt.claims = '{"sub": "user_123"}';
SELECT * FROM courses;

-- Run as anonymous
RESET request.jwt.claims;
SELECT * FROM courses;
```

---

## Getting Help

### Check logs

**Supabase logs:**
```bash
supabase logs postgres
supabase logs api
```

**Metro bundler:**
- Check terminal where `npm start` is running

**Device logs:**
- iOS: Xcode Console
- Android: `adb logcat`

### Useful commands

```bash
# Check Supabase status
supabase status

# Check installed packages
npm ls @tanstack/react-query
npm ls @clerk/expo

# Check Node/npm versions
node --version
npm --version

# Check Expo version
npx expo --version
```

### Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Supabase Docs](https://supabase.com/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Expo Docs](https://docs.expo.dev)
