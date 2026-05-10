# Seed Data Documentation

This file documents the sample data included in `seed.sql`.

## Overview

The seed file populates the `courses` table with 18 sample courses for development and testing.

## Sample Data Breakdown

### By Status
- **Published**: 15 courses (visible to all users)
- **Draft**: 3 courses (only visible to instructors)

### By Category
- Mobile Development: 2 courses
- Programming: 2 courses
- Backend Development: 3 courses
- Design: 2 courses
- Web Development: 3 courses
- Data Science: 1 course
- DevOps: 1 course
- Database: 1 course
- Cloud Computing: 1 course
- Tools: 1 course
- Security: 1 course (draft)

### By Level
- **Beginner**: 6 courses
- **Intermediate**: 9 courses
- **Advanced**: 3 courses

### By Instructor
- `user_instructor_001`: 5 courses
- `user_instructor_002`: 5 courses
- `user_instructor_003`: 4 courses
- `user_instructor_004`: 4 courses

## Sample Courses

### Published Courses

1. **Introduction to React Native** - $49.99 (Beginner, 12h)
2. **Advanced TypeScript Patterns** - $79.99 (Advanced, 8h)
3. **Full-Stack Development with Supabase** - $59.99 (Intermediate, 15h)
4. **UI/UX Design Fundamentals** - $39.99 (Beginner, 10h)
5. **GraphQL API Development** - $69.99 (Intermediate, 14h)
6. **iOS Development with Swift** - $89.99 (Intermediate, 20h)
7. **Machine Learning Basics** - $99.99 (Beginner, 18h)
8. **Docker and Kubernetes Mastery** - $79.99 (Advanced, 16h)
9. **Web Accessibility (A11y)** - $44.99 (Intermediate, 6h)
10. **PostgreSQL Database Design** - $54.99 (Intermediate, 12h)
11. **Figma for Developers** - $29.99 (Beginner, 5h)
12. **Serverless Architecture** - $74.99 (Advanced, 13h)
13. **React Performance Optimization** - $64.99 (Advanced, 9h)
14. **Git and GitHub Workflow** - $19.99 (Beginner, 4h)
15. **Building REST APIs with Node.js** - $49.99 (Beginner, 11h)

### Draft Courses (Not Published)

16. **Advanced CSS and Animations** - $39.99 (Intermediate, 8h)
17. **Cybersecurity Fundamentals** - $89.99 (Intermediate, 15h)
18. **Test-Driven Development (TDD)** - $54.99 (Intermediate, 10h)

## Using Seed Data

### Apply Seed Data

```bash
# Reset database and apply seed
supabase db reset
```

### Query Sample Data

```sql
-- Get all published courses
SELECT * FROM courses WHERE is_published = true;

-- Get courses by category
SELECT * FROM courses WHERE category = 'Mobile Development';

-- Get courses by level
SELECT * FROM courses WHERE level = 'beginner';

-- Get courses by instructor
SELECT * FROM courses WHERE instructor_id = 'user_instructor_001';

-- Get course statistics
SELECT 
  category,
  COUNT(*) as course_count,
  AVG(price) as avg_price,
  AVG(duration_hours) as avg_duration
FROM courses
WHERE is_published = true
GROUP BY category
ORDER BY course_count DESC;
```

## Customizing Seed Data

To add your own sample courses:

1. Edit `supabase/seed.sql`
2. Add new INSERT statements following the existing pattern
3. Run `supabase db reset` to apply changes

### Template for New Courses

```sql
INSERT INTO courses (
  title,
  description,
  instructor_id,
  thumbnail_url,
  price,
  is_published,
  category,
  level,
  duration_hours
) VALUES (
  'Your Course Title',
  'Detailed course description',
  'user_instructor_001',
  'https://images.unsplash.com/photo-xxxxx?w=800',
  49.99,
  true,
  'Category Name',
  'beginner', -- or 'intermediate', 'advanced'
  10
);
```

## Testing with Real Users

When testing with actual Clerk authentication:

1. Sign in with a Clerk account
2. Get your Clerk user ID from `useAuth().userId`
3. Replace placeholder instructor IDs in seed.sql with your real user ID
4. Run `supabase db reset`

Example:

```sql
-- Replace this
instructor_id = 'user_instructor_001'

-- With your actual Clerk user ID
instructor_id = 'user_2abc123def456'
```

## Image URLs

All thumbnail URLs use Unsplash placeholder images. Replace with your own images in production.

## Notes

- All timestamps (created_at, updated_at) are set automatically by the database
- Course IDs are auto-generated UUIDs
- Prices are in USD (decimal format)
- Duration is in hours
