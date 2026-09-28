import { Stack } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { isAuthenticated } from '@/auth/auth';
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

      const onLogin = segments[0] === 'login';
      if (!authenticated && !onLogin) router.replace('/login');
      else if (authenticated && onLogin) router.replace('/');
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
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="cameraPreviewPage" options={{ title: 'Camera' }} />
        <Stack.Screen name="imagePreviewPage" options={{ title: 'Image preview' }} />
      </Stack>
  );
}
