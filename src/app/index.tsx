import { Redirect } from 'expo-router';

export default function Index() {
  // Try to go to the main app. 
  // RootLayout's <Stack.Protected> will intercept this and send them 
  // to /welcome or /onboarding if they don't meet the requirements!
  return <Redirect href="/(tabs)/featured" />;
}