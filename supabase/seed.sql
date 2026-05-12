-- Seed file for populating the database with sample data
-- This file runs when you execute: supabase db reset

-- Insert sample courses
-- Note: Using placeholder instructor_ids - replace with actual Clerk user IDs in production
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
) VALUES
  (
    'Introduction to React Native',
    'Learn the fundamentals of building mobile applications with React Native. This comprehensive course covers everything from setup to deployment, including navigation, state management, and native modules.',
    'user_instructor_001',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    49.99,
    true,
    'Mobile Development',
    'beginner',
    12
  ),
  (
    'Advanced TypeScript Patterns',
    'Master advanced TypeScript concepts including generics, conditional types, mapped types, and utility types. Build type-safe applications with confidence.',
    'user_instructor_002',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    79.99,
    true,
    'Programming',
    'advanced',
    8
  ),
  (
    'Full-Stack Development with Supabase',
    'Build modern full-stack applications using Supabase. Learn authentication, real-time subscriptions, storage, and edge functions.',
    'user_instructor_001',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    59.99,
    true,
    'Backend Development',
    'intermediate',
    15
  ),
  (
    'UI/UX Design Fundamentals',
    'Learn the principles of user interface and user experience design. Create beautiful, intuitive interfaces that users love.',
    'user_instructor_003',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    39.99,
    true,
    'Design',
    'beginner',
    10
  ),
  (
    'GraphQL API Development',
    'Build powerful and flexible APIs with GraphQL. Learn schema design, resolvers, subscriptions, and best practices.',
    'user_instructor_002',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    69.99,
    true,
    'Backend Development',
    'intermediate',
    14
  ),
  (
    'iOS Development with Swift',
    'Create native iOS applications using Swift and SwiftUI. From basics to App Store deployment.',
    'user_instructor_004',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    89.99,
    true,
    'Mobile Development',
    'intermediate',
    20
  ),
  (
    'Machine Learning Basics',
    'Introduction to machine learning concepts, algorithms, and practical applications using Python.',
    'user_instructor_003',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    99.99,
    true,
    'Data Science',
    'beginner',
    18
  ),
  (
    'Docker and Kubernetes Mastery',
    'Learn containerization and orchestration. Deploy scalable applications with Docker and Kubernetes.',
    'user_instructor_002',
    'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
    79.99,
    true,
    'DevOps',
    'advanced',
    16
  ),
  (
    'Web Accessibility (A11y)',
    'Build inclusive web applications that everyone can use. Learn WCAG guidelines and best practices.',
    'user_instructor_004',
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
    44.99,
    true,
    'Web Development',
    'intermediate',
    6
  ),
  (
    'PostgreSQL Database Design',
    'Master database design, optimization, and advanced PostgreSQL features including indexes, views, and functions.',
    'user_instructor_001',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    54.99,
    true,
    'Database',
    'intermediate',
    12
  ),
  (
    'Figma for Developers',
    'Learn Figma from a developer''s perspective. Understand design handoffs, components, and design systems.',
    'user_instructor_003',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800',
    29.99,
    true,
    'Design',
    'beginner',
    5
  ),
  (
    'Serverless Architecture',
    'Build scalable applications without managing servers. Learn AWS Lambda, API Gateway, and serverless patterns.',
    'user_instructor_002',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    74.99,
    true,
    'Cloud Computing',
    'advanced',
    13
  ),
  (
    'React Performance Optimization',
    'Deep dive into React performance. Learn memoization, code splitting, lazy loading, and profiling techniques.',
    'user_instructor_001',
    'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800',
    64.99,
    true,
    'Web Development',
    'advanced',
    9
  ),
  (
    'Git and GitHub Workflow',
    'Master version control with Git. Learn branching strategies, pull requests, and team collaboration.',
    'user_instructor_004',
    'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800',
    19.99,
    true,
    'Tools',
    'beginner',
    4
  ),
  (
    'Building REST APIs with Node.js',
    'Create robust RESTful APIs using Node.js and Express. Learn authentication, validation, and error handling.',
    'user_instructor_001',
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    49.99,
    true,
    'Backend Development',
    'beginner',
    11
  ),
  (
    'Advanced CSS and Animations',
    'Master modern CSS including Grid, Flexbox, custom properties, and complex animations.',
    'user_instructor_003',
    'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
    39.99,
    false,
    'Web Development',
    'intermediate',
    8
  ),
  (
    'Cybersecurity Fundamentals',
    'Learn essential security concepts, common vulnerabilities, and how to protect your applications.',
    'user_instructor_002',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    89.99,
    false,
    'Security',
    'intermediate',
    15
  ),
  (
    'Test-Driven Development (TDD)',
    'Write better code with test-driven development. Learn unit testing, integration testing, and E2E testing.',
    'user_instructor_004',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    54.99,
    false,
    'Programming',
    'intermediate',
    10
  );

-- Add a comment to track when seed was last updated
COMMENT ON TABLE courses IS 'Last seeded: 2026-05-12';

-- Insert sample chapters for the first course
-- We use a subquery to get the ID of the first course
DO $$
DECLARE
    course_id_1 UUID;
    chapter_id_1 UUID;
    chapter_id_2 UUID;
BEGIN
    SELECT id INTO course_id_1 FROM courses WHERE title = 'Introduction to React Native' LIMIT 1;
    
    IF course_id_1 IS NOT NULL THEN
        -- Chapter 1
        INSERT INTO chapters (course_id, title, order_index)
        VALUES (course_id_1, 'Getting Started', 1)
        RETURNING id INTO chapter_id_1;
        
        -- Lessons for Chapter 1
        INSERT INTO lessons (course_id, chapter_id, title, duration_minutes, order_index, is_preview, resource_url, resource_type)
        VALUES 
            (course_id_1, chapter_id_1, 'Welcome to the Course', 5, 1, true, 'courses/' || course_id_1 || '/lessons/welcome.mp4', 'video'),
            (course_id_1, chapter_id_1, 'Setting up your Environment', 15, 2, false, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', 'video');
            
        -- Chapter 2
        INSERT INTO chapters (course_id, title, order_index)
        VALUES (course_id_1, 'React Native Basics', 2)
        RETURNING id INTO chapter_id_2;
        
        -- Lessons for Chapter 2
        INSERT INTO lessons (course_id, chapter_id, title, duration_minutes, order_index, is_preview, video_url)
        VALUES 
            (course_id_1, chapter_id_2, 'Components and Props', 20, 1, false, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4'),
            (course_id_1, chapter_id_2, 'State and Hooks', 25, 2, false, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4');
    END IF;
END $$;
