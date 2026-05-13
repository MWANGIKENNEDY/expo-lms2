import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { useColorScheme, View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { AlertCircle, RotateCcw } from 'lucide-react-native';

// Your custom imports
import { SplashLoader } from '../components/SplashLoader';
import { useProfile } from '@/lib/api/profiles';
import "../../global.css";

cssInterop(LinearGradient, { className: 'style' });
cssInterop(BlurView, { className: 'style' });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

function RootLayoutNav() {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const colorScheme = useColorScheme();

  // Fetch profile globally so we can guard the onboarding/app routes
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError,
    refetch,
  } = useProfile({
    enabled: isSignedIn && isAuthLoaded,
  });

  // 1. Initial Auth Loading State
  if (!isAuthLoaded) {
    return <SplashLoader />;
  }

  // 2. Profile Loading State
  if (isSignedIn && isProfileLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  // 3. Error State (Failed to fetch profile)
  if (isSignedIn && isError) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900 p-6">
        <View className="items-center">
          <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-6">
            <AlertCircle size={32} color="#EF4444" />
          </View>
          <Text className="text-white text-xl font-bold text-center mb-2">
            Connection Error
          </Text>
          <Text className="text-white/60 text-center mb-8 leading-relaxed max-w-[280px]">
            We couldn't verify your profile status. Please check your internet connection and try again.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="flex-row items-center bg-indigo-600 px-8 py-4 rounded-2xl active:scale-95"
            activeOpacity={0.85}
          >
            <RotateCcw size={18} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 4. Declarative Navigation Stack
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>

        {/* --- UNAUTHENTICATED ROUTES --- */}
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        
        {/* --- AUTHENTICATED ROUTES --- */}
        <Stack.Protected guard={isSignedIn}>
          
          {/* Missing Profile -> Force to Onboarding */}
          <Stack.Protected guard={!profile}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>

          {/* Has Profile -> Full App Access */}
          <Stack.Protected guard={!!profile}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="tutors" options={{ headerShown: false }} />
            <Stack.Screen 
              name="course/[id]" 
              options={{ 
                presentation: 'card',
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="player" 
              options={{ 
                presentation: 'modal',
                animation: 'slide_from_bottom'
              }} 
            />
          </Stack.Protected>

        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </ClerkProvider>
  );
}