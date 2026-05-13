import { Stack } from 'expo-router';

export default function TutorsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Tutor Dashboard',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
