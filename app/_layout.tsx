import { isAuthenticated } from '@/auth/auth';
import { colors, fontFamilies } from '@/helper/style';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [authChecked, setAuthChecked] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    [fontFamilies.regular]: require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    [fontFamilies.light]: require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    [fontFamilies.medium]: require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    [fontFamilies.semiBold]: require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    [fontFamilies.bold]: require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    [fontFamilies.extraBold]: require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
  });

  useEffect(() => {
    let mounted = true;
    async function guardRoutes() {
      const authenticated = await isAuthenticated();
      if (!mounted) return;

      const authScreens = ['welcome', 'login'];
      const onAuthScreen = authScreens.includes(segments[0] ?? '');
      if (!authenticated && !onAuthScreen) router.replace('/welcome');
      else if (authenticated && onAuthScreen) router.replace('/');
      setAuthChecked(true);
    }

    guardRoutes();
    return () => { mounted = false; };
  }, [router, segments]);

  useEffect(() => {
    if (authChecked && (fontsLoaded || fontError)) SplashScreen.hideAsync();
  }, [authChecked, fontsLoaded, fontError]);

  if (!authChecked || (!fontsLoaded && !fontError)) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}><ActivityIndicator color={colors.info} /></View>;
  }

  return (
      <>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerStyle: { backgroundColor: colors.card }, headerTintColor: colors.foreground, headerTitleStyle: { fontFamily: fontFamilies.bold, fontSize: 16 }, headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="studentProfile" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="cameraPreviewPage" options={{ title: 'Camera' }} />
        <Stack.Screen name="imagePreviewPage" options={{ title: 'Image preview' }} />
        <Stack.Screen name="exam" options={{ headerShown: false }} />
        <Stack.Screen name="examResult" options={{ headerShown: false }} />
      </Stack>
      </>
  );
}
