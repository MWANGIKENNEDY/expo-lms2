# 🎨 DESIGN REPLICATION INSTRUCTIONS

> **IMPORTANT**: The screen HTML files are located in the `screens/` folder within this exported ZIP file. You MUST replicate the designs **one-to-one** exactly as shown in these HTML files.

## Critical Requirements

- **Source of Truth**: The HTML files in the `screens/` folder are the definitive reference designs
- **Exact Replication**: Every visual element, spacing, color, typography, and layout must match the HTML prototypes precisely
- **No Improvisation**: Do not change or "improve" the design - replicate it pixel-perfect as shown
- **All Screens**: If there are many screens, create an appropriate implementation plan, but remember each screen must be an exact visual replica
- **All-in-One File**: The `*_all_in_one.html` file in the root is for preview only - use the individual screen HTML files in `screens/` as your reference

---

# PROJECT DOCUMENTATION: ULearner LMS

## 1. Project Overview
**ULearner LMS** is a premium, modern learning management system designed for mobile platforms (iOS/Android). The app provides an immersive experience for users to access high-definition video lessons, interactive quizzes, and earn industry-recognized certificates across various subjects like Programming, Design, and Business.

### Target Audience
- Professional upskillers looking for a premium learning experience.
- Students preferring micro-learning and mobile-first education.
- Creative and tech enthusiasts drawn to modern, high-fidelity UI/UX.

### Key Features
- **Personalized Learning Paths**: AI-driven curriculum based on user interests.
- **Glassmorphism UI**: A futuristic "Glass & Gradient Aurora" aesthetic with frosted panels and backdrop blurs.
- **Progress Tracking**: Gradient progress rings and glowing daily streak counters to boost retention.
- **Interactive Content**: HD video player with integrated resource downloads and lesson completion toggles.
- **Smart Discovery**: Categorized search with advanced filters (Difficulty, Price, Duration) and skeleton loading states.

---

## 2. Visual Flow Diagram

```text
       ONBOARDING FLOW
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│    welcome_screen    │ ▶─── │ social_proof_screen  │ ▶─── │features_showcase_scr │
└──────────┬───────────┘      └──────────────────────┘      └──────────┬───────────┘
           │                                                           │
           │ (Already have account)                                    ▼
           │                  ┌──────────────────────┐      ┌──────────────────────┐
           └────────────────▶ │  learning_dashboard  │ ◀─── │ path_selection_screen│
                              └──────────▲───────────┘      └──────────┬───────────┘
                                         │                             │
                                         │ (Subscribe/Trial)           ▼
                              ┌──────────────────────┐      ┌──────────────────────┐
                              │ subscription_paywall │ ◀─── │path_confirmation_scr │
                              └──────────────────────┘      └──────────────────────┘

       MAIN APP LOOP
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│  learning_dashboard  │ ◀──▶ │course_discovery_scr  │ ◀──▶ │search_results_screen │
└──────────┬───────────┘      └──────────┬───────────┘      └──────────┬───────────┘
           │                             │                             │
           └─────────────────────────────┴──────────────┬──────────────┘
                                                        ▼
                              ┌──────────────────────┐      ┌──────────────────────┐
                              │ course_details_screen│ ◀─── │ lesson_player_screen │
                              └──────────────────────┘      └──────────────────────┘
```

---

## 3. User Journeys

### Journey 1: The Onboarding Experience
- **Goal**: Convert a new visitor into a registered/subscribed user.
- **Steps**:
    1. User lands on `welcome_screen`, views a high-level value prop and a "Did you know?" fact.
    2. Navigates to `social_proof_screen` to see testimonials and app ratings.
    3. Views `features_showcase_screen` to understand technical benefits (Offline mode, HD video).
    4. Customizes experience in `path_selection_screen`.
    5. Receives validation in `path_confirmation_screen`.
    6. Encounters the `subscription_paywall_screen` with a limited-time offer.

### Journey 2: Daily Learning Routine
- **Goal**: Resume a current course and maintain engagement.
- **Steps**:
    1. User opens `learning_dashboard`, checks their 12-day streak glow.
    2. Taps the "Continue Learning" glass card.
    3. Lands in `lesson_player_screen` to watch the next video.
    4. Marks lesson as completed and navigates to the next.

### Journey 3: Course Exploration
- **Goal**: Discover and enroll in new subjects.
- **Steps**:
    1. User navigates to `course_discovery_screen` via the bottom tab bar.
    2. Browses frosted glass category tiles or uses the search bar.
    3. Refines search in `search_results_screen` using smart filters.
    4. Selects a course to view `course_details_screen` (tutor info, curriculum).
    5. Enrolls and starts learning.

---

## 4. Screen Inventory

| ID | Screen Name | Filename | Purpose |
|:---|:---|:---|:---|
| 1 | Welcome | `welcome_screen.html` | Hero entry point with brand identity and micro-learning facts. |
| 2 | Social Proof | `social_proof_screen.html` | Build trust via ratings (4.9/5) and user testimonials. |
| 3 | Features Showcase | `features_showcase_screen.html` | Highlights app capabilities: HD Video, Quizzes, Offline mode. |
| 4 | Path Selection | `path_selection_screen.html` | User interest profiling (Programming, Design, etc.). |
| 5 | Path Confirmation | `path_confirmation_screen.html` | Affirmation of user choice ("We've got this!") and plan summary. |
| 6 | Subscription Paywall | `subscription_paywall_screen.html` | Conversion page with yearly/monthly plans and FOMO timer. |
| 7 | Learning Dashboard | `learning_dashboard.html` | Main hub with progress ring, streak, and "Continue" deep-link. |
| 8 | Course Discovery | `course_discovery_screen.html` | Search and category-based exploration. |
| 9 | Course Details | `course_details_screen.html` | Full curriculum, tutor profile, and enrollment CTA. |
| 10 | Lesson Player | `lesson_player_screen.html` | Immersive video playback with completion toggles and resources. |
| 11 | Search Results | `search_results_screen.html` | Filterable course list with skeleton loaders for performance feel. |

---

## 5. Data Models

### User Profile
```json
{
  "id": "uuid",
  "name": "Sarah Jenkins",
  "avatar_url": "string",
  "streak_days": 12,
  "interests": ["Programming"],
  "subscription_status": "active",
  "completed_lessons": ["lesson_id_1", "lesson_id_2"]
}
```

### Course
```json
{
  "id": "uuid",
  "title": "Mastering the Glassmorphism Aesthetic",
  "category": "Design",
  "difficulty": "Advanced",
  "rating": 4.9,
  "student_count": 12500,
  "price": 49.99,
  "tutor": {
    "name": "Julian Casablancas",
    "role": "Senior Visual Designer @ Meta"
  },
  "chapters": [
    {
      "title": "Chapter 1: The Basics",
      "lessons": [
        { "title": "Introduction to Transparency", "duration": "12:45", "type": "video" }
      ]
    }
  ]
}
```

---

## 6. Implementation Requirements

### Design Replication (CRITICAL)
- **Source of Truth**: The provided HTML files in the `screens/` folder are the absolute design specification.
- **Glassmorphism**: Replicate `backdrop-filter: blur(20px)` and `rgba(255, 255, 255, 0.08)` backgrounds precisely.
- **Aurora Gradients**: Use exact hex codes found in the CSS `:root` variables:
    - Primary: `#4F46E5` (Indigo)
    - Secondary: `#7C3AED` (Purple)
    - Tertiary: `#10B981` (Emerald) / `#EC4899` (Pink)
- **Typography**: Primary font is **Inter**. Bold headers must use `tracking-tight`.
- **Animations**: Replicate the `pulse` ring on the confirmation screen and the `bounce` icon on the welcome screen.

### Technical Recommendations
- **Platform**: React Native or Flutter.
- **Styles**: If using React Native, **NativeWind** (Tailwind for React Native) is recommended to match the utility classes in the prototypes.
- **Icons**: Use **Lucide React** or the Iconify framework as specified in the HTML (`lucide:` prefix).
- **State Management**: Required for handling the "Path Selection" data and "Lesson Completion" status across the dashboard and player.

### Phased Implementation Plan
1. **Phase 1: Brand & Onboarding (Screens 1-6)**
   - Focus: Establishing the Aurora background components and Glass cards.
2. **Phase 2: Dashboard & Discovery (Screens 7-8, 11)**
   - Focus: Implementing the horizontal carousels, progress rings, and skeleton loaders.
3. **Phase 3: Learning Experience (Screens 9-10)**
   - Focus: Video player integration, curriculum lists, and deep-linking from the dashboard.