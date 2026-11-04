import { Stack } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { getAuthRole, isAuthenticated } from '@/auth/auth';
import { ActivityIndicator, View } from 'react-native';


export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function guardRoutes() {
      const authenticated = await isAuthenticated();
      if (!mounted) return;

      const authScreens = ['welcome', 'login', 'adminLogin', 'adminSignup'];
      const onAuthScreen = authScreens.includes(segments[0] ?? '');
      if (!authenticated && !onAuthScreen) router.replace('/welcome');
      else if (authenticated && onAuthScreen) {
        const role = await getAuthRole();
        router.replace(role === 'ADMIN' ? '/adminHome' : '/');
      }
      setAuthChecked(true);
    }

    guardRoutes();
    return () => { mounted = false; };
  }, [router, segments]);

  if (!authChecked) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  }

  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="studentProfile" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="adminLogin" options={{ headerShown: false }} />
        <Stack.Screen name="adminSignup" options={{ headerShown: false }} />
        <Stack.Screen name="adminHome" options={{ headerShown: false }} />
        <Stack.Screen name="adminProfile" options={{ headerShown: false }} />
        <Stack.Screen name="createQuiz" options={{ headerShown: false }} />
        <Stack.Screen name="registerStudent" options={{ headerShown: false }} />
        <Stack.Screen name="adminQuizDetail" options={{ headerShown: false }} />
        <Stack.Screen name="cameraPreviewPage" options={{ title: 'Camera' }} />
        <Stack.Screen name="imagePreviewPage" options={{ title: 'Image preview' }} />
        <Stack.Screen name="exam" options={{ headerShown: false }} />
        <Stack.Screen name="examResult" options={{ headerShown: false }} />
        <Stack.Screen name="examHistory" options={{ headerShown: false }} />
      </Stack>
  );
}
