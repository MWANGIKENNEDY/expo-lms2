# Onboarding - Expo React Native Project

## Project Overview

This is a React Native mobile application built with Expo, featuring file-based routing via Expo Router and styled with NativeWind (Tailwind CSS for React Native). The project is configured for iOS, Android, and web platforms.

## Tech Stack

- **Framework**: React Native 0.83.6
- **React**: 19.2.0
- **Expo SDK**: ~55.0.16
- **Routing**: Expo Router ~55.0.13 (file-based routing)
- **Styling**: NativeWind 4.2.3 + Tailwind CSS 3.4.19
- **Navigation**: React Navigation 7.x
- **Language**: TypeScript 5.9.2
- **Animations**: React Native Reanimated 4.2.1

## Project Structure

```
onboarding/
├── src/
│   └── app/                    # File-based routing directory
│       ├── _layout.tsx         # Root layout with theme provider
│       └── index.tsx           # Home screen
├── assets/
│   ├── images/                 # App icons, logos, splash screens
│   └── expo.icon/              # iOS icon configuration
├── .expo/                      # Expo configuration and types
├── app.json                    # Expo app configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind/NativeWind configuration
├── global.css                  # Global styles
└── babel.config.js             # Babel configuration
```

## Key Features

### Routing
- **File-based routing** using Expo Router
- Typed routes enabled via `experiments.typedRoutes`
- Stack navigation with hidden headers by default

### Styling
- **NativeWind** for Tailwind CSS utility classes in React Native
- Custom color scheme with CSS variables (HSL format)
- Dark mode support following device color scheme
- Extended theme with custom colors:
  - Primary, secondary, muted, accent
  - Destructive, success
  - Priority levels (low, medium, high)
  - Background, foreground, card, border, input, ring

### Platform Support
- **iOS**: Custom icon configuration
- **Android**: Adaptive icon with background, foreground, and monochrome images
- **Web**: Static output with Metro bundler

### Experimental Features
- React Compiler enabled
- Typed routes for type-safe navigation

## Path Aliases

TypeScript path aliases are configured for cleaner imports:
- `@/*` → `./src/*`
- `@/assets/*` → `./assets/*`

## Available Scripts

```bash
npm start              # Start Expo development server
npm run android        # Start on Android emulator
npm run ios            # Start on iOS simulator
npm run web            # Start web version
npm run lint           # Run ESLint
npm run reset-project  # Reset to blank project
```

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npx expo start
   ```

3. **Run on platform**:
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web
   - Scan QR code with Expo Go app

## Configuration Files

### app.json
- App name: "onboarding"
- Version: 1.0.0
- Orientation: Portrait only
- URL scheme: `onboarding://`
- Splash screen: Blue background (#208AEF)
- Plugins: expo-router, expo-splash-screen

### tsconfig.json
- Extends Expo base configuration
- Strict mode enabled
- Path aliases configured

### tailwind.config.js
- Content paths: `./src/**/*.{js,jsx,ts,tsx}`
- Dark mode: Follows device color scheme
- Custom color system with HSL variables

## Current Implementation

### Root Layout (`src/app/_layout.tsx`)
- Wraps app with `ThemeProvider` from React Navigation
- Automatically switches between light/dark themes based on device settings
- Imports global CSS styles
- Configures Stack navigator with hidden headers

### Home Screen (`src/app/index.tsx`)
- Simple welcome screen demonstrating NativeWind classes
- Centered layout with styled text

## Dependencies Highlights

### Core
- `expo`: ~55.0.16
- `react-native`: 0.83.6
- `react`: 19.2.0

### Navigation & Routing
- `expo-router`: ~55.0.13
- `@react-navigation/native`: ^7.1.33
- `@react-navigation/bottom-tabs`: ^7.15.5

### UI & Styling
- `nativewind`: ^4.2.3
- `tailwindcss`: ^3.4.19
- `expo-glass-effect`: ~55.0.10
- `expo-symbols`: ~55.0.7

### Utilities
- `expo-constants`: ~55.0.15
- `expo-device`: ~55.0.15
- `expo-linking`: ~55.0.14
- `expo-web-browser`: ~55.0.14

### Animations
- `react-native-reanimated`: ^4.2.1
- `react-native-gesture-handler`: ~2.30.0
- `react-native-worklets`: 0.7.4

## Next Steps / Recommendations

1. **Add screens**: Create additional screens in `src/app/` directory
2. **Navigation**: Implement tab or drawer navigation using React Navigation
3. **Components**: Create reusable UI components in `src/components/`
4. **State Management**: Consider adding Zustand, Redux, or React Query
5. **API Integration**: Set up API client and data fetching
6. **Testing**: Configure Jest for unit testing
7. **Linting**: Run `npx expo lint` to set up ESLint
8. **Environment Variables**: Use `expo-constants` for environment configuration

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Notes

- Project uses React 19.2.0 (latest stable)
- Expo SDK 55 with latest features
- TypeScript strict mode enabled for better type safety
- Predictive back gesture disabled on Android
- Web output configured as static with Metro bundler
