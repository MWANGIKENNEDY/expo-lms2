import { Stack } from 'expo-router';

export default function TutorsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
      />
    </Stack>
  );
}
