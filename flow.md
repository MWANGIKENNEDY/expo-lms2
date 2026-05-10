# ULearner Architectural Flow (v2 - Hidden Tabs)

This document outlines the lifecycle, navigation logic, and state management of the ULearner app, following the "Hidden Tabs" architecture.

---

## 🎬 1. App Initialization & Boot
When the app launches, the `RootLayout` (`src/app/_layout.tsx`) initializes the global service layer:

1.  **Context Wrappers**: 
    - `ClerkProvider`: Manages authentication state and tokens.
    - `CoursesProvider`: A centralized LMS state management layer (enrollments, progress, lessons).
    - `QueryClientProvider`: Handles Supabase profile caching.
2.  **The Gatekeeper**: The `RootLayoutNav` checks the `isLoaded` and `isSignedIn` state from Clerk.
3.  **Splash Experience**: While authenticating, the app displays the **`SplashLoader`** with themed aurora gradients and glassmorphism animations.

---

## 🔒 2. Centralized Authentication Gates
The routing is managed by native `Stack.Protected` guards in the root layout. This architecture ensures that unauthenticated users can never access app content, and authenticated users don't see login screens.

### Path A: Unauthenticated Flow
- **Guard**: `!isSignedIn` is `true`.
- **Target**: `(auth)` group.
- **Entry**: The user lands on the **Welcome** screen (`src/app/(auth)/welcome.tsx`).
- **Goal**: Conversion via Clerk Login/Signup.

### Path B: Authenticated Flow
- **Guard**: `isSignedIn` is `true`.
- **Target**: Main app screens (`(tabs)`, `course/[id]`, `player`, `onboarding`).
- **Logic**: Upon login, the user is redirected to `index.tsx`, which acts as a hub to decide whether to send them to `onboarding` or the main `featured` dashboard.

---

## 🚀 3. Onboarding & Profile Sync
- **Logic**: Authenticated but missing a profile in Supabase.
- **Screen**: `src/app/onboarding.tsx`.
- **Process**:
  - User selects interests (e.g., Programming, Design).
  - A profile is created in the Supabase `profiles` table.
  - Upon completion, the user is redirected to `/(tabs)/featured`.

---

## 🏠 4. The "Hidden Tabs" Experience
This architecture separates **Tabbed Screens** from **Standalone Overlays** at the root level to allow deep-link screens to hide the bottom tab bar.

### A. The Tab Bar (`src/app/(tabs)`)
- **Featured**: Home dashboard with personalized recommendations.
- **Discover**: Course search and exploration.
- **Learning**: Personal library of enrolled courses.
- **Account**: Profile management and settings.

### B. Standalone Overlays (The Deep-Link Screens)
- **Course Details** (`src/app/course/[id].tsx`): Opens as a slide-in card over the current tab.
- **Video Player** (`src/app/player.tsx`): Opens as a full-screen modal (slide-from-bottom) to provide an immersive learning environment without the tab bar distraction.

---

## 🛠️ 5. State Management & Data Layer
- **CoursesContext**: The "brain" of the LMS. It manages a unified state for:
  - Enrolled courses list.
  - Lesson completion status.
  - Real-time progress tracking.
- **Supabase**: Persistent storage for `profiles`, `courses`, `lessons`, and `enrollments`.
- **Clerk**: Secure identity and session management.
- **NativeWind**: Utility-first styling for a premium, responsive glassmorphism UI.

---

## 🔗 6. Navigation Logic Summary
- `/` (Index) → Redirect Hub
- `/(auth)/welcome` → Unauthenticated Entry
- `/(tabs)/featured` → Authenticated Dashboard
- `/course/[id]` → Standalone Detail (No Tabs)
- `/player` → Immersive Learning (Modal)
